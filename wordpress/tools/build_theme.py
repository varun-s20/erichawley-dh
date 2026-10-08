"""Generate the WordPress theme (wordpress/theme/dh-remodel) from the static prototype.

Re-run after any prototype change:   python wordpress/tools/build_theme.py
Hand-written files (functions.php, inc/setup.php, style.css, index.php, page.php) are
only created if missing; every page template, header, footer and the asset copy are
regenerated from the .html files so the theme never drifts from the design.
"""
import html
import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]          # project root (the prototype)
THEME = ROOT / 'wordpress' / 'theme' / 'dh-remodel'

# prototype file -> (route key, WordPress page slug or None, template file)
PAGES = {
    'index.html':        ('index',        None,             'front-page.php'),
    'windows.html':      ('windows',      'windows',        'page-windows.php'),
    'bath-remodel.html': ('bath-remodel', 'bath-remodel',   'page-bath-remodel.php'),
    'our-work.html':     ('our-work',     'our-work',       'page-our-work.php'),
    'about.html':        ('about',        'about',          'page-about.php'),
    'contact.html':      ('contact',      'contact',        'page-contact.php'),
    'privacy.html':      ('privacy',      'privacy-policy', 'page-privacy-policy.php'),
    'estimate.html':     ('estimate',     'estimate',       'page-estimate.php'),
    '404.html':          ('404',          None,             '404.php'),
}
ROUTES = {f[:-5]: key for f, (key, _, _) in PAGES.items()}   # 'privacy' -> 'privacy' etc.

GUARD = "<?php defined( 'ABSPATH' ) || exit; ?>\n"


def php(expr):
    return f'<?php {expr} ?>'


def rewrite(markup):
    """Prototype markup -> PHP template markup (links, assets, brand, logo)."""
    # internal page links:  href="contact.html#x" / "estimate.html?project=bath"
    def link(m):
        name, rest = m.group(1), m.group(2) or ''
        if name not in ROUTES:
            return m.group(0)
        suffix = f", '{rest}'" if rest else ''
        return f'href="{php(f"echo esc_url( dh_url( {ROUTES[name]!r}{suffix} ) );")}"'
    markup = re.sub(r'href="([a-z0-9-]+)\.html([?#][^"]*)?"', link, markup)
    # logo emblem -> settings-driven logo (falls back to the theme file)
    markup = re.sub(r'assets/images/brand/installd-emblem-(\d+)\.(webp|png)',
                    lambda m: php(f"echo esc_url( dh_logo_url( {m.group(1)} ) );"), markup)
    # every other asset path (src, srcset lists, url()) -> theme folder
    markup = re.sub(r'(?<=["\s,(])assets/', php('dh_assets();') + 'assets/', markup)
    # brand name (copy and attributes). Order matters: longest first.
    markup = markup.replace('install-D Home Remodeling', php('dh_brand_e();'))
    markup = markup.replace('INSTALL-D', php('dh_brand_short_e( true );'))
    markup = re.sub(r'install-D(?![a-z])', php('dh_brand_short_e();'), markup)
    return markup


def between(text, start, end):
    i = text.index(start)
    j = text.index(end, i)
    return text[i:j + len(end)]


def head_meta(text):
    title = html.unescape(re.search(r'<title>(.*?)</title>', text, re.S).group(1))
    desc = re.search(r'<meta name="description" content="([^"]*)"', text)
    pre = re.search(r'<link rel="preload" as="image"[^>]*>', text)
    body = re.search(r'<body([^>]*)>', text).group(1)
    return {
        'title': title.replace('install-D Home Remodeling', '{brand}').replace('install-D', '{short}'),
        'description': html.unescape(desc.group(1)) if desc else '',
        'preload': re.sub(r'(?<=["\s,])assets/', '{assets}assets/', pre.group(0)) if pre else '',
        'data_page': re.search(r'data-page="([^"]+)"', body).group(1),
        'overlay': 'data-header="overlay"' in body,
    }


def current_marks(header):
    """Strip the per-page aria-current and let PHP decide which nav item is current."""
    header = header.replace(' aria-current="page"', '')
    return re.sub(r'(<a class="mobile-nav__link" href="<\?php echo esc_url\( dh_url\( \'([a-z0-9-]+)\'[^>]*?\?>")',
                  lambda m: m.group(1) + php(f"dh_current( {m.group(2)!r} );"), header)


def write(path, content):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding='utf-8', newline='\n')


def main():
    THEME.mkdir(parents=True, exist_ok=True)
    texts = {f: (ROOT / f).read_text(encoding='utf-8') for f in PAGES}

    # ---- assets: css, js, fonts, icons, images ---------------------------------
    for sub in ('css', 'js', 'fonts', 'icons', 'images'):
        dst = THEME / 'assets' / sub
        if dst.exists():
            shutil.rmtree(dst)
        shutil.copytree(ROOT / 'assets' / sub, dst)

    # ---- minify the stylesheet and script for production (the prototype keeps the readable files)
    import subprocess
    for src, dst in (('assets/css/styles.css', THEME / 'assets/css/styles.css'), ('assets/js/main.js', THEME / 'assets/js/main.js')):
        before = (ROOT / src).stat().st_size
        subprocess.run(['npx', '-y', 'esbuild@0.24', str(ROOT / src), '--minify', '--log-level=warning', f'--outfile={dst}'],
                       check=True, shell=(__import__('os').name == 'nt'))
        print(f'minified {src}: {before // 1024} KB -> {dst.stat().st_size // 1024} KB')

    # ---- per-page data (titles, descriptions, preload, body attrs) -----------------
    meta = {PAGES[f][0]: head_meta(t) for f, t in texts.items()}
    write(THEME / 'inc' / 'pages.php',
          "<?php\n/* GENERATED by wordpress/tools/build_theme.py — do not edit; edit the prototype and re-run. */\n"
          "defined( 'ABSPATH' ) || exit;\n\nreturn json_decode( " + repr(json.dumps(meta, ensure_ascii=False)) + ", true );\n")

    # ---- shared header / footer (from privacy.html: no page-specific marks) --------
    ref = texts['privacy.html']
    header = between(ref, '<!-- BEGIN: site-header', '<!-- END: site-header -->')
    footer = between(ref, '<!-- BEGIN: site-footer', '<!-- END: site-footer -->')
    write(THEME / 'header.php', GUARD + HEAD_OPEN + current_marks(rewrite(header)) + '\n')
    write(THEME / 'footer.php', GUARD + '  ' + rewrite(footer) + '\n' + FOOT_CLOSE)

    # ---- page templates ------------------------------------------------------------
    for f, (key, slug, tpl) in PAGES.items():
        t = texts[f]
        if f == 'estimate.html':
            body = t[t.index('<body'):]
            body = body[body.index('>') + 1:body.rindex('</body>')]
            write(THEME / 'header-estimate.php', GUARD + HEAD_OPEN)
            write(THEME / 'footer-estimate.php', GUARD + FOOT_CLOSE)
            write(THEME / tpl, GUARD + "<?php get_header( 'estimate' ); ?>" + rewrite(body) + "<?php get_footer( 'estimate' ); ?>\n")
            continue
        main_part = t[t.index('<!-- END: site-header -->') + len('<!-- END: site-header -->'):t.index('<!-- BEGIN: site-footer')]
        main_part = rewrite(main_part)
        if f == 'privacy.html':
            # the policy text comes from the page editor; the prototype text is the fallback
            art = re.search(r'(<article class="prose legal">)(.*?)(</article>)', main_part, re.S)
            main_part = (main_part[:art.start(2)]
                         + "\n<?php if ( have_posts() && trim( get_post_field( 'post_content', get_the_ID() ) ) ) : the_post(); the_content(); else : ?>"
                         + art.group(2) + '<?php endif; ?>\n        ' + main_part[art.end(2):])
        write(THEME / tpl, GUARD + "<?php get_header(); ?>" + main_part + "<?php get_footer(); ?>\n")

    # the default privacy text, so the plugin can seed the page on activation
    priv = re.search(r'<article class="prose legal">(.*?)</article>', texts['privacy.html'], re.S).group(1)
    write(THEME / 'inc' / 'privacy-default.html', priv.strip() + '\n')

    leftovers = [p.name for p in THEME.glob('*.php') if re.search(r'\.html["?#]|install-D|"assets/', p.read_text(encoding='utf-8'))]
    print('theme written to', THEME)
    print('templates with leftover .html links / brand / bare asset paths:', leftovers or 'none')


HEAD_OPEN = """<!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#06070C">
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?> data-page="<?php echo esc_attr( dh_page_data( 'data_page' ) ); ?>"<?php echo dh_page_data( 'overlay' ) ? ' data-header="overlay"' : ''; ?>>
<?php wp_body_open(); ?>
  """

FOOT_CLOSE = """<?php wp_footer(); ?>
</body>
</html>
"""

if __name__ == '__main__':
    main()
