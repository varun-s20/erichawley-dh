<?php defined( 'ABSPATH' ) || exit; ?>
<?php get_header(); ?>

  <main id="main">
    <section class="not-found" aria-labelledby="nf-title">
      <div class="container not-found__inner">
        <div class="not-found__art" data-diagram="grid" data-grid="colonial" aria-hidden="true"></div>
        <h1 class="h1" id="nf-title" data-split-lines>We couldn&rsquo;t find <em class="text-accent">that page.</em></h1>
        <p class="lead">The page may have moved, or the link may be out of date. Here are a few good places to go next.</p>
        <div class="not-found__actions">
          <a class="btn btn--primary btn--lg" href="<?php echo esc_url( dh_url( 'index' ) ); ?>">Back to Homepage</a>
          <a class="btn btn--secondary btn--lg" href="<?php echo esc_url( dh_url( 'estimate' ) ); ?>">Start Your Estimate</a>
        </div>
        <ul class="not-found__links" role="list">
          <li><a class="link-arrow" href="<?php echo esc_url( dh_url( 'windows' ) ); ?>">Replacement Windows <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></li>
          <li><a class="link-arrow" href="<?php echo esc_url( dh_url( 'bath-remodel' ) ); ?>">Bath Remodel <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></li>
          <li><a class="link-arrow" href="<?php echo esc_url( dh_url( 'contact' ) ); ?>">Contact Us <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></li>
        </ul>
      </div>
    </section>
  </main>

  <?php get_footer(); ?>
