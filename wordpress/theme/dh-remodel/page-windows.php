<?php defined( 'ABSPATH' ) || exit; ?>
<?php get_header(); ?>

  <main id="main" data-frame-root>

    <!-- ============ 1. HERO ============ -->
    <section class="page-hero page-hero--split windows-hero" aria-labelledby="windows-title">
      <div class="container page-hero__grid">
        <div class="page-hero__content">
          <h1 class="h1" id="windows-title" data-split-lines>Brighter rooms start with <em class="text-accent">better windows.</em></h1>
          <p class="lead">Choose the style, color and grid pattern that suit your home, share a few photos, and let our team review the details with you.</p>
          <div class="page-hero__actions">
            <a class="btn btn--primary btn--lg" href="<?php echo esc_url( dh_url( 'estimate', '?project=windows' ) ); ?>">Start Your Windows Estimate <span class="btn__icon"><svg class="icon btn__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></a>
            <a class="btn btn--secondary btn--lg" href="#colors">See Color Options</a>
          </div>
          <!-- Counts reflect the client-supplied option lists (7 colors, 4 grid choices; her estimate script, 5 Oct). -->
          <ul class="stat-tiles" role="list">
            <li class="stat-tile"><span class="stat-tile__icon"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="8.5" cy="12" r="4.5"/><circle cx="15.5" cy="12" r="4.5"/></svg></span><strong>7 colors</strong><span>Frame finishes</span></li>
            <li class="stat-tile"><span class="stat-tile__icon"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="4" y="4" width="16" height="16" rx="1.5"/><path d="M4 12h16M12 4v16"/></svg></span><strong>4 grid choices</strong><span>Grid options</span></li>
            <li class="stat-tile"><span class="stat-tile__icon"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2.1l1.3-2h6.2l1.3 2h2.1A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z"/><circle cx="12" cy="13" r="3.5"/></svg></span><strong>Online</strong><span>Photo estimate</span></li>
          </ul>
        </div>
        <div class="page-hero__media">
          <img class="page-hero__img" src="<?php dh_assets(); ?>assets/images/windows/windows-arched-black-1024.webp" srcset="<?php dh_assets(); ?>assets/images/windows/windows-arched-black-640.webp 640w, <?php dh_assets(); ?>assets/images/windows/windows-arched-black-800.webp 800w, <?php dh_assets(); ?>assets/images/windows/windows-arched-black-1024.webp 1024w, <?php dh_assets(); ?>assets/images/windows/windows-arched-black-1600.webp 1600w" sizes="(min-width: 1024px) 44vw, 100vw" width="1600" height="2134" alt="Living room with two arched black-framed windows beside a fireplace" fetchpriority="high" decoding="async">
          <div class="float-card float-card--swatches" aria-hidden="true">
            <span class="float-card__label">Frame color</span>
            <span class="float-card__row">
              <span class="swatch-dot swatch-dot--black"></span>
              <span class="swatch-dot swatch-dot--white"></span>
              <span class="swatch-dot swatch-dot--burgundy"></span>
              <span class="swatch-dot swatch-dot--tan"></span>
            </span>
            <span class="float-card__value">Black / Black</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ 2. VALUE PROPOSITION ============ -->
    <section class="section" aria-labelledby="value-title">
      <div class="container value-split">
        <div class="value-split__media" data-reveal="clip">
          <img class="rounded-img" src="<?php dh_assets(); ?>assets/images/windows/windows-double-hung-grids-1024.webp" srcset="<?php dh_assets(); ?>assets/images/windows/windows-double-hung-grids-640.webp 640w, <?php dh_assets(); ?>assets/images/windows/windows-double-hung-grids-800.webp 800w, <?php dh_assets(); ?>assets/images/windows/windows-double-hung-grids-1024.webp 1024w, <?php dh_assets(); ?>assets/images/windows/windows-double-hung-grids-1600.webp 1600w" sizes="(min-width: 1024px) 46vw, 100vw" width="1600" height="1066" alt="Pair of double-hung windows with grids framing a comfortable sofa" loading="lazy" decoding="async">
        </div>
        <div class="value-split__content">
          <header class="section-head" data-reveal>
            <h2 class="h2" id="value-title" data-word-reveal>More light, cleaner lines, <em class="text-accent">an easier decision.</em></h2>
            <p>New windows change how a room looks and feels. We make choosing them simple — visually, from home, with a real person reviewing the details.</p>
          </header>
          <ul class="check-list" role="list" data-reveal="stagger">
            <li><span class="check-list__icon"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="8.5" cy="12" r="4.5"/><circle cx="15.5" cy="12" r="4.5"/></svg></span><div><h3>Choose with confidence</h3><p>See frame colors and grid styles visually before you decide.</p></div></li>
            <li><span class="check-list__icon"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2.1l1.3-2h6.2l1.3 2h2.1A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z"/><circle cx="12" cy="13" r="3.5"/></svg></span><div><h3>Planned from your photos</h3><p>Show us your existing windows so we understand your home.</p></div></li>
            <li><span class="check-list__icon"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="8.5" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/></svg></span><div><h3>Recommendations when you want them</h3><p>Keep your current style, or ask us to recommend the best option.</p></div></li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ============ 3. WINDOW STYLES ============ -->
    <section class="section section--surface" id="styles" aria-labelledby="styles-title">
      <div class="container">
        <header class="section-head section-head--center" data-reveal>
          <h2 class="h2" id="styles-title" data-word-reveal>Explore common <em class="text-accent">window styles.</em></h2>
          <p>Not sure what you have today? That&rsquo;s okay — your photos tell us a lot. These are the styles homeowners ask about most.</p>
        </header>
        <!-- CONTENT TO CONFIRM: neutral, manufacturer-agnostic categories used for layout.
             Replace or trim to match the client's actual product lineup. -->
        <p class="dev-note"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.8v.2"/></svg> <span>Neutral style categories shown for layout. Confirm the final window lineup with the client before launch.</span></p>
        <ul class="style-grid" role="list" data-reveal="stagger">
          <li class="style-card"><span class="style-card__diagram" data-diagram="style" data-style="double-hung"></span><h3 class="style-card__title">Double-Hung</h3><p class="style-card__text">Two sashes that slide up and down — a classic look for most homes.</p></li>
          <li class="style-card"><span class="style-card__diagram" data-diagram="style" data-style="casement"></span><h3 class="style-card__title">Casement</h3><p class="style-card__text">Hinged on the side and cranks outward, like a door.</p></li>
          <li class="style-card"><span class="style-card__diagram" data-diagram="style" data-style="sliding"></span><h3 class="style-card__title">Sliding</h3><p class="style-card__text">Sashes glide side to side — simple and space-friendly.</p></li>
          <li class="style-card"><span class="style-card__diagram" data-diagram="style" data-style="picture"></span><h3 class="style-card__title">Picture</h3><p class="style-card__text">A fixed window designed to frame the view and bring in light.</p></li>
          <li class="style-card"><span class="style-card__diagram" data-diagram="style" data-style="bay"></span><h3 class="style-card__title">Bay &amp; Bow</h3><p class="style-card__text">Several windows that project outward to add light and space.</p></li>
          <li class="style-card"><span class="style-card__diagram" data-diagram="style" data-style="awning"></span><h3 class="style-card__title">Awning</h3><p class="style-card__text">Hinged at the top and opens outward from the bottom.</p></li>
        </ul>
      </div>
    </section>

    <!-- ============ 4. COLOR VISUALIZER ============ -->
    <section class="section" id="colors" aria-labelledby="colors-title">
      <div class="container">
        <header class="section-head section-head--split" data-reveal>
          <div>
            <h2 class="h2" id="colors-title" data-word-reveal>Find the right <em class="text-accent">frame color.</em></h2>
          </div>
          <p class="section-head__aside">Choose from seven frame colors. Select one to preview it on the window, inside and out.</p>
        </header>

        <div class="color-viz" data-color-viz data-reveal>
          <div class="color-viz__stage" data-view="interior">
            <div class="segmented color-viz__toggle" role="group" aria-label="Preview side">
              <button class="segmented__btn" type="button" aria-pressed="true" data-viz-view="interior">Interior</button>
              <button class="segmented__btn" type="button" aria-pressed="false" data-viz-view="exterior">Exterior</button>
            </div>
            <div class="color-viz__window" data-viz-window aria-hidden="true"></div>
            <p class="color-viz__caption" aria-live="polite">
              <strong data-viz-name>White</strong>
              <span data-viz-detail>White inside and out</span>
            </p>
          </div>
          <fieldset class="color-viz__options">
            <legend class="color-viz__legend">Frame colors</legend>
            <!-- Swatch cards are rendered from WINDOW_COLORS in main.js (shared with the estimator).
                 The list below is the no-JavaScript fallback. -->
            <div class="swatch-grid" data-render="window-colors" data-input-name="viz-color">
              <ul class="plain-list">
                <li>White</li><li>Tan</li><li>Black</li><li>Burgundy</li><li>Grey</li><li>Green</li><li>Dark Brown</li>
              </ul>
            </div>
            <p class="fine-print"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.8v.2"/></svg> On-screen colors are approximate. Final finishes are confirmed during your project review.</p>
          </fieldset>
        </div>
      </div>
    </section>

    <!-- ============ 5. GRID STYLES ============ -->
    <section class="section section--surface" id="grids" aria-labelledby="grids-title">
      <div class="container">
        <header class="section-head section-head--center" data-reveal>
          <h2 class="h2" id="grids-title" data-word-reveal>Add character <em class="text-accent">with grids.</em></h2>
          <p>Grids divide the glass into panes for a traditional look — or skip them for a clean, open view. Diagrams follow the frame color you chose above.</p>
        </header>
        <!-- Grid cards are rendered from WINDOW_GRIDS in main.js (the same diagrams appear in the estimator). -->
        <div class="grid-showcase" data-render="window-grids" data-reveal="stagger">
          <ul class="plain-list"><li>No Grids</li><li>Colonial</li><li>Diamond</li></ul>
        </div>
        <figure class="grid-photo" data-reveal="clip">
          <img class="grid-photo__img" src="<?php dh_assets(); ?>assets/images/projects/exterior-cottage-grids-1024.webp" srcset="<?php dh_assets(); ?>assets/images/projects/exterior-cottage-grids-640.webp 640w, <?php dh_assets(); ?>assets/images/projects/exterior-cottage-grids-800.webp 800w, <?php dh_assets(); ?>assets/images/projects/exterior-cottage-grids-1024.webp 1024w, <?php dh_assets(); ?>assets/images/projects/exterior-cottage-grids-1600.webp 1600w" sizes="(min-width: 1280px) 1200px, 100vw" width="1600" height="949" alt="White cottage with divided-light windows and window boxes" loading="lazy" decoding="async">
          <figcaption>Traditional grids give a classic home its character.</figcaption>
        </figure>
      </div>
    </section>

    <!-- ============ 6. PHOTO GUIDANCE ============ -->
    <section class="section" id="photos" aria-labelledby="photos-title">
      <div class="container">
        <header class="section-head section-head--split" data-reveal>
          <div>
            <h2 class="h2" id="photos-title" data-word-reveal>Your photos help us <em class="text-accent">plan it right.</em></h2>
          </div>
          <p class="section-head__aside">Clear photos from inside or outside are helpful. If possible, photograph each window or side of the home.</p>
        </header>
        <ol class="tip-grid" role="list" data-reveal="stagger">
          <li class="tip-card">
            <img class="tip-card__img" src="<?php dh_assets(); ?>assets/images/windows/windows-bedroom-white-1024.webp" srcset="<?php dh_assets(); ?>assets/images/windows/windows-bedroom-white-640.webp 640w, <?php dh_assets(); ?>assets/images/windows/windows-bedroom-white-800.webp 800w, <?php dh_assets(); ?>assets/images/windows/windows-bedroom-white-1024.webp 1024w, <?php dh_assets(); ?>assets/images/windows/windows-bedroom-white-1600.webp 1600w" sizes="(min-width: 1024px) 30vw, 100vw" width="1600" height="1066" alt="Bedroom with two white windows fully in frame" loading="lazy" decoding="async">
            <div class="tip-card__body"><span class="tip-card__num">1</span><h3>Capture the whole window</h3><p>Stand back so the full frame and trim are in view.</p></div>
          </li>
          <li class="tip-card">
            <img class="tip-card__img" src="<?php dh_assets(); ?>assets/images/projects/exterior-white-cottage-1024.webp" srcset="<?php dh_assets(); ?>assets/images/projects/exterior-white-cottage-640.webp 640w, <?php dh_assets(); ?>assets/images/projects/exterior-white-cottage-800.webp 800w, <?php dh_assets(); ?>assets/images/projects/exterior-white-cottage-1024.webp 1024w, <?php dh_assets(); ?>assets/images/projects/exterior-white-cottage-1600.webp 1600w" sizes="(min-width: 1024px) 30vw, 100vw" width="1600" height="1063" alt="White house with several windows photographed from the yard" loading="lazy" decoding="async">
            <div class="tip-card__body"><span class="tip-card__num">2</span><h3>Inside or outside both help</h3><p>Use whichever view is easiest — or share both.</p></div>
          </li>
          <li class="tip-card">
            <img class="tip-card__img" src="<?php dh_assets(); ?>assets/images/projects/exterior-farmhouse-porch-1024.webp" srcset="<?php dh_assets(); ?>assets/images/projects/exterior-farmhouse-porch-640.webp 640w, <?php dh_assets(); ?>assets/images/projects/exterior-farmhouse-porch-800.webp 800w, <?php dh_assets(); ?>assets/images/projects/exterior-farmhouse-porch-1024.webp 1024w, <?php dh_assets(); ?>assets/images/projects/exterior-farmhouse-porch-1600.webp 1600w" sizes="(min-width: 1024px) 30vw, 100vw" width="1600" height="1066" alt="Farmhouse with a wraparound porch showing one side of the home" loading="lazy" decoding="async">
            <div class="tip-card__body"><span class="tip-card__num">3</span><h3>Each window or side of the home</h3><p>A photo per window, or one per side of the house, gives us the full picture.</p></div>
          </li>
        </ol>

        <!-- CLIENT CONTENT: replace with the client's exact wording for the framing / tempered-glass note.
             Mirrored in estimate.html (windows flow). Informational only — not a code determination. -->
        <aside class="info-note" data-reveal>
          <span class="info-note__icon"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.8v.2"/></svg></span>
          <div>
            <h3 class="info-note__title">About replacement framing &amp; tempered glass</h3>
            <p>All of our window replacements come complete with new framing. Any windows that are on 2nd floor landings, in bathrooms, or are 16&Prime; or less from the floor, will be tempered.</p>
          </div>
        </aside>
      </div>
    </section>

    <!-- ============ 7. ESTIMATE PROCESS ============ -->
    <section class="section section--navy process process--compact" aria-labelledby="w-process-title">
      <div class="container">
        <header class="section-head section-head--center" data-reveal>
          <h2 class="h2" id="w-process-title" data-word-reveal>How your windows <em class="text-accent">estimate works.</em></h2>
          <p>Five short steps, all from your phone or computer.</p>
        </header>
        <ol class="step-row" role="list" data-reveal="stagger">
          <li class="step-row__item"><span class="step-row__num">01</span><h3>Choose windows</h3><p>Start your estimate and select Replacement Windows.</p></li>
          <li class="step-row__item"><span class="step-row__num">02</span><h3>Share your details</h3><p>Your contact information and address.</p></li>
          <li class="step-row__item is-active"><span class="step-row__num">03</span><h3>Add photos</h3><p>Show us the windows you&rsquo;re thinking about replacing.</p></li>
          <li class="step-row__item"><span class="step-row__num">04</span><h3>Pick your style</h3><p>Same style or our pick, frame color and grids.</p></li>
          <li class="step-row__item"><span class="step-row__num">05</span><h3>Review &amp; submit</h3><p>Our team reviews it and follows up with next steps.</p></li>
        </ol>
        <div class="section-actions" data-reveal>
          <a class="btn btn--light btn--lg" href="<?php echo esc_url( dh_url( 'estimate', '?project=windows' ) ); ?>">Start Your Windows Estimate <svg class="icon btn__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
        </div>
      </div>
    </section>

    <!-- ============ 8. BEFORE / AFTER ============ -->
    <section class="section" aria-labelledby="w-ba-title">
      <div class="container">
        <header class="section-head section-head--center" data-reveal>
          <h2 class="h2" id="w-ba-title" data-word-reveal>See the difference <em class="text-accent">new windows make.</em></h2>
        </header>
        <figure class="compare" data-compare data-reveal>
          <div class="compare__stage" data-compare-stage>
            <img class="compare__img" src="<?php dh_assets(); ?>assets/images/windows/windows-living-room-light-1024.webp" srcset="<?php dh_assets(); ?>assets/images/windows/windows-living-room-light-640.webp 640w, <?php dh_assets(); ?>assets/images/windows/windows-living-room-light-800.webp 800w, <?php dh_assets(); ?>assets/images/windows/windows-living-room-light-1024.webp 1024w, <?php dh_assets(); ?>assets/images/windows/windows-living-room-light-1600.webp 1600w" sizes="(min-width: 1280px) 1200px, 100vw" width="1600" height="1066" alt="After: living room filled with light from large new windows" loading="lazy" decoding="async">
            <div class="compare__before" data-compare-before>
              <img class="compare__img" src="<?php dh_assets(); ?>assets/images/windows/windows-dated-window-seat-1024.webp" srcset="<?php dh_assets(); ?>assets/images/windows/windows-dated-window-seat-640.webp 640w, <?php dh_assets(); ?>assets/images/windows/windows-dated-window-seat-800.webp 800w, <?php dh_assets(); ?>assets/images/windows/windows-dated-window-seat-1024.webp 1024w, <?php dh_assets(); ?>assets/images/windows/windows-dated-window-seat-1600.webp 1600w" sizes="(min-width: 1280px) 1200px, 100vw" width="1600" height="1334" alt="Before: dim window seat with dated frames and heavy curtains" loading="lazy" decoding="async">
            </div>
            <span class="compare__label compare__label--before" aria-hidden="true">Before</span>
            <span class="compare__label compare__label--after" aria-hidden="true">After</span>
            <div class="compare__handle" data-compare-handle aria-hidden="true"><span class="compare__knob"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m9 7-5 5 5 5M15 7l5 5-5 5"/></svg></span></div>
          </div>
          <label class="visually-hidden" for="compare-range-w">Reveal before and after — windows</label>
          <input class="compare__range" id="compare-range-w" type="range" min="0" max="100" value="50" step="1" data-compare-range>
          <figcaption class="dev-note"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.8v.2"/></svg> <span>Representative imagery. Replace with matching before/after photos from real client projects.</span></figcaption>
        </figure>
      </div>
    </section>

    <!-- ============ 9. FAQ ============ -->
    <section class="section section--surface" aria-labelledby="w-faq-title">
      <div class="container container--narrow">
        <header class="section-head section-head--center" data-reveal>
          <h2 class="h2" id="w-faq-title" data-word-reveal>Window questions, <em class="text-accent">answered.</em></h2>
        </header>
        <div class="accordion accordion--card" data-accordion="single" data-reveal>
          <div class="accordion__item is-open">
            <h3 class="accordion__heading"><button class="accordion__trigger" type="button" id="wq1" aria-expanded="true" aria-controls="wa1" data-accordion-trigger><span>How many windows can I include?</span><span class="accordion__icon" aria-hidden="true"></span></button></h3>
            <div class="accordion__panel" id="wa1" role="region" aria-labelledby="wq1"><div class="accordion__inner"><p>As many as you&rsquo;re considering. Upload a photo of each window you&rsquo;d like to replace and we&rsquo;ll take it from there.</p></div></div>
          </div>
          <div class="accordion__item">
            <h3 class="accordion__heading"><button class="accordion__trigger" type="button" id="wq2" aria-expanded="false" aria-controls="wa2" data-accordion-trigger><span>Do I need exact measurements to get started?</span><span class="accordion__icon" aria-hidden="true"></span></button></h3>
            <div class="accordion__panel" id="wa2" role="region" aria-labelledby="wq2"><div class="accordion__inner"><p>No. A clear photo of each window is enough to start. If we need anything else, our team will let you know.</p></div></div>
          </div>
          <div class="accordion__item">
            <h3 class="accordion__heading"><button class="accordion__trigger" type="button" id="wq3" aria-expanded="false" aria-controls="wa3" data-accordion-trigger><span>What if I just want grids, not a pattern?</span><span class="accordion__icon" aria-hidden="true"></span></button></h3>
            <div class="accordion__panel" id="wa3" role="region" aria-labelledby="wq3"><div class="accordion__inner"><p>Choose &ldquo;Yes&rdquo; and we&rsquo;ll suggest a grid layout that suits your home. Or pick a diamond or colonial pattern.</p></div></div>
          </div>
          <div class="accordion__item">
            <h3 class="accordion__heading"><button class="accordion__trigger" type="button" id="wq4" aria-expanded="false" aria-controls="wa4" data-accordion-trigger><span>What if I&rsquo;m not sure about the color or style?</span><span class="accordion__icon" aria-hidden="true"></span></button></h3>
            <div class="accordion__panel" id="wa4" role="region" aria-labelledby="wq4"><div class="accordion__inner"><p>Choose &ldquo;You decide&rdquo; and we&rsquo;ll replace your windows with the best option for your home. We&rsquo;ll talk it through with you.</p></div></div>
          </div>
          <div class="accordion__item">
            <h3 class="accordion__heading"><button class="accordion__trigger" type="button" id="wq5" aria-expanded="false" aria-controls="wa5" data-accordion-trigger><span>Why might tempered glass be required?</span><span class="accordion__icon" aria-hidden="true"></span></button></h3>
            <div class="accordion__panel" id="wa5" role="region" aria-labelledby="wq5"><div class="accordion__inner"><p>Windows in certain locations — for example near doors, tubs or showers, stairways, or close to the floor — may require tempered safety glass. Our team reviews your project and will let you know if this applies.</p></div></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ 10. CTA ============ -->
    <section class="cta-banner" aria-labelledby="w-cta-title">
          <div class="cta-banner__media">
            <img class="cta-banner__img" src="<?php dh_assets(); ?>assets/images/windows/windows-bay-living-room-1024.webp" srcset="<?php dh_assets(); ?>assets/images/windows/windows-bay-living-room-640.webp 640w, <?php dh_assets(); ?>assets/images/windows/windows-bay-living-room-800.webp 800w, <?php dh_assets(); ?>assets/images/windows/windows-bay-living-room-1024.webp 1024w, <?php dh_assets(); ?>assets/images/windows/windows-bay-living-room-1600.webp 1600w" sizes="(orientation: portrait) and (max-width: 1023px) 130vh, (min-width: 1280px) 1200px, 100vw" width="1600" height="1066" alt="" loading="lazy" decoding="async">
          </div>
          <div class="container cta-banner__content" data-reveal>
            <h2 class="cta-banner__title" id="w-cta-title">Tell us about <em class="text-accent">your windows.</em></h2>
            <p class="cta-banner__text">Share a photo of each window and your style preferences. We&rsquo;ll review it and follow up with next steps.</p>
            <div class="cta-banner__actions">
              <a class="btn btn--primary btn--lg" href="<?php echo esc_url( dh_url( 'estimate', '?project=windows' ) ); ?>">Start Your Windows Estimate <span class="btn__icon"><svg class="icon btn__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></a>
              <a class="btn btn--outline-light btn--lg" href="<?php echo esc_url( dh_url( 'contact' ) ); ?>">Ask a Question</a>
            </div>
          </div>
    </section>
  </main>

  <?php get_footer(); ?>
