<?php defined( 'ABSPATH' ) || exit; ?>
<?php get_header(); ?>

  <main id="main">
    <section class="page-hero page-hero--compact" aria-labelledby="privacy-title">
      <div class="container container--narrow">
        <h1 class="h1" id="privacy-title" data-split-lines>Privacy <em class="text-accent">policy.</em></h1>
        <p class="lead">How we handle the information you share with us.</p>
        <p class="meta-line">Last updated: <span>[Date to be confirmed]</span></p>
      </div>
    </section>

    <section class="section section--flush-top">
      <div class="container container--narrow">
        <!-- LEGAL REVIEW REQUIRED: this is a structural template, not legal advice.
             The client's counsel must review and complete it (jurisdiction, retention, processors, contact details). -->
        <p class="dev-note"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.8v.2"/></svg> <span><strong>Template for layout only.</strong> This policy must be reviewed and completed by the client&rsquo;s legal counsel before launch.</span></p>

        <nav class="toc" aria-label="On this page">
          <p class="toc__title">On this page</p>
          <ol class="toc__list">
            <li><a href="#collect">Information we collect</a></li>
            <li><a href="#use">How we use your information</a></li>
            <li><a href="#photos">Photos you upload</a></li>
            <li><a href="#device">Information saved on your device</a></li>
            <li><a href="#sharing">Sharing</a></li>
            <li><a href="#retention">Retention</a></li>
            <li><a href="#choices">Your choices</a></li>
            <li><a href="#contact">Contact us</a></li>
          </ol>
        </nav>

        <article class="prose legal">
<?php if ( have_posts() && trim( get_post_field( 'post_content', get_the_ID() ) ) ) : the_post(); the_content(); else : ?>
          <h2 id="collect">Information we collect</h2>
          <p>When you request an estimate or contact us, you may provide:</p>
          <ul>
            <li>Contact details, such as your name, email address and phone number.</li>
            <li>The address of the property where the project would take place.</li>
            <li>Project details, such as the number of windows, style, color and grid preferences, and descriptions you write.</li>
            <li>Photos you choose to upload.</li>
          </ul>

          <h2 id="use">How we use your information</h2>
          <p>We use the information you provide to review your project, prepare a proposal, and follow up with you about next steps. We do not sell your personal information.</p>

          <h2 id="photos">Photos you upload</h2>
          <p>Photos help our team understand your home. Please avoid including people, personal documents or other sensitive details in your photos.</p>

          <h2 id="device">Information saved on your device</h2>
          <p>To let you pause and return to your estimate, your answers (but not your photos) are saved in your browser&rsquo;s local storage on the device you&rsquo;re using. This draft is removed automatically after 7 days, when you submit your project, or when you choose &ldquo;Start over.&rdquo; It is not sent to us until you submit.</p>

          <h2 id="sharing">Sharing</h2>
          <p>[To be completed by the client: service providers that process submissions (for example, form handling or email delivery), and any other circumstances in which information is shared.]</p>

          <h2 id="retention">Retention</h2>
          <p>[To be completed by the client: how long estimate requests, photos and messages are kept.]</p>

          <h2 id="choices">Your choices</h2>
          <p>You can ask us to access, correct or delete the information you&rsquo;ve submitted by contacting us. [Add any jurisdiction-specific rights as advised by counsel.]</p>

          <h2 id="contact">Contact us</h2>
          <p>Questions about this policy? Reach us through our <a href="<?php echo esc_url( dh_url( 'contact' ) ); ?>">contact page</a>.</p>
        <?php endif; ?>
        </article>
      </div>
    </section>
  </main>

  <?php get_footer(); ?>
