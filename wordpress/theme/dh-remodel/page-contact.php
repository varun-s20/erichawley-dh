<?php defined( 'ABSPATH' ) || exit; ?>
<?php get_header(); ?>

  <main id="main">
    <section class="page-hero page-hero--compact" aria-labelledby="contact-title">
      <div class="container container--narrow">
        <h1 class="h1" id="contact-title" data-split-lines>Let&rsquo;s talk about <em class="text-accent">your project.</em></h1>
        <p class="lead">Have a question before you start? Send us a message and our team will get back to you.</p>
      </div>
    </section>

    <section class="section section--flush-top">
      <div class="container contact-layout">
        <aside class="contact-aside" aria-label="Other ways to reach us">
          <div class="contact-card contact-card--primary">
            <span class="contact-card__icon"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="5.5" y="4.5" width="13" height="16" rx="2"/><path d="M9 4.5v-1h6v1M9 10h6M9 14h6"/></svg></span>
            <h2 class="contact-card__title">Ready to start?</h2>
            <p>The fastest way to share your project is our guided online estimate — photos, preferences and all.</p>
            <a class="btn btn--light" href="<?php echo esc_url( dh_url( 'estimate' ) ); ?>">Start Your Estimate <svg class="icon btn__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
          </div>

          <div class="contact-card">
            <span class="contact-card__icon"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 18.5v-12A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5v8a1.5 1.5 0 0 1-1.5 1.5H8z"/><path d="M9 9.5h6M9 12.5h4"/></svg></span>
            <h2 class="contact-card__title">Reach us directly</h2>
            <!-- Phone / email render from SITE_CONFIG in main.js; the fallback text shows until they are supplied. -->
            <ul class="contact-list" role="list">
              <li data-config-item="phone" hidden><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5.5 4h3l1.5 4-2 1.3a11 11 0 0 0 6.7 6.7L16 14l4 1.5v3a1.5 1.5 0 0 1-1.5 1.5A15.5 15.5 0 0 1 4 5.5 1.5 1.5 0 0 1 5.5 4z"/></svg> <a data-config-link href="<?php echo esc_url( dh_url( 'contact' ) ); ?>"></a></li>
              <li data-config-item="email" hidden><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4 7 8 6 8-6"/></svg> <a data-config-link href="<?php echo esc_url( dh_url( 'contact' ) ); ?>"></a></li>
            </ul>
            <p data-config-fallback>Use the form and our team will reply personally.</p>
          </div>

          <div class="contact-card">
            <span class="contact-card__icon"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg></span>
            <h2 class="contact-card__title">What to expect</h2>
            <p>Every message is read by our team. We&rsquo;ll follow up using the contact method you prefer.</p>
          </div>
        </aside>

        <div class="form-card">
          <form class="contact-form" data-contact-form novalidate>
            <div class="hp-field" aria-hidden="true"><label>Leave this field empty <input type="text" name="company_website" tabindex="-1" autocomplete="off" data-hp></label></div>
            <h2 class="form-card__title">Send a message</h2>
            <div class="field-row">
              <div class="field">
                <label class="field__label" for="c-first">First name</label>
                <input class="field__input" id="c-first" name="firstName" type="text" autocomplete="given-name" data-validate="required" aria-describedby="c-first-error">
                <p class="field__error" id="c-first-error"></p>
              </div>
              <div class="field">
                <label class="field__label" for="c-last">Last name</label>
                <input class="field__input" id="c-last" name="lastName" type="text" autocomplete="family-name" data-validate="required" aria-describedby="c-last-error">
                <p class="field__error" id="c-last-error"></p>
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <label class="field__label" for="c-email">Email</label>
                <input class="field__input" id="c-email" name="email" type="email" inputmode="email" autocomplete="email" data-validate="required email" aria-describedby="c-email-error">
                <p class="field__error" id="c-email-error"></p>
              </div>
              <div class="field">
                <label class="field__label" for="c-phone">Phone <span class="field__optional">Optional</span></label>
                <input class="field__input" id="c-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" data-validate="phone" aria-describedby="c-phone-error">
                <p class="field__error" id="c-phone-error"></p>
              </div>
            </div>
            <fieldset class="field">
              <legend class="field__label">What can we help with?</legend>
              <div class="chip-group">
                <label class="chip-option"><input type="radio" name="topic" value="windows" checked><span>Replacement Windows</span></label>
                <label class="chip-option"><input type="radio" name="topic" value="bath"><span>Bath Remodel</span></label>
                <label class="chip-option"><input type="radio" name="topic" value="both"><span>Both</span></label>
                <label class="chip-option"><input type="radio" name="topic" value="other"><span>Something else</span></label>
              </div>
            </fieldset>
            <div class="field">
              <label class="field__label" for="c-message">Message</label>
              <textarea class="field__input field__textarea" id="c-message" name="message" rows="5" data-validate="required" aria-describedby="c-message-hint c-message-error"></textarea>
              <p class="field__hint" id="c-message-hint">A sentence or two is plenty.</p>
              <p class="field__error" id="c-message-error"></p>
            </div>
            <p class="fine-print"><span>By sending this message you agree that we may contact you about your inquiry. See our <a href="<?php echo esc_url( dh_url( 'privacy' ) ); ?>">Privacy Policy</a>.</span></p>
            <div class="form-status" data-form-status role="status" aria-live="polite" hidden></div>
            <button class="btn btn--primary btn--lg btn--block" type="submit" data-submit>
              <span class="btn__label">Send Message</span>
              <span class="btn__spinner" aria-hidden="true"></span>
            </button>
          </form>
        </div>
      </div>
    </section>
  </main>

  <?php get_footer(); ?>
