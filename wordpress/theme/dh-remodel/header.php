<?php defined( 'ABSPATH' ) || exit; ?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#06070C">
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?> data-page="<?php echo esc_attr( dh_page_data( 'data_page' ) ); ?>"<?php echo dh_page_data( 'overlay' ) ? ' data-header="overlay"' : ''; ?>>
<?php wp_body_open(); ?>
  <!-- BEGIN: site-header (shared partial — becomes header.php / a template part in a CMS) -->
  <a class="skip-link" href="#main">Skip to main content</a>
  <header class="site-header" data-site-header>
    <div class="container site-header__inner">
      <div class="site-header__left">
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" data-nav-toggle>
          <span class="visually-hidden">Open menu</span>
          <span class="nav-toggle__bars" aria-hidden="true"></span>
        </button>
        <nav class="header-split" aria-label="Services">
          <a class="header-split__link" href="<?php echo esc_url( dh_url( 'index', '#services' ) ); ?>">Services</a><span class="header-split__sep" aria-hidden="true">/</span><a class="header-split__link" href="<?php echo esc_url( dh_url( 'our-work' ) ); ?>">Our Work</a>
        </nav>
      </div>
      <a class="brand" href="<?php echo esc_url( dh_url( 'index' ) ); ?>" aria-label="<?php dh_brand_e(); ?> — home">
        <img class="brand__mark" src="<?php echo esc_url( dh_logo_url( 128 ) ); ?>" width="128" height="128" alt="" decoding="async">
        <span class="brand__name"><?php dh_brand_short_e( true ); ?></span>
      </a>
      <div class="site-header__actions">
        <a class="header-pill site-header__quote" href="<?php echo esc_url( dh_url( 'contact' ) ); ?>"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1z"/></svg>In-person quote</a>
        <a class="btn btn--primary btn--sm site-header__cta" href="<?php echo esc_url( dh_url( 'estimate' ) ); ?>"><span class="site-header__cta-long">Free estimate</span><span class="site-header__cta-short">Estimate</span></a>
      </div>
    </div>
  </header>

  <div class="mobile-nav" id="mobile-nav" data-mobile-nav>
    <div class="mobile-nav__backdrop" data-nav-close></div>
    <div class="mobile-nav__panel" role="dialog" aria-modal="true" aria-label="Site menu">
      <div class="mobile-nav__top">
        <a class="brand" href="<?php echo esc_url( dh_url( 'index' ) ); ?>" aria-label="<?php dh_brand_e(); ?> — home">
          <img class="brand__mark" src="<?php echo esc_url( dh_logo_url( 128 ) ); ?>" width="128" height="128" alt="" decoding="async">
          <span class="brand__name"><?php dh_brand_short_e( true ); ?></span>
        </a>
        <button class="icon-btn" type="button" data-nav-close aria-label="Close menu"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
      </div>
      <nav aria-label="Site">
        <ul class="mobile-nav__list" role="list">
          <li><a class="mobile-nav__link" href="<?php echo esc_url( dh_url( 'index' ) ); ?>"<?php dh_current( 'index' ); ?>><span>Home</span><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></li>
          <li><a class="mobile-nav__link" href="<?php echo esc_url( dh_url( 'windows' ) ); ?>"<?php dh_current( 'windows' ); ?>><span>Windows</span><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></li>
          <li><a class="mobile-nav__link" href="<?php echo esc_url( dh_url( 'bath-remodel' ) ); ?>"<?php dh_current( 'bath-remodel' ); ?>><span>Bath Remodel</span><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></li>
          <li><a class="mobile-nav__link" href="<?php echo esc_url( dh_url( 'our-work' ) ); ?>"<?php dh_current( 'our-work' ); ?>><span>Our Work</span><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></li>
          <li><a class="mobile-nav__link" href="<?php echo esc_url( dh_url( 'about' ) ); ?>"<?php dh_current( 'about' ); ?>><span>About</span><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></li>
          <li><a class="mobile-nav__link" href="<?php echo esc_url( dh_url( 'contact' ) ); ?>"<?php dh_current( 'contact' ); ?>><span>Contact</span><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></li>
        </ul>
      </nav>
      <div class="mobile-nav__footer">
        <a class="btn btn--primary btn--lg btn--block" href="<?php echo esc_url( dh_url( 'estimate' ) ); ?>">Free online estimate</a>
        <a class="btn btn--secondary btn--lg btn--block" href="<?php echo esc_url( dh_url( 'contact' ) ); ?>">Request an in-person quote</a>
      </div>
    </div>
  </div>
  <!-- END: site-header -->
