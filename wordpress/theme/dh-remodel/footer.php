<?php defined( 'ABSPATH' ) || exit; ?>
  <!-- BEGIN: site-footer (shared partial — becomes footer.php in a CMS) -->
  <footer class="site-footer" data-header-theme="dark">
    <div class="container">
      <div class="footer__grid">
        <nav class="footer__col" aria-label="Quick links">
          <h2 class="footer__title">Quick links</h2>
          <ul class="footer__links" role="list">
            <li><a href="<?php echo esc_url( dh_url( 'index' ) ); ?>">Home</a></li>
            <li><a href="<?php echo esc_url( dh_url( 'our-work' ) ); ?>">Our Work</a></li>
            <li><a href="<?php echo esc_url( dh_url( 'about' ) ); ?>">About</a></li>
            <li><a href="<?php echo esc_url( dh_url( 'contact' ) ); ?>">Contact</a></li>
          </ul>
        </nav>
        <nav class="footer__col" aria-label="Services">
          <h2 class="footer__title">Services</h2>
          <ul class="footer__links" role="list">
            <li><a href="<?php echo esc_url( dh_url( 'windows' ) ); ?>">Replacement Windows</a></li>
            <li><a href="<?php echo esc_url( dh_url( 'bath-remodel' ) ); ?>">Bath Remodel</a></li>
            <li><a href="<?php echo esc_url( dh_url( 'estimate' ) ); ?>">Free Online Estimate</a></li>
            <li><a href="<?php echo esc_url( dh_url( 'contact' ) ); ?>">In-person Quote</a></li>
          </ul>
        </nav>
        <div class="footer__col">
          <h2 class="footer__title">Get in touch</h2>
          <ul class="footer__links" role="list">
            <li><a href="<?php echo esc_url( dh_url( 'contact' ) ); ?>">Send us a message</a></li>
            <li><a href="<?php echo esc_url( dh_url( 'privacy' ) ); ?>">Privacy Policy</a></li>
            <!-- Populated from SITE_CONFIG in main.js — stays hidden until real details are supplied. -->
            <li data-config-item="phone" hidden><a data-config-link href="<?php echo esc_url( dh_url( 'contact' ) ); ?>"></a></li>
            <li data-config-item="email" hidden><a data-config-link href="<?php echo esc_url( dh_url( 'contact' ) ); ?>"></a></li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom">
        <a class="footer__wordmark" href="<?php echo esc_url( dh_url( 'index' ) ); ?>" aria-label="<?php dh_brand_e(); ?> — home">
          <img class="footer__wordmark-mark" src="<?php echo esc_url( dh_logo_url( 256 ) ); ?>" width="256" height="256" alt="" loading="lazy" decoding="async">
          <span><?php dh_brand_short_e( true ); ?></span>
        </a>
        <div class="footer__legal">
          <p>&copy; <span data-year>2026</span> <?php dh_brand_e(); ?>. All rights reserved.</p>
          <p class="footer__credit">Created with love by <a href="https://digitalheroesco.com/" target="_blank" rel="noopener">Digital Heroes</a></p>
          <a href="<?php echo esc_url( dh_url( 'privacy' ) ); ?>">Privacy Policy</a>
        </div>
      </div>
    </div>
  </footer>
  <!-- END: site-footer -->
<?php wp_footer(); ?>
</body>
</html>
