<?php defined( 'ABSPATH' ) || exit; ?>
<?php get_header(); ?>

  <main id="main">
    <section class="page-hero page-hero--center" aria-labelledby="work-title">
      <div class="container container--narrow">
        <h1 class="h1" id="work-title" data-split-lines>Project <em class="text-accent">inspiration.</em></h1>
        <p class="lead">Explore windows and bathrooms to find the look you love — then start your own project in a few minutes.</p>
      </div>
    </section>

    <section class="section section--flush-top" aria-labelledby="gallery-title">
      <div class="container">
        <h2 class="visually-hidden" id="gallery-title">Project gallery</h2>
        <!-- PLACEHOLDER: representative photography. Replace with the client's completed projects
             (keep data-category="windows" | "bath" so filtering keeps working). -->
        <p class="dev-note"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.8v.2"/></svg> <span>Representative imagery shown for layout. Replace with photos of the client&rsquo;s completed projects before launch.</span></p>

        <div class="gallery-toolbar">
          <div class="filter-chips" role="group" aria-label="Filter projects" data-gallery-filter>
            <button class="chip" type="button" aria-pressed="true" data-filter="all">All Projects</button>
            <button class="chip chip--thumb" type="button" aria-pressed="false" data-filter="windows"><img class="chip__thumb" src="<?php dh_assets(); ?>assets/images/windows/windows-double-hung-grids-1024.webp" srcset="<?php dh_assets(); ?>assets/images/windows/windows-double-hung-grids-640.webp 640w, <?php dh_assets(); ?>assets/images/windows/windows-double-hung-grids-800.webp 800w, <?php dh_assets(); ?>assets/images/windows/windows-double-hung-grids-1024.webp 1024w, <?php dh_assets(); ?>assets/images/windows/windows-double-hung-grids-1600.webp 1600w" sizes="36px" width="1600" height="1066" alt="" loading="lazy" decoding="async"> Windows</button>
            <button class="chip chip--thumb" type="button" aria-pressed="false" data-filter="bath"><img class="chip__thumb" src="<?php dh_assets(); ?>assets/images/bath/bath-glass-shower-1024.webp" srcset="<?php dh_assets(); ?>assets/images/bath/bath-glass-shower-640.webp 640w, <?php dh_assets(); ?>assets/images/bath/bath-glass-shower-800.webp 800w, <?php dh_assets(); ?>assets/images/bath/bath-glass-shower-1024.webp 1024w, <?php dh_assets(); ?>assets/images/bath/bath-glass-shower-1600.webp 1600w, <?php dh_assets(); ?>assets/images/bath/bath-glass-shower-2400.webp 2400w" sizes="36px" width="1600" height="1066" alt="" loading="lazy" decoding="async"> Bath Remodel</button>
          </div>
          <p class="gallery-toolbar__count" aria-live="polite" data-gallery-count>12 projects</p>
        </div>

        <ul class="work-grid" role="list" data-gallery>
          <li class="work-item work-item--wide" data-category="windows">
            <button class="work-item__btn" type="button" data-lightbox-open data-full="<?php dh_assets(); ?>assets/images/windows/windows-sunroom-1600.webp">
              <img class="work-item__img" src="<?php dh_assets(); ?>assets/images/windows/windows-sunroom-1024.webp" srcset="<?php dh_assets(); ?>assets/images/windows/windows-sunroom-640.webp 640w, <?php dh_assets(); ?>assets/images/windows/windows-sunroom-800.webp 800w, <?php dh_assets(); ?>assets/images/windows/windows-sunroom-1024.webp 1024w, <?php dh_assets(); ?>assets/images/windows/windows-sunroom-1600.webp 1600w, <?php dh_assets(); ?>assets/images/windows/windows-sunroom-2400.webp 2400w" sizes="(min-width: 1024px) 60vw, 100vw" width="1600" height="1066" alt="Sunroom surrounded by windows with leather chairs" loading="lazy" decoding="async">
              <span class="work-item__meta"><span class="work-item__cat">Windows</span><span class="work-item__title">Sunlit Sunroom</span></span>
            </button>
          </li>
          <li class="work-item" data-category="bath">
            <button class="work-item__btn" type="button" data-lightbox-open data-full="<?php dh_assets(); ?>assets/images/bath/bath-glass-shower-1600.webp">
              <img class="work-item__img" src="<?php dh_assets(); ?>assets/images/bath/bath-glass-shower-1024.webp" srcset="<?php dh_assets(); ?>assets/images/bath/bath-glass-shower-640.webp 640w, <?php dh_assets(); ?>assets/images/bath/bath-glass-shower-800.webp 800w, <?php dh_assets(); ?>assets/images/bath/bath-glass-shower-1024.webp 1024w, <?php dh_assets(); ?>assets/images/bath/bath-glass-shower-1600.webp 1600w, <?php dh_assets(); ?>assets/images/bath/bath-glass-shower-2400.webp 2400w" sizes="(min-width: 1024px) 30vw, 100vw" width="1600" height="1066" alt="Bathroom with a frameless glass shower and long vanity" loading="lazy" decoding="async">
              <span class="work-item__meta"><span class="work-item__cat">Bath Remodel</span><span class="work-item__title">Glass Shower Suite</span></span>
            </button>
          </li>
          <li class="work-item" data-category="windows">
            <button class="work-item__btn" type="button" data-lightbox-open data-full="<?php dh_assets(); ?>assets/images/windows/windows-bay-living-room-1600.webp">
              <img class="work-item__img" src="<?php dh_assets(); ?>assets/images/windows/windows-bay-living-room-1024.webp" srcset="<?php dh_assets(); ?>assets/images/windows/windows-bay-living-room-640.webp 640w, <?php dh_assets(); ?>assets/images/windows/windows-bay-living-room-800.webp 800w, <?php dh_assets(); ?>assets/images/windows/windows-bay-living-room-1024.webp 1024w, <?php dh_assets(); ?>assets/images/windows/windows-bay-living-room-1600.webp 1600w" sizes="(min-width: 1024px) 30vw, 100vw" width="1600" height="1066" alt="Living room with a bay window and sectional sofa" loading="lazy" decoding="async">
              <span class="work-item__meta"><span class="work-item__cat">Windows</span><span class="work-item__title">Bay Window Living Room</span></span>
            </button>
          </li>
          <li class="work-item" data-category="bath">
            <button class="work-item__btn" type="button" data-lightbox-open data-full="<?php dh_assets(); ?>assets/images/bath/bath-grey-black-sink-1600.webp">
              <img class="work-item__img" src="<?php dh_assets(); ?>assets/images/bath/bath-grey-black-sink-1024.webp" srcset="<?php dh_assets(); ?>assets/images/bath/bath-grey-black-sink-640.webp 640w, <?php dh_assets(); ?>assets/images/bath/bath-grey-black-sink-800.webp 800w, <?php dh_assets(); ?>assets/images/bath/bath-grey-black-sink-1024.webp 1024w, <?php dh_assets(); ?>assets/images/bath/bath-grey-black-sink-1600.webp 1600w" sizes="(min-width: 1024px) 30vw, 100vw" width="1600" height="1066" alt="Grey tiled bathroom with a black vessel sink" loading="lazy" decoding="async">
              <span class="work-item__meta"><span class="work-item__cat">Bath Remodel</span><span class="work-item__title">Modern Grey &amp; Black</span></span>
            </button>
          </li>
          <li class="work-item" data-category="windows">
            <button class="work-item__btn" type="button" data-lightbox-open data-full="<?php dh_assets(); ?>assets/images/projects/exterior-farmhouse-porch-1600.webp">
              <img class="work-item__img" src="<?php dh_assets(); ?>assets/images/projects/exterior-farmhouse-porch-1024.webp" srcset="<?php dh_assets(); ?>assets/images/projects/exterior-farmhouse-porch-640.webp 640w, <?php dh_assets(); ?>assets/images/projects/exterior-farmhouse-porch-800.webp 800w, <?php dh_assets(); ?>assets/images/projects/exterior-farmhouse-porch-1024.webp 1024w, <?php dh_assets(); ?>assets/images/projects/exterior-farmhouse-porch-1600.webp 1600w" sizes="(min-width: 1024px) 30vw, 100vw" width="1600" height="1066" alt="White farmhouse with many windows and a wraparound porch" loading="lazy" decoding="async">
              <span class="work-item__meta"><span class="work-item__cat">Windows</span><span class="work-item__title">Farmhouse Exterior</span></span>
            </button>
          </li>
          <li class="work-item work-item--tall" data-category="bath">
            <button class="work-item__btn" type="button" data-lightbox-open data-full="<?php dh_assets(); ?>assets/images/bath/bath-dark-tub-1600.webp">
              <img class="work-item__img" src="<?php dh_assets(); ?>assets/images/bath/bath-dark-tub-1024.webp" srcset="<?php dh_assets(); ?>assets/images/bath/bath-dark-tub-640.webp 640w, <?php dh_assets(); ?>assets/images/bath/bath-dark-tub-800.webp 800w, <?php dh_assets(); ?>assets/images/bath/bath-dark-tub-1024.webp 1024w, <?php dh_assets(); ?>assets/images/bath/bath-dark-tub-1600.webp 1600w" sizes="(min-width: 1024px) 30vw, 100vw" width="1600" height="2400" alt="Dark bathroom with a white freestanding tub" loading="lazy" decoding="async">
              <span class="work-item__meta"><span class="work-item__cat">Bath Remodel</span><span class="work-item__title">Dark &amp; Dramatic</span></span>
            </button>
          </li>
          <li class="work-item" data-category="windows">
            <button class="work-item__btn" type="button" data-lightbox-open data-full="<?php dh_assets(); ?>assets/images/windows/windows-living-room-light-1600.webp">
              <img class="work-item__img" src="<?php dh_assets(); ?>assets/images/windows/windows-living-room-light-1024.webp" srcset="<?php dh_assets(); ?>assets/images/windows/windows-living-room-light-640.webp 640w, <?php dh_assets(); ?>assets/images/windows/windows-living-room-light-800.webp 800w, <?php dh_assets(); ?>assets/images/windows/windows-living-room-light-1024.webp 1024w, <?php dh_assets(); ?>assets/images/windows/windows-living-room-light-1600.webp 1600w" sizes="(min-width: 1024px) 30vw, 100vw" width="1600" height="1066" alt="Living room with large windows and a view of the neighborhood" loading="lazy" decoding="async">
              <span class="work-item__meta"><span class="work-item__cat">Windows</span><span class="work-item__title">Open, Light-Filled Living</span></span>
            </button>
          </li>
          <li class="work-item" data-category="bath">
            <button class="work-item__btn" type="button" data-lightbox-open data-full="<?php dh_assets(); ?>assets/images/bath/bath-marble-vanity-1600.webp">
              <img class="work-item__img" src="<?php dh_assets(); ?>assets/images/bath/bath-marble-vanity-1024.webp" srcset="<?php dh_assets(); ?>assets/images/bath/bath-marble-vanity-640.webp 640w, <?php dh_assets(); ?>assets/images/bath/bath-marble-vanity-800.webp 800w, <?php dh_assets(); ?>assets/images/bath/bath-marble-vanity-1024.webp 1024w, <?php dh_assets(); ?>assets/images/bath/bath-marble-vanity-1600.webp 1600w" sizes="(min-width: 1024px) 30vw, 100vw" width="1600" height="1089" alt="Marble bathroom with twin round mirrors and brass fixtures" loading="lazy" decoding="async">
              <span class="work-item__meta"><span class="work-item__cat">Bath Remodel</span><span class="work-item__title">Marble &amp; Brass</span></span>
            </button>
          </li>
          <li class="work-item work-item--wide" data-category="windows">
            <button class="work-item__btn" type="button" data-lightbox-open data-full="<?php dh_assets(); ?>assets/images/projects/exterior-brick-suburban-1600.webp">
              <img class="work-item__img" src="<?php dh_assets(); ?>assets/images/projects/exterior-brick-suburban-1024.webp" srcset="<?php dh_assets(); ?>assets/images/projects/exterior-brick-suburban-640.webp 640w, <?php dh_assets(); ?>assets/images/projects/exterior-brick-suburban-800.webp 800w, <?php dh_assets(); ?>assets/images/projects/exterior-brick-suburban-1024.webp 1024w, <?php dh_assets(); ?>assets/images/projects/exterior-brick-suburban-1600.webp 1600w" sizes="(min-width: 1024px) 60vw, 100vw" width="1600" height="1200" alt="Brick two-story home with a lawn and mature trees" loading="lazy" decoding="async">
              <span class="work-item__meta"><span class="work-item__cat">Windows</span><span class="work-item__title">Classic Brick Home</span></span>
            </button>
          </li>
          <li class="work-item" data-category="bath">
            <button class="work-item__btn" type="button" data-lightbox-open data-full="<?php dh_assets(); ?>assets/images/bath/bath-oak-vanity-1600.webp">
              <img class="work-item__img" src="<?php dh_assets(); ?>assets/images/bath/bath-oak-vanity-1024.webp" srcset="<?php dh_assets(); ?>assets/images/bath/bath-oak-vanity-640.webp 640w, <?php dh_assets(); ?>assets/images/bath/bath-oak-vanity-800.webp 800w, <?php dh_assets(); ?>assets/images/bath/bath-oak-vanity-1024.webp 1024w, <?php dh_assets(); ?>assets/images/bath/bath-oak-vanity-1600.webp 1600w" sizes="(min-width: 1024px) 30vw, 100vw" width="1600" height="1200" alt="Light oak vanity with two white vessel sinks" loading="lazy" decoding="async">
              <span class="work-item__meta"><span class="work-item__cat">Bath Remodel</span><span class="work-item__title">Warm Oak Vanity</span></span>
            </button>
          </li>
          <li class="work-item" data-category="windows">
            <button class="work-item__btn" type="button" data-lightbox-open data-full="<?php dh_assets(); ?>assets/images/projects/exterior-porch-autumn-1600.webp">
              <img class="work-item__img" src="<?php dh_assets(); ?>assets/images/projects/exterior-porch-autumn-1024.webp" srcset="<?php dh_assets(); ?>assets/images/projects/exterior-porch-autumn-640.webp 640w, <?php dh_assets(); ?>assets/images/projects/exterior-porch-autumn-800.webp 800w, <?php dh_assets(); ?>assets/images/projects/exterior-porch-autumn-1024.webp 1024w, <?php dh_assets(); ?>assets/images/projects/exterior-porch-autumn-1600.webp 1600w" sizes="(min-width: 1024px) 30vw, 100vw" width="1600" height="1068" alt="Two-story white house with a front porch in autumn" loading="lazy" decoding="async">
              <span class="work-item__meta"><span class="work-item__cat">Windows</span><span class="work-item__title">Autumn Front Porch</span></span>
            </button>
          </li>
          <li class="work-item" data-category="bath">
            <button class="work-item__btn" type="button" data-lightbox-open data-full="<?php dh_assets(); ?>assets/images/bath/bath-stone-tub-1600.webp">
              <img class="work-item__img" src="<?php dh_assets(); ?>assets/images/bath/bath-stone-tub-1024.webp" srcset="<?php dh_assets(); ?>assets/images/bath/bath-stone-tub-640.webp 640w, <?php dh_assets(); ?>assets/images/bath/bath-stone-tub-800.webp 800w, <?php dh_assets(); ?>assets/images/bath/bath-stone-tub-1024.webp 1024w, <?php dh_assets(); ?>assets/images/bath/bath-stone-tub-1600.webp 1600w" sizes="(min-width: 1024px) 30vw, 100vw" width="1600" height="1066" alt="Stone soaking tub in a spa-like bathroom" loading="lazy" decoding="async">
              <span class="work-item__meta"><span class="work-item__cat">Bath Remodel</span><span class="work-item__title">Spa-Inspired Retreat</span></span>
            </button>
          </li>
        </ul>
      </div>
    </section>

    <section class="section section--surface" aria-labelledby="work-ba-title">
      <div class="container">
        <header class="section-head section-head--center" data-reveal>
          <h2 class="h2" id="work-ba-title" data-word-reveal>Compare the <em class="text-accent">transformation.</em></h2>
        </header>
        <div class="tabs" data-tabs data-reveal>
          <div class="tabs__list" role="tablist" aria-label="Transformation type">
            <span class="tabs__indicator" aria-hidden="true"></span>
            <button class="tabs__tab" type="button" role="tab" id="wk-tab-windows" aria-selected="true" aria-controls="wk-panel-windows"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="5" y="3.5" width="14" height="17" rx="1.5"/><path d="M5 12h14M12 3.5v17"/></svg> Windows</button>
            <button class="tabs__tab" type="button" role="tab" id="wk-tab-bath" aria-selected="false" aria-controls="wk-panel-bath" tabindex="-1"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3.5 12h17v2.5a5 5 0 0 1-5 5h-7a5 5 0 0 1-5-5z"/><path d="M6 12V6.5a2.5 2.5 0 0 1 4.8-1"/><path d="m7 19.5-1 1.5M17 19.5l1 1.5"/></svg> Bath Remodel</button>
          </div>
          <div class="tabs__panel" id="wk-panel-windows" role="tabpanel" aria-labelledby="wk-tab-windows">
            <figure class="compare" data-compare>
              <div class="compare__stage" data-compare-stage>
                <img class="compare__img" src="<?php dh_assets(); ?>assets/images/windows/windows-bedroom-white-1024.webp" srcset="<?php dh_assets(); ?>assets/images/windows/windows-bedroom-white-640.webp 640w, <?php dh_assets(); ?>assets/images/windows/windows-bedroom-white-800.webp 800w, <?php dh_assets(); ?>assets/images/windows/windows-bedroom-white-1024.webp 1024w, <?php dh_assets(); ?>assets/images/windows/windows-bedroom-white-1600.webp 1600w" sizes="(min-width: 1280px) 1200px, 100vw" width="1600" height="1066" alt="After: bright bedroom with new white windows" loading="lazy" decoding="async">
                <div class="compare__before" data-compare-before>
                  <img class="compare__img" src="<?php dh_assets(); ?>assets/images/windows/windows-dated-window-seat-1024.webp" srcset="<?php dh_assets(); ?>assets/images/windows/windows-dated-window-seat-640.webp 640w, <?php dh_assets(); ?>assets/images/windows/windows-dated-window-seat-800.webp 800w, <?php dh_assets(); ?>assets/images/windows/windows-dated-window-seat-1024.webp 1024w, <?php dh_assets(); ?>assets/images/windows/windows-dated-window-seat-1600.webp 1600w" sizes="(min-width: 1280px) 1200px, 100vw" width="1600" height="1334" alt="Before: dim window seat with dated frames and heavy curtains" loading="lazy" decoding="async">
                </div>
                <span class="compare__label compare__label--before" aria-hidden="true">Before</span>
                <span class="compare__label compare__label--after" aria-hidden="true">After</span>
                <div class="compare__handle" data-compare-handle aria-hidden="true"><span class="compare__knob"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m9 7-5 5 5 5M15 7l5 5-5 5"/></svg></span></div>
              </div>
              <label class="visually-hidden" for="wk-range-w">Reveal before and after — windows</label>
              <input class="compare__range" id="wk-range-w" type="range" min="0" max="100" value="50" step="1" data-compare-range>
            </figure>
          </div>
          <div class="tabs__panel" id="wk-panel-bath" role="tabpanel" aria-labelledby="wk-tab-bath" hidden>
            <figure class="compare" data-compare>
              <div class="compare__stage" data-compare-stage>
                <img class="compare__img" src="<?php dh_assets(); ?>assets/images/bath/bath-double-vessel-1024.webp" srcset="<?php dh_assets(); ?>assets/images/bath/bath-double-vessel-640.webp 640w, <?php dh_assets(); ?>assets/images/bath/bath-double-vessel-800.webp 800w, <?php dh_assets(); ?>assets/images/bath/bath-double-vessel-1024.webp 1024w, <?php dh_assets(); ?>assets/images/bath/bath-double-vessel-1600.webp 1600w" sizes="(min-width: 1280px) 1200px, 100vw" width="1600" height="1068" alt="After: modern bathroom with double vessel sinks and a glass shower" loading="lazy" decoding="async">
                <div class="compare__before" data-compare-before>
                  <img class="compare__img compare__img--top" src="<?php dh_assets(); ?>assets/images/bath/bath-dated-small-1024.webp" srcset="<?php dh_assets(); ?>assets/images/bath/bath-dated-small-640.webp 640w, <?php dh_assets(); ?>assets/images/bath/bath-dated-small-800.webp 800w, <?php dh_assets(); ?>assets/images/bath/bath-dated-small-1024.webp 1024w, <?php dh_assets(); ?>assets/images/bath/bath-dated-small-1600.webp 1600w" sizes="(min-width: 1280px) 1200px, 100vw" width="1600" height="2399" alt="Before: small dated bathroom with a pedestal sink and checkered floor" loading="lazy" decoding="async">
                </div>
                <span class="compare__label compare__label--before" aria-hidden="true">Before</span>
                <span class="compare__label compare__label--after" aria-hidden="true">After</span>
                <div class="compare__handle" data-compare-handle aria-hidden="true"><span class="compare__knob"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m9 7-5 5 5 5M15 7l5 5-5 5"/></svg></span></div>
              </div>
              <label class="visually-hidden" for="wk-range-b">Reveal before and after — bathroom</label>
              <input class="compare__range" id="wk-range-b" type="range" min="0" max="100" value="50" step="1" data-compare-range>
            </figure>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-banner" aria-labelledby="work-cta-title">
          <div class="cta-banner__media">
            <img class="cta-banner__img" src="<?php dh_assets(); ?>assets/images/home/final-cta-home-dusk-1024.webp" srcset="<?php dh_assets(); ?>assets/images/home/final-cta-home-dusk-640.webp 640w, <?php dh_assets(); ?>assets/images/home/final-cta-home-dusk-800.webp 800w, <?php dh_assets(); ?>assets/images/home/final-cta-home-dusk-1024.webp 1024w, <?php dh_assets(); ?>assets/images/home/final-cta-home-dusk-1600.webp 1600w, <?php dh_assets(); ?>assets/images/home/final-cta-home-dusk-2400.webp 2400w" sizes="(orientation: portrait) and (max-width: 1023px) 130vh, (min-width: 1280px) 1200px, 100vw" width="1600" height="1066" alt="" loading="lazy" decoding="async">
          </div>
          <div class="container cta-banner__content" data-reveal>
            <h2 class="cta-banner__title" id="work-cta-title">Found a look <em class="text-accent">you love?</em></h2>
            <p class="cta-banner__text">Start your estimate and mention the styles that caught your eye.</p>
            <div class="cta-banner__actions">
              <a class="btn btn--primary btn--lg" href="<?php echo esc_url( dh_url( 'estimate' ) ); ?>">Start Your Estimate <span class="btn__icon"><svg class="icon btn__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></a>
              <a class="btn btn--outline-light btn--lg" href="<?php echo esc_url( dh_url( 'contact' ) ); ?>">Contact Us</a>
            </div>
          </div>
    </section>
  </main>

  <!-- Lightbox (native dialog: focus trapping + Escape handled by the browser) -->
  <dialog class="lightbox" data-lightbox aria-label="Project image viewer">
    <div class="lightbox__inner">
      <button class="icon-btn lightbox__close" type="button" data-lightbox-close aria-label="Close image viewer"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
      <figure class="lightbox__figure">
        <img class="lightbox__img" src="<?php dh_assets(); ?>assets/images/windows/windows-sunroom-1024.webp" alt="" width="1600" height="1066" data-lightbox-img>
        <figcaption class="lightbox__caption" data-lightbox-caption></figcaption>
      </figure>
      <button class="icon-btn lightbox__nav lightbox__nav--prev" type="button" data-lightbox-prev aria-label="Previous image"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m15 6-6 6 6 6"/></svg></button>
      <button class="icon-btn lightbox__nav lightbox__nav--next" type="button" data-lightbox-next aria-label="Next image"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m9 6 6 6-6 6"/></svg></button>
    </div>
  </dialog>

  <?php get_footer(); ?>
