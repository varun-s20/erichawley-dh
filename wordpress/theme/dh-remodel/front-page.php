<?php defined( 'ABSPATH' ) || exit; ?>
<?php get_header(); ?>

  <main id="main">

    <!-- ============ 01. HERO — sticky; the next section slides over it ============ -->
    <section class="hero" aria-labelledby="hero-title" data-hero>
      <div class="hero__media">
        <img class="hero__img" src="<?php dh_assets(); ?>assets/images/home/hero-living-room-windows-1024.webp" srcset="<?php dh_assets(); ?>assets/images/home/hero-living-room-windows-640.webp 640w, <?php dh_assets(); ?>assets/images/home/hero-living-room-windows-800.webp 800w, <?php dh_assets(); ?>assets/images/home/hero-living-room-windows-1024.webp 1024w, <?php dh_assets(); ?>assets/images/home/hero-living-room-windows-1600.webp 1600w, <?php dh_assets(); ?>assets/images/home/hero-living-room-windows-2400.webp 2400w" sizes="(orientation: portrait) 150vh, 100vw" width="1600" height="1200" alt="Bright living room with tall windows letting in natural light" fetchpriority="high" decoding="async">
      </div>
      <div class="hero__overlay" aria-hidden="true"></div>

      <div class="container hero__inner">
        <div class="hero__content" data-hero-content>
          <h1 class="hero__title" id="hero-title">
            <span class="hero__line"><span>Home remodeling,</span></span>
            <span class="hero__line"><span>made simple.</span></span>
          </h1>
          <p class="hero__text">New windows, a fresh bathroom and more. Get your estimate online in minutes.</p>
          <div class="hero__actions">
            <a class="btn btn--light btn--lg" href="<?php echo esc_url( dh_url( 'estimate' ) ); ?>">Start your free estimate</a>
            <a class="btn btn--glass btn--lg" href="<?php echo esc_url( dh_url( 'contact' ) ); ?>">In-person quote</a>
          </div>
        </div>
      </div>
    </section>

    <div class="cover">

    <!-- ============ 02. NUMBERS — facts from the client's own option lists ============ -->
    <section class="section numbers" aria-labelledby="why-title">
      <div class="container">
        <header class="section-head" data-reveal>
          <h2 class="h2" id="why-title" data-word-reveal>Why homeowners start here <span class="avatar-stack" aria-hidden="true"><img src="<?php dh_assets(); ?>assets/images/windows/windows-bedroom-white-320.webp" width="1600" height="1066" alt="" loading="lazy" decoding="async"><img src="<?php dh_assets(); ?>assets/images/bath/bath-glass-shower-320.webp" width="1600" height="1066" alt="" loading="lazy" decoding="async"><img src="<?php dh_assets(); ?>assets/images/windows/windows-arched-black-320.webp" width="1600" height="2134" alt="" loading="lazy" decoding="async"><span class="avatar-stack__more"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M12 5v14M5 12h14"/></svg></span></span></h2>
        </header>

        <!-- Each row: big number · a visual of the thing counted · label. Counts come from the
             client's own option lists — never replace them with unverified business stats. -->
        <ul class="stat-rows" role="list" data-stats>
          <li class="stat-row">
            <span class="stat-row__num"><span data-count="7">7</span></span>
            <span class="stat-row__visual stat-swatches" aria-hidden="true">
              <i class="swatch-dot swatch-dot--white"></i><i class="swatch-dot swatch-dot--tan"></i><i class="swatch-dot swatch-dot--black"></i><i class="swatch-dot swatch-dot--burgundy"></i><i class="swatch-dot swatch-dot--grey"></i><i class="swatch-dot swatch-dot--green"></i><i class="swatch-dot swatch-dot--dark-brown"></i>
            </span>
            <span class="stat-row__label"><strong>Window frame colors</strong>White, tan, black, burgundy, grey, green and dark brown.</span>
          </li>
          <li class="stat-row">
            <span class="stat-row__num"><span data-count="4">4</span></span>
            <span class="stat-row__visual stat-grids" aria-hidden="true">
              <span class="diagram-slot" data-diagram="grid" data-grid="none"></span><span class="diagram-slot" data-diagram="grid" data-grid="colonial"></span><span class="diagram-slot" data-diagram="grid" data-grid="diamond"></span>
            </span>
            <span class="stat-row__label"><strong>Window grid choices</strong>No grids, grids, or a diamond or colonial pattern.</span>
          </li>
          <li class="stat-row">
            <span class="stat-row__num"><span data-count="2">2</span></span>
            <span class="stat-row__visual stat-pills" aria-hidden="true">
              <span class="stat-pill"><img src="<?php dh_assets(); ?>assets/images/bath/bath-glass-shower-320.webp" width="1600" height="1066" alt="" loading="lazy" decoding="async">Bathroom</span>
              <span class="stat-pill"><img src="<?php dh_assets(); ?>assets/images/windows/windows-double-hung-grids-320.webp" width="1600" height="1066" alt="" loading="lazy" decoding="async">Windows</span>
            </span>
            <span class="stat-row__label"><strong>Projects to estimate online</strong>Bathrooms and windows, right from your phone.</span>
          </li>
          <li class="stat-row">
            <span class="stat-row__num"><span data-count="1">1</span></span>
            <span class="stat-row__visual stat-photo" aria-hidden="true">
              <span class="stat-photo__card"><img src="<?php dh_assets(); ?>assets/images/windows/windows-bedroom-white-640.webp" width="1600" height="1066" alt="" loading="lazy" decoding="async"><span class="stat-photo__tag"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>Window 1 of 8</span></span>
            </span>
            <span class="stat-row__label"><strong>Photo per window</strong>Snap each window from your phone. That&rsquo;s all we need to start.</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- ============ 03. EXPANDING PHOTO — grows to full width on scroll ============ -->
    <section class="expand" aria-label="A sunroom with walls of new windows" data-expand>
      <div class="expand__frame" data-expand-frame>
        <img class="expand__img" src="<?php dh_assets(); ?>assets/images/windows/windows-sunroom-1600.webp" srcset="<?php dh_assets(); ?>assets/images/windows/windows-sunroom-1024.webp 1024w, <?php dh_assets(); ?>assets/images/windows/windows-sunroom-1600.webp 1600w, <?php dh_assets(); ?>assets/images/windows/windows-sunroom-2400.webp 2400w" sizes="100vw" width="1600" height="1066" alt="Sunroom with walls of windows, leather chairs and hardwood floors" loading="lazy" decoding="async" data-expand-img>
      </div>
    </section>

    <!-- ============ 04. SERVICES — pinned visual + accordion list ============ -->
    <section class="services-ref" id="services" aria-labelledby="services-title" data-services>
      <div class="services-ref__pin">
        <div class="container services-ref__grid">
          <div class="services-ref__visual" aria-hidden="true">
            <img class="services-ref__img is-active" src="<?php dh_assets(); ?>assets/images/windows/windows-double-hung-grids-1024.webp" srcset="<?php dh_assets(); ?>assets/images/windows/windows-double-hung-grids-640.webp 640w, <?php dh_assets(); ?>assets/images/windows/windows-double-hung-grids-800.webp 800w, <?php dh_assets(); ?>assets/images/windows/windows-double-hung-grids-1024.webp 1024w, <?php dh_assets(); ?>assets/images/windows/windows-double-hung-grids-1600.webp 1600w" sizes="(min-width: 1024px) 44vw, 100vw" width="1600" height="1066" alt="" loading="lazy" decoding="async">
            <img class="services-ref__img" src="<?php dh_assets(); ?>assets/images/bath/bath-freestanding-tub-1024.webp" srcset="<?php dh_assets(); ?>assets/images/bath/bath-freestanding-tub-640.webp 640w, <?php dh_assets(); ?>assets/images/bath/bath-freestanding-tub-800.webp 800w, <?php dh_assets(); ?>assets/images/bath/bath-freestanding-tub-1024.webp 1024w, <?php dh_assets(); ?>assets/images/bath/bath-freestanding-tub-1600.webp 1600w" sizes="(min-width: 1024px) 44vw, 100vw" width="1600" height="1068" alt="" loading="lazy" decoding="async">
            <img class="services-ref__img" src="<?php dh_assets(); ?>assets/images/windows/windows-arched-black-1024.webp" srcset="<?php dh_assets(); ?>assets/images/windows/windows-arched-black-640.webp 640w, <?php dh_assets(); ?>assets/images/windows/windows-arched-black-800.webp 800w, <?php dh_assets(); ?>assets/images/windows/windows-arched-black-1024.webp 1024w, <?php dh_assets(); ?>assets/images/windows/windows-arched-black-1600.webp 1600w" sizes="(min-width: 1024px) 44vw, 100vw" width="1600" height="2134" alt="" loading="lazy" decoding="async">
            <img class="services-ref__img" src="<?php dh_assets(); ?>assets/images/bath/bath-oak-vanity-1024.webp" srcset="<?php dh_assets(); ?>assets/images/bath/bath-oak-vanity-640.webp 640w, <?php dh_assets(); ?>assets/images/bath/bath-oak-vanity-800.webp 800w, <?php dh_assets(); ?>assets/images/bath/bath-oak-vanity-1024.webp 1024w, <?php dh_assets(); ?>assets/images/bath/bath-oak-vanity-1600.webp 1600w" sizes="(min-width: 1024px) 44vw, 100vw" width="1600" height="1200" alt="" loading="lazy" decoding="async">
            <img class="services-ref__img" src="<?php dh_assets(); ?>assets/images/projects/exterior-farmhouse-porch-1024.webp" srcset="<?php dh_assets(); ?>assets/images/projects/exterior-farmhouse-porch-640.webp 640w, <?php dh_assets(); ?>assets/images/projects/exterior-farmhouse-porch-800.webp 800w, <?php dh_assets(); ?>assets/images/projects/exterior-farmhouse-porch-1024.webp 1024w, <?php dh_assets(); ?>assets/images/projects/exterior-farmhouse-porch-1600.webp 1600w" sizes="(min-width: 1024px) 44vw, 100vw" width="1600" height="1066" alt="" loading="lazy" decoding="async">
          </div>

          <div class="services-ref__content">
            <header class="section-head" data-reveal>
              <h2 class="h2" id="services-title" data-word-reveal>Windows and bathrooms, in one place</h2>
              <p>Replacement windows and bath remodels — estimate online or in person.</p>
            </header>

            <ul class="svc-list" role="list">
              <li class="svc is-active">
                <h3 class="svc__heading"><button class="svc__btn" type="button" aria-expanded="true" aria-controls="svc-0" id="svc-0-btn"><span class="svc__title">Replacement Windows</span><span class="svc__arrow" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></button></h3>
                <div class="svc__panel" id="svc-0" role="region" aria-labelledby="svc-0-btn"><div class="svc__inner"><p>New framing with every window, and tempered glass where it&rsquo;s required.</p><a class="link-arrow" href="<?php echo esc_url( dh_url( 'windows' ) ); ?>">Explore windows</a></div></div>
              </li>
              <li class="svc">
                <h3 class="svc__heading"><button class="svc__btn" type="button" aria-expanded="false" aria-controls="svc-1" id="svc-1-btn"><span class="svc__title">Bath Remodel</span><span class="svc__arrow" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></button></h3>
                <div class="svc__panel" id="svc-1" role="region" aria-labelledby="svc-1-btn"><div class="svc__inner"><p>Tub-to-shower conversions and vanity replacements, planned from your photos.</p><a class="link-arrow" href="<?php echo esc_url( dh_url( 'bath-remodel' ) ); ?>">Explore bath remodeling</a></div></div>
              </li>
              <li class="svc">
                <h3 class="svc__heading"><button class="svc__btn" type="button" aria-expanded="false" aria-controls="svc-2" id="svc-2-btn"><span class="svc__title">Colors &amp; Grids</span><span class="svc__arrow" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></button></h3>
                <div class="svc__panel" id="svc-2" role="region" aria-labelledby="svc-2-btn"><div class="svc__inner"><p>Seven frame colors and diamond or colonial grid patterns, shown side by side.</p><a class="link-arrow" href="<?php echo esc_url( dh_url( 'windows', '#colors' ) ); ?>">See color options</a></div></div>
              </li>
              <li class="svc">
                <h3 class="svc__heading"><button class="svc__btn" type="button" aria-expanded="false" aria-controls="svc-3" id="svc-3-btn"><span class="svc__title">Free Online Estimate</span><span class="svc__arrow" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></button></h3>
                <div class="svc__panel" id="svc-3" role="region" aria-labelledby="svc-3-btn"><div class="svc__inner"><p>Answer a few questions from your phone and a real person prepares your proposal.</p><a class="link-arrow" href="<?php echo esc_url( dh_url( 'estimate' ) ); ?>">Start your estimate</a></div></div>
              </li>
              <li class="svc">
                <h3 class="svc__heading"><button class="svc__btn" type="button" aria-expanded="false" aria-controls="svc-4" id="svc-4-btn"><span class="svc__title">In-Person Quote</span><span class="svc__arrow" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></button></h3>
                <div class="svc__panel" id="svc-4" role="region" aria-labelledby="svc-4-btn"><div class="svc__inner"><p>Prefer to talk it through? We&rsquo;ll come out, measure and quote it in person.</p><a class="link-arrow" href="<?php echo esc_url( dh_url( 'contact' ) ); ?>">Request an in-person quote</a></div></div>
              </li>            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ 05. HOW IT WORKS — five columns, the active one expands ============ -->
    <section class="section steps-ref" id="process" aria-labelledby="process-title">
      <div class="container">
        <header class="section-head" data-reveal>
          <h2 class="h2" id="process-title" data-word-reveal>From photos to proposal in 5 steps</h2>
          <p>Easier than calling around for quotes, and all from your phone.</p>
        </header>

        <ol class="step-cols" role="list" data-steps>
          <li class="step-col is-active">
            <button class="step-col__btn" type="button" aria-expanded="true">
              <img class="step-col__img" src="<?php dh_assets(); ?>assets/images/projects/exterior-white-cottage-640.webp" srcset="<?php dh_assets(); ?>assets/images/projects/exterior-white-cottage-640.webp 640w, <?php dh_assets(); ?>assets/images/projects/exterior-white-cottage-800.webp 800w, <?php dh_assets(); ?>assets/images/projects/exterior-white-cottage-1024.webp 1024w" sizes="(min-width: 768px) 40vw, 100vw" width="1600" height="1063" alt="" loading="lazy" decoding="async">
              <span class="step-col__label"><span class="step-col__n">01</span><span class="step-col__name">. Your project</span></span>
              <span class="step-col__icon" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1z"/></svg></span>
              <span class="step-col__body"><span class="step-col__title">Choose your project</span><span class="step-col__text">Replacement windows, a bath remodel, or both.</span></span>
              <span class="step-col__bar" aria-hidden="true"></span>
            </button>
          </li>
          <li class="step-col">
            <button class="step-col__btn" type="button" aria-expanded="false">
              <img class="step-col__img" src="<?php dh_assets(); ?>assets/images/projects/exterior-brick-suburban-640.webp" srcset="<?php dh_assets(); ?>assets/images/projects/exterior-brick-suburban-640.webp 640w, <?php dh_assets(); ?>assets/images/projects/exterior-brick-suburban-800.webp 800w, <?php dh_assets(); ?>assets/images/projects/exterior-brick-suburban-1024.webp 1024w" sizes="(min-width: 768px) 40vw, 100vw" width="1600" height="1200" alt="" loading="lazy" decoding="async">
              <span class="step-col__label"><span class="step-col__n">02</span><span class="step-col__name">. About you</span></span>
              <span class="step-col__icon" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" focusable="false"><circle cx="12" cy="8.5" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/></svg></span>
              <span class="step-col__body"><span class="step-col__title">Tell us about your home</span><span class="step-col__text">Your name, address, phone and email.</span></span>
              <span class="step-col__bar" aria-hidden="true"></span>
            </button>
          </li>
          <li class="step-col">
            <button class="step-col__btn" type="button" aria-expanded="false">
              <img class="step-col__img" src="<?php dh_assets(); ?>assets/images/windows/windows-bedroom-white-640.webp" srcset="<?php dh_assets(); ?>assets/images/windows/windows-bedroom-white-640.webp 640w, <?php dh_assets(); ?>assets/images/windows/windows-bedroom-white-800.webp 800w, <?php dh_assets(); ?>assets/images/windows/windows-bedroom-white-1024.webp 1024w" sizes="(min-width: 768px) 40vw, 100vw" width="1600" height="1066" alt="" loading="lazy" decoding="async">
              <span class="step-col__label"><span class="step-col__n">03</span><span class="step-col__name">. Photos</span></span>
              <span class="step-col__icon" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2.1l1.3-2h6.2l1.3 2h2.1A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z"/><circle cx="12" cy="13" r="3.5"/></svg></span>
              <span class="step-col__body"><span class="step-col__title">Snap a photo of each window</span><span class="step-col__text">Pro tip: take photos of each side of your home.</span></span>
              <span class="step-col__bar" aria-hidden="true"></span>
            </button>
          </li>
          <li class="step-col">
            <button class="step-col__btn" type="button" aria-expanded="false">
              <img class="step-col__img" src="<?php dh_assets(); ?>assets/images/windows/windows-arched-black-640.webp" srcset="<?php dh_assets(); ?>assets/images/windows/windows-arched-black-640.webp 640w, <?php dh_assets(); ?>assets/images/windows/windows-arched-black-800.webp 800w, <?php dh_assets(); ?>assets/images/windows/windows-arched-black-1024.webp 1024w" sizes="(min-width: 768px) 40vw, 100vw" width="1600" height="2134" alt="" loading="lazy" decoding="async">
              <span class="step-col__label"><span class="step-col__n">04</span><span class="step-col__name">. Your style</span></span>
              <span class="step-col__icon" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" focusable="false"><circle cx="8.5" cy="12" r="4.5"/><circle cx="15.5" cy="12" r="4.5"/></svg></span>
              <span class="step-col__body"><span class="step-col__title">Pick colors &amp; grids</span><span class="step-col__text">Keep your current style, or let us choose the best option.</span></span>
              <span class="step-col__bar" aria-hidden="true"></span>
            </button>
          </li>
          <li class="step-col">
            <button class="step-col__btn" type="button" aria-expanded="false">
              <img class="step-col__img" src="<?php dh_assets(); ?>assets/images/bath/bath-freestanding-tub-640.webp" srcset="<?php dh_assets(); ?>assets/images/bath/bath-freestanding-tub-640.webp 640w, <?php dh_assets(); ?>assets/images/bath/bath-freestanding-tub-800.webp 800w, <?php dh_assets(); ?>assets/images/bath/bath-freestanding-tub-1024.webp 1024w" sizes="(min-width: 768px) 40vw, 100vw" width="1600" height="1068" alt="" loading="lazy" decoding="async">
              <span class="step-col__label"><span class="step-col__n">05</span><span class="step-col__name">. Done</span></span>
              <span class="step-col__icon" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></span>
              <span class="step-col__body"><span class="step-col__title">Get your proposal</span><span class="step-col__text">Hit complete and our team prepares it personally.</span></span>
              <span class="step-col__bar" aria-hidden="true"></span>
            </button>
            <a class="btn btn--light btn--sm step-col__cta" href="<?php echo esc_url( dh_url( 'estimate' ) ); ?>" tabindex="-1">Start now</a>
          </li>
        </ol>
      </div>
    </section>

    <!-- ============ 06. BEFORE / AFTER ============ -->
    <section class="section section--ba" aria-labelledby="ba-title">
      <div class="container">
        <header class="section-head" data-reveal>
          <h2 class="h2" id="ba-title" data-word-reveal>See what a remodel can change</h2>
          <p>Drag the slider to compare.</p>
        </header>

        <div class="tabs" data-tabs data-reveal>
          <div class="tabs__list" role="tablist" aria-label="Transformation type">
            <span class="tabs__indicator" aria-hidden="true"></span>
            <button class="tabs__tab" type="button" role="tab" id="ba-tab-windows" aria-selected="true" aria-controls="ba-panel-windows">Windows</button>
            <button class="tabs__tab" type="button" role="tab" id="ba-tab-bath" aria-selected="false" aria-controls="ba-panel-bath" tabindex="-1">Bath Remodel</button>
          </div>

          <div class="tabs__panel" id="ba-panel-windows" role="tabpanel" aria-labelledby="ba-tab-windows">
            <figure class="compare" data-compare>
              <div class="compare__stage" data-compare-stage>
                <img class="compare__img" src="<?php dh_assets(); ?>assets/images/windows/windows-after-white-1600.webp" srcset="<?php dh_assets(); ?>assets/images/windows/windows-after-white-640.webp 640w, <?php dh_assets(); ?>assets/images/windows/windows-after-white-800.webp 800w, <?php dh_assets(); ?>assets/images/windows/windows-after-white-1024.webp 1024w, <?php dh_assets(); ?>assets/images/windows/windows-after-white-1600.webp 1600w, <?php dh_assets(); ?>assets/images/windows/windows-after-white-2400.webp 2400w" sizes="(min-width: 1280px) 1200px, 100vw" width="2400" height="1600" alt="After: a new white window with clean trim on fresh siding" loading="lazy" decoding="async">
                <div class="compare__before" data-compare-before>
                  <img class="compare__img" src="<?php dh_assets(); ?>assets/images/windows/windows-before-weathered-1600.webp" srcset="<?php dh_assets(); ?>assets/images/windows/windows-before-weathered-640.webp 640w, <?php dh_assets(); ?>assets/images/windows/windows-before-weathered-800.webp 800w, <?php dh_assets(); ?>assets/images/windows/windows-before-weathered-1024.webp 1024w, <?php dh_assets(); ?>assets/images/windows/windows-before-weathered-1600.webp 1600w, <?php dh_assets(); ?>assets/images/windows/windows-before-weathered-2400.webp 2400w" sizes="(min-width: 1280px) 1200px, 100vw" width="2400" height="1600" alt="Before: an old wooden window with worn frames and weathered shutters" loading="lazy" decoding="async">
                </div>
                <span class="compare__label compare__label--before" aria-hidden="true">Before</span>
                <span class="compare__label compare__label--after" aria-hidden="true">After</span>
                <div class="compare__handle" data-compare-handle aria-hidden="true"><span class="compare__knob"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m9 7-5 5 5 5M15 7l5 5-5 5"/></svg></span></div>
              </div>
              <label class="visually-hidden" for="compare-range-windows">Reveal before and after — windows</label>
              <input class="compare__range" id="compare-range-windows" type="range" min="0" max="100" value="50" step="1" data-compare-range>
              <figcaption class="dev-note"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.8v.2"/></svg> <span>Representative imagery. Replace with matching before/after photos from real client projects.</span></figcaption>
            </figure>
          </div>

          <div class="tabs__panel" id="ba-panel-bath" role="tabpanel" aria-labelledby="ba-tab-bath" hidden>
            <figure class="compare" data-compare>
              <div class="compare__stage" data-compare-stage>
                <img class="compare__img" src="<?php dh_assets(); ?>assets/images/bath/bath-after-bright-1600.webp" srcset="<?php dh_assets(); ?>assets/images/bath/bath-after-bright-640.webp 640w, <?php dh_assets(); ?>assets/images/bath/bath-after-bright-800.webp 800w, <?php dh_assets(); ?>assets/images/bath/bath-after-bright-1024.webp 1024w, <?php dh_assets(); ?>assets/images/bath/bath-after-bright-1600.webp 1600w, <?php dh_assets(); ?>assets/images/bath/bath-after-bright-2400.webp 2400w" sizes="(min-width: 1280px) 1200px, 100vw" width="2400" height="1600" alt="After: a bright remodeled bathroom with a freestanding tub, marble walls and a walk-in shower" loading="lazy" decoding="async">
                <div class="compare__before" data-compare-before>
                  <img class="compare__img" src="<?php dh_assets(); ?>assets/images/bath/bath-before-blue-tile-1600.webp" srcset="<?php dh_assets(); ?>assets/images/bath/bath-before-blue-tile-640.webp 640w, <?php dh_assets(); ?>assets/images/bath/bath-before-blue-tile-800.webp 800w, <?php dh_assets(); ?>assets/images/bath/bath-before-blue-tile-1024.webp 1024w, <?php dh_assets(); ?>assets/images/bath/bath-before-blue-tile-1600.webp 1600w, <?php dh_assets(); ?>assets/images/bath/bath-before-blue-tile-2400.webp 2400w" sizes="(min-width: 1280px) 1200px, 100vw" width="2400" height="1600" alt="Before: a dated bathroom with dark blue tile, a wall-hung sink and an old toilet" loading="lazy" decoding="async">
                </div>
                <span class="compare__label compare__label--before" aria-hidden="true">Before</span>
                <span class="compare__label compare__label--after" aria-hidden="true">After</span>
                <div class="compare__handle" data-compare-handle aria-hidden="true"><span class="compare__knob"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m9 7-5 5 5 5M15 7l5 5-5 5"/></svg></span></div>
              </div>
              <label class="visually-hidden" for="compare-range-bath">Reveal before and after — bathroom</label>
              <input class="compare__range" id="compare-range-bath" type="range" min="0" max="100" value="50" step="1" data-compare-range>
              <figcaption class="dev-note"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.8v.2"/></svg> <span>Representative imagery. Replace with matching before/after photos from real client projects.</span></figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ 07–08. DARK ZONE: reviews + FAQ ============ -->
    <div class="theme-dark" data-header-theme="dark">

      <!-- IDEAS — style inspiration (representative photos, not client projects or reviews).
           When verified reviews exist, a review card set can reuse .quote-card. -->
      <section class="section quotes-ref" aria-labelledby="ideas-title" data-reviews>
        <div class="container">
          <header class="section-head section-head--split" data-reveal>
            <div>
              <h2 class="h2" id="ideas-title" data-word-reveal>Ideas for your home</h2>
              <p>A few looks to start from. Mention any you love in your estimate.</p>
            </div>
            <div class="reviews__controls">
              <button class="icon-btn icon-btn--outline" type="button" data-reviews-prev aria-label="Previous ideas"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m15 6-6 6 6 6"/></svg></button>
              <button class="icon-btn icon-btn--outline" type="button" data-reviews-next aria-label="Next ideas"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m9 6 6 6-6 6"/></svg></button>
            </div>
          </header>
        </div>
        <ul class="quote-track" role="list" data-reviews-track tabindex="0" aria-label="Home ideas">
          <li class="quote-card">
            <a class="quote-card__link" href="<?php echo esc_url( dh_url( 'windows' ) ); ?>">
              <img class="quote-card__img" src="<?php dh_assets(); ?>assets/images/windows/windows-arched-black-640.webp" srcset="<?php dh_assets(); ?>assets/images/windows/windows-arched-black-640.webp 640w, <?php dh_assets(); ?>assets/images/windows/windows-arched-black-800.webp 800w, <?php dh_assets(); ?>assets/images/windows/windows-arched-black-1024.webp 1024w" sizes="(min-width: 1024px) 24vw, 100vw" width="1600" height="2134" alt="" loading="lazy" decoding="async">
              <span class="quote-card__body"><span class="quote-card__tag">Windows</span><span class="quote-card__title">Black arched windows</span><span class="quote-card__text">Bold frames that turn windows into architecture.</span></span>
            </a>
          </li>
          <li class="quote-card">
            <a class="quote-card__link" href="<?php echo esc_url( dh_url( 'bath-remodel' ) ); ?>">
              <img class="quote-card__img" src="<?php dh_assets(); ?>assets/images/bath/bath-glass-shower-640.webp" srcset="<?php dh_assets(); ?>assets/images/bath/bath-glass-shower-640.webp 640w, <?php dh_assets(); ?>assets/images/bath/bath-glass-shower-800.webp 800w, <?php dh_assets(); ?>assets/images/bath/bath-glass-shower-1024.webp 1024w" sizes="(min-width: 1024px) 24vw, 100vw" width="1600" height="1066" alt="" loading="lazy" decoding="async">
              <span class="quote-card__body"><span class="quote-card__tag">Bath</span><span class="quote-card__title">Walk-in glass shower</span><span class="quote-card__text">Swap the old tub for an open, easy-clean shower.</span></span>
            </a>
          </li>
          <li class="quote-card">
            <a class="quote-card__link" href="<?php echo esc_url( dh_url( 'windows' ) ); ?>">
              <img class="quote-card__img" src="<?php dh_assets(); ?>assets/images/windows/windows-bay-living-room-640.webp" srcset="<?php dh_assets(); ?>assets/images/windows/windows-bay-living-room-640.webp 640w, <?php dh_assets(); ?>assets/images/windows/windows-bay-living-room-800.webp 800w, <?php dh_assets(); ?>assets/images/windows/windows-bay-living-room-1024.webp 1024w" sizes="(min-width: 1024px) 24vw, 100vw" width="1600" height="1066" alt="" loading="lazy" decoding="async">
              <span class="quote-card__body"><span class="quote-card__tag">Windows</span><span class="quote-card__title">Bright bay window</span><span class="quote-card__text">More light and a wider view from the same wall.</span></span>
            </a>
          </li>
          <li class="quote-card">
            <a class="quote-card__link" href="<?php echo esc_url( dh_url( 'bath-remodel' ) ); ?>">
              <img class="quote-card__img" src="<?php dh_assets(); ?>assets/images/bath/bath-oak-vanity-640.webp" srcset="<?php dh_assets(); ?>assets/images/bath/bath-oak-vanity-640.webp 640w, <?php dh_assets(); ?>assets/images/bath/bath-oak-vanity-800.webp 800w, <?php dh_assets(); ?>assets/images/bath/bath-oak-vanity-1024.webp 1024w" sizes="(min-width: 1024px) 24vw, 100vw" width="1600" height="1200" alt="" loading="lazy" decoding="async">
              <span class="quote-card__body"><span class="quote-card__tag">Bath</span><span class="quote-card__title">Warm oak vanity</span><span class="quote-card__text">A new vanity refreshes the whole bathroom.</span></span>
            </a>
          </li>
          <li class="quote-card">
            <a class="quote-card__link" href="<?php echo esc_url( dh_url( 'windows', '#grids' ) ); ?>">
              <img class="quote-card__img" src="<?php dh_assets(); ?>assets/images/windows/windows-double-hung-grids-640.webp" srcset="<?php dh_assets(); ?>assets/images/windows/windows-double-hung-grids-640.webp 640w, <?php dh_assets(); ?>assets/images/windows/windows-double-hung-grids-800.webp 800w, <?php dh_assets(); ?>assets/images/windows/windows-double-hung-grids-1024.webp 1024w" sizes="(min-width: 1024px) 24vw, 100vw" width="1600" height="1066" alt="" loading="lazy" decoding="async">
              <span class="quote-card__body"><span class="quote-card__tag">Windows</span><span class="quote-card__title">Classic colonial grids</span><span class="quote-card__text">Traditional divided panes for a timeless look.</span></span>
            </a>
          </li>
          <li class="quote-card">
            <a class="quote-card__link" href="<?php echo esc_url( dh_url( 'bath-remodel' ) ); ?>">
              <img class="quote-card__img" src="<?php dh_assets(); ?>assets/images/bath/bath-marble-vanity-640.webp" srcset="<?php dh_assets(); ?>assets/images/bath/bath-marble-vanity-640.webp 640w, <?php dh_assets(); ?>assets/images/bath/bath-marble-vanity-800.webp 800w, <?php dh_assets(); ?>assets/images/bath/bath-marble-vanity-1024.webp 1024w" sizes="(min-width: 1024px) 24vw, 100vw" width="1600" height="1089" alt="" loading="lazy" decoding="async">
              <span class="quote-card__body"><span class="quote-card__tag">Bath</span><span class="quote-card__title">Marble &amp; brass</span><span class="quote-card__text">A statement wall with twin mirrors and brass fixtures.</span></span>
            </a>
          </li>
        </ul>
      </section>

      <section class="section faq-ref" aria-labelledby="faq-title">
        <div class="container">
          <header class="section-head" data-reveal>
            <h2 class="h2" id="faq-title" data-word-reveal>Frequently asked questions</h2>
          </header>
          <div class="accordion accordion--rows" data-accordion="single" data-reveal>
            <div class="accordion__item">
              <h3 class="accordion__heading"><button class="accordion__trigger" type="button" id="faq-q1" aria-expanded="false" aria-controls="faq-a1" data-accordion-trigger><span class="accordion__num">01</span><span>How does the online estimate work?</span><span class="accordion__icon" aria-hidden="true"></span></button></h3>
              <div class="accordion__panel" id="faq-a1" role="region" aria-labelledby="faq-q1"><div class="accordion__inner"><p>Enter your details, choose your project, answer a few short questions and add photos. Our team reviews it personally and follows up with your proposal.</p></div></div>
            </div>
            <div class="accordion__item">
              <h3 class="accordion__heading"><button class="accordion__trigger" type="button" id="faq-q2" aria-expanded="false" aria-controls="faq-a2" data-accordion-trigger><span class="accordion__num">02</span><span>What photos should I upload?</span><span class="accordion__icon" aria-hidden="true"></span></button></h3>
              <div class="accordion__panel" id="faq-a2" role="region" aria-labelledby="faq-q2"><div class="accordion__inner"><p>One photo of each window you&rsquo;d like to replace &mdash; photographing each side of your home works well. For bathrooms, a wide shot plus close-ups of anything you&rsquo;d like to change.</p></div></div>
            </div>
            <div class="accordion__item">
              <h3 class="accordion__heading"><button class="accordion__trigger" type="button" id="faq-q3" aria-expanded="false" aria-controls="faq-a3" data-accordion-trigger><span class="accordion__num">03</span><span>Is framing included? What about tempered glass?</span><span class="accordion__icon" aria-hidden="true"></span></button></h3>
              <div class="accordion__panel" id="faq-a3" role="region" aria-labelledby="faq-q3"><div class="accordion__inner"><p>All of our window replacements come complete with new framing. Any windows that are on 2nd floor landings, in bathrooms, or are 16&Prime; or less from the floor, will be tempered.</p></div></div>
            </div>
            <div class="accordion__item">
              <h3 class="accordion__heading"><button class="accordion__trigger" type="button" id="faq-q4" aria-expanded="false" aria-controls="faq-a4" data-accordion-trigger><span class="accordion__num">04</span><span>Can I get windows and a bath remodel together?</span><span class="accordion__icon" aria-hidden="true"></span></button></h3>
              <div class="accordion__panel" id="faq-a4" role="region" aria-labelledby="faq-q4"><div class="accordion__inner"><p>Yes. Choose &ldquo;Both&rdquo; when you start and we&rsquo;ll guide you through each.</p></div></div>
            </div>
            <div class="accordion__item">
              <h3 class="accordion__heading"><button class="accordion__trigger" type="button" id="faq-q5" aria-expanded="false" aria-controls="faq-a5" data-accordion-trigger><span class="accordion__num">05</span><span>What happens after I hit complete?</span><span class="accordion__icon" aria-hidden="true"></span></button></h3>
              <div class="accordion__panel" id="faq-a5" role="region" aria-labelledby="faq-q5"><div class="accordion__inner"><p>Your estimate goes straight to our team with your photos. We review everything personally and you&rsquo;ll receive your proposal soon.</p></div></div>
            </div>
          </div>
        </div>
      </section>

      <!-- FINAL CTA -->
      <section class="cta-banner" aria-labelledby="cta-title">
        <div class="cta-banner__media">
          <img class="cta-banner__img" src="<?php dh_assets(); ?>assets/images/home/final-cta-home-dusk-1024.webp" srcset="<?php dh_assets(); ?>assets/images/home/final-cta-home-dusk-640.webp 640w, <?php dh_assets(); ?>assets/images/home/final-cta-home-dusk-800.webp 800w, <?php dh_assets(); ?>assets/images/home/final-cta-home-dusk-1024.webp 1024w, <?php dh_assets(); ?>assets/images/home/final-cta-home-dusk-1600.webp 1600w, <?php dh_assets(); ?>assets/images/home/final-cta-home-dusk-2400.webp 2400w" sizes="(orientation: portrait) and (max-width: 1023px) 130vh, 100vw" width="1600" height="1066" alt="" loading="lazy" decoding="async">
        </div>
        <div class="container cta-banner__content" data-reveal>
          <h2 class="cta-banner__title" id="cta-title">Ready when you are</h2>
          <p class="cta-banner__text">Tell us about your windows or bathroom in a few minutes.</p>
          <div class="cta-banner__actions">
            <a class="btn btn--light btn--lg" href="<?php echo esc_url( dh_url( 'estimate' ) ); ?>">Start your free estimate</a>
            <a class="btn btn--glass btn--lg" href="<?php echo esc_url( dh_url( 'contact' ) ); ?>">In-person quote</a>
          </div>
        </div>
      </section>
    </div>
    </div>
  </main>

  <?php get_footer(); ?>
