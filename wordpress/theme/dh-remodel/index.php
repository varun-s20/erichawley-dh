<?php
/**
 * Fallback template (required by WordPress). Real pages use page-{slug}.php,
 * front-page.php and 404.php, generated from the prototype.
 */
defined( 'ABSPATH' ) || exit;
get_header();
?>
  <main id="main">
    <section class="page-hero page-hero--compact">
      <div class="container">
        <h1 class="h1"><?php echo esc_html( is_singular() ? get_the_title() : wp_get_document_title() ); ?></h1>
      </div>
    </section>
    <section class="section section--flush-top">
      <div class="container">
        <article class="prose">
          <?php
          while ( have_posts() ) :
          	the_post();
          	the_content();
          endwhile;
          ?>
        </article>
      </div>
    </section>
  </main>
<?php
get_footer();
