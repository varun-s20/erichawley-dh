<?php defined( 'ABSPATH' ) || exit; ?>
<?php get_header(); ?>

  <main id="main">

    <!-- ============ 1. HERO ============ -->
    <section class="hero hero--page" aria-labelledby="bath-title" data-header-hero>
        <div class="hero__media">
          <img class="hero__img hero__img--bath" src="<?php dh_assets(); ?>assets/images/bath/bath-glass-shower-1024.webp" srcset="<?php dh_assets(); ?>assets/images/bath/bath-glass-shower-640.webp 640w, <?php dh_assets(); ?>assets/images/bath/bath-glass-shower-800.webp 800w, <?php dh_assets(); ?>assets/images/bath/bath-glass-shower-1024.webp 1024w, <?php dh_assets(); ?>assets/images/bath/bath-glass-shower-1600.webp 1600w, <?php dh_assets(); ?>assets/images/bath/bath-glass-shower-2400.webp 2400w" sizes="(orientation: portrait) 150vh, 100vw" width="1600" height="1066" alt="Bright remodeled bathroom with a frameless glass shower and long vanity" fetchpriority="high" decoding="async">
        </div>
        <div class="hero__overlay" aria-hidden="true"></div>
        <div class="container hero__inner">
        <div class="hero__content">
          <h1 class="hero__title hero__title--page" id="bath-title" data-split-lines>A bathroom designed <em class="text-accent">around your day.</em></h1>
          <p class="hero__text">From a simple refresh to a complete remodel, start by showing us your space. We&rsquo;ll review your photos and goals, then follow up with a clear plan and proposal.</p>
          <div class="hero__actions">
            <a class="btn btn--primary btn--lg" href="<?php echo esc_url( dh_url( 'estimate', '?project=bath' ) ); ?>">Start Your Bath Estimate <span class="btn__icon"><svg class="icon btn__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></a>
            <a class="btn btn--outline-light btn--lg" href="#inspiration">View Inspiration</a>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ 2. INTRODUCTION ============ -->
    <section class="section" aria-labelledby="bath-intro-title">
      <div class="container intro-split">
        <header class="section-head" data-reveal>
          <h2 class="h2" id="bath-intro-title" data-word-reveal>Start with how you <em class="text-accent">use the space.</em></h2>
        </header>
        <div class="intro-split__body" data-reveal>
          <p class="lead">Every bathroom is different. Tell us what&rsquo;s working, what isn&rsquo;t, and what you&rsquo;d love to change — we&rsquo;ll help shape it into a plan.</p>
          <ol class="numbered-list" role="list">
            <li><span>01</span><div><h3>Share photos of your current bathroom</h3><p>A few wide shots and close-ups from your phone are perfect.</p></div></li>
            <li><span>02</span><div><h3>Describe your goals in your own words</h3><p>No design vocabulary needed — just tell us what you have in mind.</p></div></li>
            <li><span>03</span><div><h3>Review your plan with our team</h3><p>We follow up personally with a proposal and next steps.</p></div></li>
          </ol>
        </div>
      </div>
    </section>

    <!-- ============ 3. INSPIRATION GALLERY ============ -->
    <section class="section section--surface" id="inspiration" aria-labelledby="inspo-title">
      <div class="container">
        <header class="section-head section-head--split" data-reveal>
          <div>
            <h2 class="h2" id="inspo-title" data-word-reveal>Bathroom <em class="text-accent">inspiration.</em></h2>
          </div>
          <p class="section-head__aside">A few looks to spark ideas. Mention anything you love when you start your estimate.</p>
        </header>
        <p class="dev-note"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.8v.2"/></svg> <span>Representative imagery. Replace with the client&rsquo;s own bathroom project photography when available.</span></p>
        <ul class="bento" role="list" data-reveal="stagger" data-reveal-clip>
          <li class="bento__item bento__item--wide">
            <figure><img src="<?php dh_assets(); ?>assets/images/bath/bath-freestanding-tub-1024.webp" srcset="<?php dh_assets(); ?>assets/images/bath/bath-freestanding-tub-640.webp 640w, <?php dh_assets(); ?>assets/images/bath/bath-freestanding-tub-800.webp 800w, <?php dh_assets(); ?>assets/images/bath/bath-freestanding-tub-1024.webp 1024w, <?php dh_assets(); ?>assets/images/bath/bath-freestanding-tub-1600.webp 1600w" sizes="(min-width: 1024px) 60vw, 100vw" width="1600" height="1068" alt="Bright bathroom with a freestanding tub, plants and a vessel sink" loading="lazy" decoding="async"><figcaption>Bright &amp; Minimal</figcaption></figure>
          </li>
          <li class="bento__item bento__item--tall">
            <figure><img src="<?php dh_assets(); ?>assets/images/bath/bath-dark-tub-1024.webp" srcset="<?php dh_assets(); ?>assets/images/bath/bath-dark-tub-640.webp 640w, <?php dh_assets(); ?>assets/images/bath/bath-dark-tub-800.webp 800w, <?php dh_assets(); ?>assets/images/bath/bath-dark-tub-1024.webp 1024w, <?php dh_assets(); ?>assets/images/bath/bath-dark-tub-1600.webp 1600w" sizes="(min-width: 1024px) 34vw, 50vw" width="1600" height="2400" alt="Dark tiled bathroom with a white freestanding tub" loading="lazy" decoding="async"><figcaption>Dark &amp; Dramatic</figcaption></figure>
          </li>
          <li class="bento__item">
            <figure><img src="<?php dh_assets(); ?>assets/images/bath/bath-oak-vanity-1024.webp" srcset="<?php dh_assets(); ?>assets/images/bath/bath-oak-vanity-640.webp 640w, <?php dh_assets(); ?>assets/images/bath/bath-oak-vanity-800.webp 800w, <?php dh_assets(); ?>assets/images/bath/bath-oak-vanity-1024.webp 1024w, <?php dh_assets(); ?>assets/images/bath/bath-oak-vanity-1600.webp 1600w" sizes="(min-width: 1024px) 30vw, 50vw" width="1600" height="1200" alt="Light oak double vanity with white vessel sinks" loading="lazy" decoding="async"><figcaption>Warm Oak &amp; White</figcaption></figure>
          </li>
          <li class="bento__item">
            <figure><img src="<?php dh_assets(); ?>assets/images/bath/bath-marble-vanity-1024.webp" srcset="<?php dh_assets(); ?>assets/images/bath/bath-marble-vanity-640.webp 640w, <?php dh_assets(); ?>assets/images/bath/bath-marble-vanity-800.webp 800w, <?php dh_assets(); ?>assets/images/bath/bath-marble-vanity-1024.webp 1024w, <?php dh_assets(); ?>assets/images/bath/bath-marble-vanity-1600.webp 1600w" sizes="(min-width: 1024px) 30vw, 50vw" width="1600" height="1089" alt="Marble wall with twin round mirrors and brass faucets" loading="lazy" decoding="async"><figcaption>Marble &amp; Brass</figcaption></figure>
          </li>
          <li class="bento__item">
            <figure><img src="<?php dh_assets(); ?>assets/images/bath/bath-floating-vanity-sage-1024.webp" srcset="<?php dh_assets(); ?>assets/images/bath/bath-floating-vanity-sage-640.webp 640w, <?php dh_assets(); ?>assets/images/bath/bath-floating-vanity-sage-800.webp 800w, <?php dh_assets(); ?>assets/images/bath/bath-floating-vanity-sage-1024.webp 1024w, <?php dh_assets(); ?>assets/images/bath/bath-floating-vanity-sage-1600.webp 1600w" sizes="(min-width: 1024px) 30vw, 50vw" width="1600" height="1060" alt="Floating wood vanity with a sage green wall" loading="lazy" decoding="async"><figcaption>Soft Sage &amp; Wood</figcaption></figure>
          </li>
          <li class="bento__item">
            <figure><img src="<?php dh_assets(); ?>assets/images/bath/bath-stone-tub-1024.webp" srcset="<?php dh_assets(); ?>assets/images/bath/bath-stone-tub-640.webp 640w, <?php dh_assets(); ?>assets/images/bath/bath-stone-tub-800.webp 800w, <?php dh_assets(); ?>assets/images/bath/bath-stone-tub-1024.webp 1024w, <?php dh_assets(); ?>assets/images/bath/bath-stone-tub-1600.webp 1600w" sizes="(min-width: 1024px) 30vw, 50vw" width="1600" height="1066" alt="Spa-like bathroom with a stone soaking tub and textured walls" loading="lazy" decoding="async"><figcaption>Spa-Inspired</figcaption></figure>
          </li>
        </ul>
      </div>
    </section>

    <!-- ============ 4. DESIGN YOUR REMODEL ============ -->
    <section class="section section--navy" aria-labelledby="design-title">
      <div class="container">
        <header class="section-head section-head--split" data-reveal>
          <div>
            <h2 class="h2" id="design-title" data-word-reveal>Think about what <em class="text-accent">matters most.</em></h2>
          </div>
          <p class="section-head__aside">Every remodel comes down to a few key areas. Consider your priorities — you can describe them when you start your estimate.</p>
        </header>
        <ul class="area-grid" role="list" data-reveal="stagger">
          <li class="area-card"><span class="area-card__icon"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 21V7a3 3 0 0 1 3-3h1a3 3 0 0 1 3 3v1"/><path d="M9.5 8h7"/><path d="M11 11v.5M13 12v.5M15 11v.5M12 14.5v.5M14 15v.5"/></svg></span><h3>Bathtub or shower</h3><p>New tub, walk-in shower or both &mdash; with your pick of pan height, glass doors, fixture finish, seats, shelves and grab bars.</p></li>
          <li class="area-card"><span class="area-card__icon"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="4" y="11" width="16" height="9" rx="1.5"/><path d="M12 11v9M9 15h.01M15 15h.01"/><path d="M9 11V8.5a3 3 0 0 1 6 0V11"/></svg></span><h3>Vanity</h3><p>We supply it or install yours. Single or double, in the size and faucet style you want.</p></li>
          <li class="area-card"><span class="area-card__icon"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="4" y="4" width="16" height="16" rx="1.5"/><path d="M4 12h16M12 4v16"/></svg></span><h3>Shower walls &amp; flooring</h3><p>Marble or tile designs for the shower, and waterproof luxury vinyl plank or tile underfoot.</p></li>
          <li class="area-card"><span class="area-card__icon"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 11h6a3 3 0 0 1 3 3v1M5 8v6M14 15v1.5M8 6h6"/><path d="M11 6V4"/></svg></span><h3>Toilet &amp; finishing touches</h3><p>Standard, comfort height or a toilet-bidet combo &mdash; plus new vanity lights or a ceiling light with exhaust.</p></li>
        </ul>
      </div>
    </section>

    <!-- ============ 5. PRODUCT SELECTIONS (configuration-driven) ============
         Rendered from `bathOptions` in <?php dh_assets(); ?>assets/js/main.js. While that array is empty,
         the elegant fallback below stays in place — no broken or empty UI. -->
    <!-- Hidden until bathOptions has the client's items (main.js un-hides it). -->
    <section class="section" id="selections" aria-labelledby="selections-title" data-bath-selections hidden>
      <div class="container">
        <header class="section-head section-head--center" data-reveal>
          <h2 class="h2" id="selections-title" data-word-reveal>Product &amp; finish <em class="text-accent">selections.</em></h2>
          <p>Choose from curated options as part of your online estimate.</p>
        </header>
        <p class="dev-note"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.8v.2"/></svg> <span>Rendered from <code>bathOptions</code> in main.js. Add the client&rsquo;s bathroom products and photos there — this section and the estimator update automatically.</span></p>
        <div class="bath-options" data-bath-options>
          <div class="coming-soon" data-reveal>
            <div class="coming-soon__visual" aria-hidden="true">
              <span class="coming-soon__tile"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 21V7a3 3 0 0 1 3-3h1a3 3 0 0 1 3 3v1"/><path d="M9.5 8h7"/><path d="M11 11v.5M13 12v.5M15 11v.5M12 14.5v.5M14 15v.5"/></svg></span>
              <span class="coming-soon__tile"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="4" y="11" width="16" height="9" rx="1.5"/><path d="M12 11v9M9 15h.01M15 15h.01"/><path d="M9 11V8.5a3 3 0 0 1 6 0V11"/></svg></span>
              <span class="coming-soon__tile"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="4" y="4" width="16" height="16" rx="1.5"/><path d="M4 12h16M12 4v16"/></svg></span>
              <span class="coming-soon__tile"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 11h6a3 3 0 0 1 3 3v1M5 8v6M14 15v1.5M8 6h6"/><path d="M11 6V4"/></svg></span>
            </div>
            <div class="coming-soon__body">
              <h3 class="h3">Curated selections are on the way</h3>
              <p>We&rsquo;re preparing a visual library of bathroom options you&rsquo;ll be able to browse right here. For now, share photos and describe what you have in mind — our team will walk you through options personally.</p>
              <a class="btn btn--primary" href="<?php echo esc_url( dh_url( 'estimate', '?project=bath' ) ); ?>">Start Your Bath Estimate <svg class="icon btn__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ 6. PROCESS ============ -->
    <section class="section section--surface" aria-labelledby="b-process-title">
      <div class="container">
        <header class="section-head section-head--center" data-reveal>
          <h2 class="h2" id="b-process-title" data-word-reveal>From photos <em class="text-accent">to a plan.</em></h2>
        </header>
        <ol class="step-row step-row--light" role="list" data-reveal="stagger">
          <li class="step-row__item"><span class="step-row__num">01</span><h3>Choose bath remodel</h3><p>Start your estimate and select your project.</p></li>
          <li class="step-row__item"><span class="step-row__num">02</span><h3>Share your details</h3><p>Contact information and your project address.</p></li>
          <li class="step-row__item is-active"><span class="step-row__num">03</span><h3>Add photos</h3><p>Wide shots of the room and close-ups of what you&rsquo;d change.</p></li>
          <li class="step-row__item"><span class="step-row__num">04</span><h3>Describe your goals</h3><p>Tell us what you&rsquo;d like the new bathroom to be.</p></li>
          <li class="step-row__item"><span class="step-row__num">05</span><h3>Review &amp; submit</h3><p>Our team reviews it and follows up with next steps.</p></li>
        </ol>
      </div>
    </section>

    <!-- ============ 7. BEFORE / AFTER ============ -->
    <section class="section" aria-labelledby="b-ba-title">
      <div class="container">
        <header class="section-head section-head--center" data-reveal>
          <h2 class="h2" id="b-ba-title" data-word-reveal>See what a remodel <em class="text-accent">can change.</em></h2>
        </header>
        <figure class="compare" data-compare data-reveal>
          <div class="compare__stage" data-compare-stage>
            <img class="compare__img" src="<?php dh_assets(); ?>assets/images/bath/bath-grey-black-sink-1024.webp" srcset="<?php dh_assets(); ?>assets/images/bath/bath-grey-black-sink-640.webp 640w, <?php dh_assets(); ?>assets/images/bath/bath-grey-black-sink-800.webp 800w, <?php dh_assets(); ?>assets/images/bath/bath-grey-black-sink-1024.webp 1024w, <?php dh_assets(); ?>assets/images/bath/bath-grey-black-sink-1600.webp 1600w" sizes="(min-width: 1280px) 1200px, 100vw" width="1600" height="1066" alt="After: modern grey bathroom with a black vessel sink and freestanding tub" loading="lazy" decoding="async">
            <div class="compare__before" data-compare-before>
              <img class="compare__img compare__img--top" src="<?php dh_assets(); ?>assets/images/bath/bath-dated-small-1024.webp" srcset="<?php dh_assets(); ?>assets/images/bath/bath-dated-small-640.webp 640w, <?php dh_assets(); ?>assets/images/bath/bath-dated-small-800.webp 800w, <?php dh_assets(); ?>assets/images/bath/bath-dated-small-1024.webp 1024w, <?php dh_assets(); ?>assets/images/bath/bath-dated-small-1600.webp 1600w" sizes="(min-width: 1280px) 1200px, 100vw" width="1600" height="2399" alt="Before: small dated bathroom with a pedestal sink and checkered floor" loading="lazy" decoding="async">
            </div>
            <span class="compare__label compare__label--before" aria-hidden="true">Before</span>
            <span class="compare__label compare__label--after" aria-hidden="true">After</span>
            <div class="compare__handle" data-compare-handle aria-hidden="true"><span class="compare__knob"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m9 7-5 5 5 5M15 7l5 5-5 5"/></svg></span></div>
          </div>
          <label class="visually-hidden" for="compare-range-b">Reveal before and after — bathroom</label>
          <input class="compare__range" id="compare-range-b" type="range" min="0" max="100" value="50" step="1" data-compare-range>
          <figcaption class="dev-note"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.8v.2"/></svg> <span>Representative imagery. Replace with matching before/after photos from real client projects.</span></figcaption>
        </figure>
      </div>
    </section>

    <!-- ============ 8. FAQ ============ -->
    <section class="section section--surface" aria-labelledby="b-faq-title">
      <div class="container container--narrow">
        <header class="section-head section-head--center" data-reveal>
          <h2 class="h2" id="b-faq-title" data-word-reveal>Bath remodel <em class="text-accent">questions.</em></h2>
        </header>
        <div class="accordion accordion--card" data-accordion="single" data-reveal>
          <div class="accordion__item is-open">
            <h3 class="accordion__heading"><button class="accordion__trigger" type="button" id="bq1" aria-expanded="true" aria-controls="ba1" data-accordion-trigger><span>What should I photograph?</span><span class="accordion__icon" aria-hidden="true"></span></button></h3>
            <div class="accordion__panel" id="ba1" role="region" aria-labelledby="bq1"><div class="accordion__inner"><p>A few wide shots of the whole room, plus close-ups of anything you&rsquo;d like to change — the tub or shower, vanity, flooring or fixtures.</p></div></div>
          </div>
          <div class="accordion__item">
            <h3 class="accordion__heading"><button class="accordion__trigger" type="button" id="bq2" aria-expanded="false" aria-controls="ba2" data-accordion-trigger><span>Do I need to know exactly what I want?</span><span class="accordion__icon" aria-hidden="true"></span></button></h3>
            <div class="accordion__panel" id="ba2" role="region" aria-labelledby="bq2"><div class="accordion__inner"><p>Not at all. Describe your goals in your own words and our team will help you explore options.</p></div></div>
          </div>
          <div class="accordion__item">
            <h3 class="accordion__heading"><button class="accordion__trigger" type="button" id="bq3" aria-expanded="false" aria-controls="ba3" data-accordion-trigger><span>Can I choose specific products online?</span><span class="accordion__icon" aria-hidden="true"></span></button></h3>
            <div class="accordion__panel" id="ba3" role="region" aria-labelledby="bq3"><div class="accordion__inner"><p>Detailed product selections are being added to the online estimate. For now, describe what you have in mind and we&rsquo;ll review options with you.</p></div></div>
          </div>
          <div class="accordion__item">
            <h3 class="accordion__heading"><button class="accordion__trigger" type="button" id="bq4" aria-expanded="false" aria-controls="ba4" data-accordion-trigger><span>Can I combine a bath remodel with new windows?</span><span class="accordion__icon" aria-hidden="true"></span></button></h3>
            <div class="accordion__panel" id="ba4" role="region" aria-labelledby="bq4"><div class="accordion__inner"><p>Yes — choose &ldquo;Both Projects&rdquo; when you start your estimate and we&rsquo;ll guide you through each.</p></div></div>
          </div>
          <div class="accordion__item">
            <h3 class="accordion__heading"><button class="accordion__trigger" type="button" id="bq5" aria-expanded="false" aria-controls="ba5" data-accordion-trigger><span>What happens after I submit?</span><span class="accordion__icon" aria-hidden="true"></span></button></h3>
            <div class="accordion__panel" id="ba5" role="region" aria-labelledby="bq5"><div class="accordion__inner"><p>You&rsquo;ll see a confirmation that your information was received. Our team reviews your details and photos, then follows up with your proposal and next steps.</p></div></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ 9. CTA ============ -->
    <section class="cta-banner" aria-labelledby="b-cta-title">
          <div class="cta-banner__media">
            <img class="cta-banner__img" src="<?php dh_assets(); ?>assets/images/bath/bath-double-vessel-1024.webp" srcset="<?php dh_assets(); ?>assets/images/bath/bath-double-vessel-640.webp 640w, <?php dh_assets(); ?>assets/images/bath/bath-double-vessel-800.webp 800w, <?php dh_assets(); ?>assets/images/bath/bath-double-vessel-1024.webp 1024w, <?php dh_assets(); ?>assets/images/bath/bath-double-vessel-1600.webp 1600w" sizes="(orientation: portrait) and (max-width: 1023px) 130vh, (min-width: 1280px) 1200px, 100vw" width="1600" height="1068" alt="" loading="lazy" decoding="async">
          </div>
          <div class="container cta-banner__content" data-reveal>
            <h2 class="cta-banner__title" id="b-cta-title">Show us the bathroom <em class="text-accent">you&rsquo;d love to change.</em></h2>
            <p class="cta-banner__text">A few photos and a short description are all it takes to begin.</p>
            <div class="cta-banner__actions">
              <a class="btn btn--primary btn--lg" href="<?php echo esc_url( dh_url( 'estimate', '?project=bath' ) ); ?>">Start Your Bath Estimate <span class="btn__icon"><svg class="icon btn__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></a>
              <a class="btn btn--outline-light btn--lg" href="<?php echo esc_url( dh_url( 'contact' ) ); ?>">Ask a Question</a>
            </div>
          </div>
    </section>
  </main>

  <?php get_footer(); ?>
