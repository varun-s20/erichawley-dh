/* =====================================================================
   install-D Home Remodeling — main.js
   ---------------------------------------------------------------------
   One script for every page. Each feature initialises only when its
   markup exists, so this file runs without errors on all pages.

    1. Site config / data          9. Image upload
    2. DOM helpers                10. Estimate state
    3. Navigation                 11. Estimate validation
    4. Scroll header              12. Estimate navigation
    5. Reveal animations          13. Review rendering
    6. Accordions                 14. Submission adapter
    7. Before/after slider        15. Utilities
    8. Testimonials & page        16. Initialization
       components
   ===================================================================== */

(function () {
  'use strict';

  document.documentElement.classList.add('js');

  /* ===================================================================
     1. SITE CONFIG / DATA
     =================================================================== */

  /**
   * Site-wide settings. A CMS (e.g. WordPress via wp_localize_script) can
   * override any key by defining window.SITE_CONFIG_OVERRIDES before this file.
   */
  const SITE_CONFIG = Object.assign(
    {
      brandName: 'install-D Home Remodeling',
      phone: '(910) 617-9122', // From the client's live site install-D.com (confirm before launch)
      email: '', // Add only when supplied by the client
      showDevNotes: false, // true shows the amber development notes that mark placeholder content
      hidePlaceholderSections: false, // true removes sections marked data-placeholder-section (e.g. sample reviews)
      draftStorageKey: 'installd:estimate-draft:v2',
      draftMaxAgeDays: 7,
      submissionEndpoint: '', // Estimate POST endpoint (multipart/form-data)
      contactEndpoint: '', // Contact form POST endpoint (JSON)
    },
    window.SITE_CONFIG_OVERRIDES || {}
  );

  /** Where estimates are POSTed. Empty = development mode: nothing is sent. */
  const SUBMISSION_ENDPOINT = SITE_CONFIG.submissionEndpoint || '';

  /** Where contact messages are POSTed. Empty = development mode. */
  const CONTACT_ENDPOINT = SITE_CONFIG.contactEndpoint || '';

  const UPLOAD_RULES = {
    maxFiles: 20,
    maxFileSizeMB: 15,
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    acceptedExtensions: ['jpg', 'jpeg', 'png', 'webp'],
  };

  const CONTACT_METHODS = {
    phone: 'Phone call',
    text: 'Text message',
    email: 'Email',
  };

  /**
   * Window frame colors from Erin's estimate script (5 Oct): one color per window,
   * shown inside and out on the Windows page visualizer. Hexes are on-screen
   * approximations — CONTENT TO CONFIRM with the client's samples.
   */
  const solidColor = (name, hex) => ({ id: name.toLowerCase().replace(/\s+/g, '-'), label: name, interior: { name, hex }, exterior: { name, hex } });
  const WINDOW_COLORS = [
    solidColor('White', '#F4F4F0'),
    solidColor('Tan', '#C7AD86'),
    solidColor('Black', '#1F2124'),
    solidColor('Burgundy', '#6B2430'),
    solidColor('Grey', '#8A8D90'),
    solidColor('Green', '#2F4B3A'),
    solidColor('Dark Brown', '#4A3428'),
  ];

  /** Grid patterns shown on the Windows page (her script: no grids, grids, diamond or colonial). Diagrams are drawn by windowSVG(). */
  const WINDOW_GRIDS = [
    { id: 'none', label: 'No Grids', description: 'Clear, uninterrupted glass for a clean look.' },
    { id: 'colonial', label: 'Colonial', description: 'A classic pattern of evenly divided panes.' },
    { id: 'diamond', label: 'Diamond', description: 'A diagonal pattern with a traditional feel.' },
  ];

  /* ---------------------------------------------------------------------
     BATH OPTIONS — CONTENT TO BE SUPPLIED BY THE CLIENT
     ---------------------------------------------------------------------
     Populate this array when the final bathroom products and photos are
     provided. The Bath Remodel page (#selections) and the estimator's
     "b-options" step both render from it automatically. While it is empty,
     the estimator skips that step and the Bath page shows a "coming soon"
     panel instead of broken UI.

     Schema:
       {
         id: 'shower-tub',                         // unique, URL-safe
         category: 'Shower & Tub',                 // group heading
         label: 'Which setup are you considering?',// question in the estimator
         description: 'Optional helper text.',
         image: 'assets/images/bath/….webp',       // optional category image
         options: [
           { id: 'option-id', label: 'Option name', description: 'Optional', image: 'assets/images/bath/….webp' }
         ]
       }

     Do NOT add invented product names, SKUs, brands, prices or warranty
     terms. A CMS may also inject data via window.SITE_BATH_OPTIONS.
     --------------------------------------------------------------------- */
  const bathOptions = Array.isArray(window.SITE_BATH_OPTIONS)
    ? window.SITE_BATH_OPTIONS
    : [
        // TODO(CLIENT CONTENT): add bathroom product categories here.
      ];

  /* ---------------------------------------------------------------------
     ESTIMATE FLOW — Erin's full estimate script (5 Oct 2026),
     client-chat/estimate-flow-2026-10-05.md. Wording is hers; only
     capitalisation and punctuation are polished.

     Pure data: WordPress can replace it with window.SITE_ESTIMATE_PRODUCTS
     and the estimator, summary, review, email payload and drafts follow.

     Product:  { id, label, card: { text, image }, pages: [...] }
     Page:     { id, title, kicker?, desc?, review?, intro?: { icon, title, text },
                 photos?: { tips?: [...] }, titleQuestion?: true, when?, questions: [...] }
               One page = one "HIT NEXT" screen in her script.
     Question: { id, label, type: 'single'|'multi'|'text'|'textarea'|'note',
                 layout?: 'list'|'cards'|'swatches', required?, hint?, review?,
                 showIf?, provisional?, options?: [{ id, label, image?, swatch?, icon? }] }
     when / showIf: { q: 'questionId', in: ['answer', …] }, or an array of them (all must hold).
               A question also hides whenever the question it depends on is hidden.

     IMAGES: Erin is sending her own option photos (Google Photos). Until then
     options use representative stock photos, CSS swatches or numbered
     placeholders ("Style 1"), flagged `provisional`. Never invent brands,
     product names, SKUs or prices.
     --------------------------------------------------------------------- */
  const IMG = (base) => `assets/images/bath/${base}-640.webp`;
  const PHOTO = (dir, base) => `assets/images/${dir}/${base}-640.webp`;
  /** Erin's own option photos (Google Photos albums, 3 Oct 2026), saved in assets/images/estimate/. */
  const EST = (name) => `assets/images/estimate/${name}.webp`;
  const countTo = (n) => Array.from({ length: n }, (_, i) => i + 1);
  const twoDigits = (n) => String(n).padStart(2, '0');

  // Her "Fixture color choices" album (the gold swatch is labelled "Brushed Gold"; her script says "Gold").
  const FIXTURE_FINISHES = [
    { id: 'chrome', label: 'Chrome', image: EST('fixture-chrome') },
    { id: 'brushed-nickel', label: 'Brushed nickel', image: EST('fixture-brushed-nickel') },
    { id: 'matte-black', label: 'Matte black', image: EST('fixture-matte-black') },
    { id: 'gold', label: 'Gold', image: EST('fixture-gold') },
    { id: 'oil-rubbed-bronze', label: 'Oil rubbed bronze', image: EST('fixture-oil-rubbed-bronze') },
  ];

  // Her "Bathroom - Basic Colors" album. The photo she uses for "Sandstone" is labelled "Sandbar" — confirm the name.
  const BASIC_WALL_COLORS = [
    { id: 'white', label: 'White', image: EST('color-white') },
    { id: 'almond', label: 'Almond', image: EST('color-almond') },
    { id: 'grey', label: 'Grey', image: EST('color-grey') },
    { id: 'sandstone', label: 'Sandstone', image: EST('color-sandstone') },
  ];

  // Her "Bathroom Designs - marbles" album: 13 photos with no names on them. Her script names 10 marbles
  // (Versailles, Carbon Ash, Santorini White, Tuscany, Arctic Ice, Basket Weave, Canyon Rock, Napoli Marble,
  // Sandalwood, Horizon Beige) — numbered in album order until she says which photo is which.
  const MARBLES = countTo(13).map((n) => ({ id: `marble-${n}`, label: `Marble ${n}`, image: EST(`marble-${twoDigits(n)}`) }));

  // Her "Bathroom tile" album: 9 patterns, unnamed. Her script names 6 (Cobblestone, Panorama, Hopscotch,
  // Roman Block, Herringbone, Hexagon) — numbered in album order until she matches names to photos.
  const TILE_DESIGNS = countTo(9).map((n) => ({ id: `tile-${n}`, label: `Tile ${n}`, image: EST(`tile-${twoDigits(n)}`) }));

  /* Numbered placeholders until Erin's photos arrive ("Style 1", "Color 1"…) */
  const numbered = (prefix, label, swatches) => swatches.map((swatch, i) => ({ id: `${prefix}-${i + 1}`, label: `${label} ${i + 1}`, swatch }));
  const PLACEHOLDER_COLORS = ['#F2F0EB', '#D9D3C7', '#B7AE9E', '#8C9A8E', '#6E7F92', '#4A5563', '#7A5A45', '#2F3237'];
  const SIDING_PATTERNS = [
    'repeating-linear-gradient(0deg,#e9e6df 0 11px,#cfcac0 11px 12px)',
    'repeating-linear-gradient(0deg,#e9e6df 0 7px,#d8d3c9 7px 13px,#cfcac0 13px 14px)',
    'repeating-linear-gradient(90deg,#e9e6df 0 16px,#cfcac0 16px 19px)',
    'radial-gradient(circle at 50% 0,#e9e6df 0 6px,#cfcac0 6px 7px,transparent 7px) 0 0/12px 10px,#e9e6df',
    'repeating-linear-gradient(90deg,#e9e6df 0 9px,#cfcac0 9px 10px)',
    'repeating-linear-gradient(0deg,#e9e6df 0 17px,#cfcac0 17px 18px)',
  ];
  const DOOR_PATTERNS = [
    'linear-gradient(#e9e6df,#e9e6df) 22% 18%/56% 26% no-repeat,linear-gradient(#e9e6df,#e9e6df) 22% 78%/56% 34% no-repeat,#cfcac0',
    'linear-gradient(#bcd3df,#bcd3df) 50% 22%/56% 40% no-repeat,#cfcac0',
    'repeating-linear-gradient(0deg,#cfcac0 0 12px,#bdb7ab 12px 13px)',
    'linear-gradient(#bcd3df,#bcd3df) 50% 50%/16% 70% no-repeat,#cfcac0',
    'linear-gradient(#e9e6df,#e9e6df) 30% 50%/22% 76% no-repeat,linear-gradient(#e9e6df,#e9e6df) 70% 50%/22% 76% no-repeat,#cfcac0',
    'radial-gradient(ellipse at 50% 20%,#bcd3df 0 30%,transparent 31%),#cfcac0',
  ];
  const SHINGLE_COLORS = ['#3C3D3F', '#5B5550', '#6E6458', '#4D5A61', '#7A6A58', '#2B2B2C'];

  /** Wall design questions shared by the standard tub and the walk-in shower. */
  function wallQuestions(prefix, showIf) {
    const on = (value) => ({ q: `${prefix}Wall`, in: [value] });
    return [
      { id: `${prefix}Wall`, label: 'Choose a wall design.', review: 'Wall design', type: 'single', layout: 'list', required: true, showIf, options: [
        { id: 'basic', label: 'Basic colors' },
        { id: 'marble', label: 'Marbles' },
        { id: 'tile', label: 'Tile designs' },
      ] },
      { id: `${prefix}Basic`, label: 'Choose a color.', review: 'Wall color', type: 'single', layout: 'swatches', required: true, showIf: on('basic'), options: BASIC_WALL_COLORS },
      { id: `${prefix}Marble`, label: 'Choose a marble design.', review: 'Marble', type: 'single', layout: 'swatches', required: true, provisional: true, showIf: on('marble'), options: MARBLES },
      { id: `${prefix}Tile`, label: 'Choose a tile design style.', review: 'Tile style', type: 'single', layout: 'swatches', required: true, provisional: true, showIf: on('tile'), options: TILE_DESIGNS },
      { id: `${prefix}Grout`, label: 'Black or grey laser etched grout?', review: 'Grout', type: 'single', layout: 'list', required: true, showIf: on('tile'), options: [
        { id: 'black', label: 'Black' },
        { id: 'grey', label: 'Grey' },
      ] },
      { id: `${prefix}TileMarble`, label: 'If you would like to add a marble color to your tile design, enter the name here:', review: 'Marble color for tile', type: 'text', showIf: on('tile') },
    ];
  }

  const YES_NO = [
    { id: 'yes', label: 'Yes' },
    { id: 'no', label: 'No' },
  ];

  const DESIGNING = { q: 'design', in: ['me'] };
  const WET_TUB = ['tub-to-tub', 'tub-and-shower'];
  // Her script sends the two walk-in options to the shower questions, and "tub + shower"
  // and "remove your current shower" through them too. "Replace your shower with a new
  // shower" isn't assigned in the script; it uses the shower questions (confirm with Erin).
  const WET_SHOWER = ['tub-to-walkin', 'both-to-walkin', 'shower-to-shower', 'tub-to-walkin-remove', 'tub-and-shower'];

  const DEFAULT_ESTIMATE_PRODUCTS = [
    /* ================= BATHROOM ================= */
    {
      id: 'bath',
      label: 'Bathroom',
      card: { text: 'Tub, shower, vanity, flooring & toilet', image: PHOTO('bath', 'bath-glass-shower') },
      pages: [
        {
          id: 'b-photos',
          title: 'All we need are a few photos.',
          desc: 'Please upload 4–5 photos of your bathroom.',
          intro: { icon: 'drop', title: 'Great! You’re looking to renovate your bathroom.', text: 'Water is the most damaging thing to a home. Replacing old plumbing and keeping your bathroom up to date is a smart decision!' },
          photos: { tips: [['eye', 'Shoot from the doorway to capture the whole room'], ['camera', 'Add close-ups of the tub, shower or vanity'], ['sun', 'Turn the lights on for clearer photos']] },
          questions: [],
        },
        {
          id: 'b-focus',
          titleQuestion: true,
          review: 'Bathroom plan',
          questions: [
            { id: 'focus', label: 'Choose which items you would like to focus on.', review: 'Focus on', hint: 'Choose all that apply.', type: 'multi', layout: 'list', required: true, options: [
              { id: 'shower', label: 'Bathtub or shower', icon: 'shower' },
              { id: 'vanity', label: 'Vanity', icon: 'vanity' },
              { id: 'flooring', label: 'Flooring', icon: 'floor' },
              { id: 'toilet', label: 'Toilet', icon: 'toilet' },
              // Her script says "Customer glass"; her album and message say "Custom Glass" (framed, rollers, frameless).
              { id: 'glass', label: 'Custom glass', icon: 'window' },
            ] },
          ],
        },
        {
          id: 'b-design',
          titleQuestion: true,
          review: 'Bathroom plan',
          questions: [
            { id: 'design', label: 'Would you like to design your bathroom yourself or would you like us to design it for you?', review: 'Design', type: 'single', layout: 'list', required: true, options: [
              { id: 'me', label: 'Let me design it', icon: 'palette' },
              { id: 'you', label: 'You do it for me', icon: 'sparkle' },
            ] },
          ],
        },
        {
          id: 'b-tub',
          kicker: 'Bathtub or shower',
          title: 'Bathtub or shower',
          when: [{ q: 'focus', in: ['shower'] }, DESIGNING],
          questions: [
            { id: 'wet', label: 'What would you like to do to the wet spaces in your bathroom?', review: 'Wet spaces', type: 'single', layout: 'list', required: true, options: [
              { id: 'tub-to-tub', label: 'Replace your tub with a new tub' },
              { id: 'tub-to-walkin', label: 'Replace your tub with a new walk-in shower' },
              { id: 'both-to-walkin', label: 'Replace your tub and shower with one big walk-in shower' },
              { id: 'shower-to-shower', label: 'Replace your shower with a new shower' },
              { id: 'tub-to-walkin-remove', label: 'Replace your tub with a walk-in shower and remove your current shower' },
              { id: 'tub-and-shower', label: 'Replace your tub with a new tub and replace your shower with a new shower' },
            ] },
            { id: 'tubType', label: 'What would you like to replace your tub with?', review: 'New tub', type: 'single', layout: 'cards', required: true, showIf: { q: 'wet', in: WET_TUB }, options: [
              { id: 'standard', label: 'A standard tub', image: EST('tub-standard') },
              { id: 'freestanding', label: 'A freestanding tub', image: EST('tub-freestanding') },
            ] },
            /* A. Standard tub */
            { id: 'tubHeight', label: 'Choose a height for your tub.', review: 'Tub height', type: 'single', layout: 'list', required: true, showIf: { q: 'tubType', in: ['standard'] }, options: [
              { id: '13', label: '13″' },
              { id: '15', label: '15″' },
              { id: '19', label: '19″' },
            ] },
            { id: 'tubColor', label: 'Choose a color for your tub.', review: 'Tub color', type: 'single', layout: 'swatches', required: true, showIf: { q: 'tubType', in: ['standard'] }, options: [
              { id: 'white', label: 'White', image: EST('color-white') },
              { id: 'grey', label: 'Grey', image: EST('color-grey') },
              { id: 'almond', label: 'Almond', image: EST('color-almond') },
            ] },
            { id: 'tubDoors', label: 'Glass doors or curved curtain rod?', review: 'Doors', type: 'single', layout: 'cards', required: true, showIf: { q: 'tubType', in: ['standard'] }, options: [
              { id: 'glass', label: 'Glass doors', image: EST('doors-glass-tub') },
              { id: 'curtain', label: 'Curved curtain rod', image: EST('doors-curtain-rod') },
            ] },
            { id: 'tubFixtures', label: 'What color for your fixtures?', review: 'Fixture color', type: 'single', layout: 'swatches', required: true, showIf: { q: 'tubType', in: ['standard'] }, options: FIXTURE_FINISHES },
            { id: 'tubAddons', label: 'Need anything else in your tub?', hint: 'Your tub will come with a standard shower head, valve and faucet, 2 corner shelves and 1 – 18″ grab bar. Choose all that apply.', review: 'Tub extras', type: 'multi', layout: 'cards', fit: 'contain', showIf: { q: 'tubType', in: ['standard'] }, options: [
              { id: 'handheld', label: 'Handheld shower head', image: EST('showerhead-slide-bar') },
              { id: 'rain-handheld', label: 'Rain shower with a handheld', image: EST('showerhead-rain-handheld') },
              { id: 'corner-shelves', label: '2 more corner shelves', image: EST('addon-corner-shelf') },
              { id: 'soap-dish', label: 'Soap dish', image: EST('addon-soap-dish') },
              { id: 'niche', label: 'A niche shelf', image: EST('addon-niche') },
              { id: 'grab-12', label: 'A 12″ grab bar', image: EST('addon-grab-bar') },
              { id: 'grab-24', label: 'A 24″ grab bar', image: EST('addon-grab-bar') },
            ] },
            ...wallQuestions('tub', { q: 'tubType', in: ['standard'] }),
            /* B. Freestanding tub */
            // Her "Bathtubs" album has an oval and a clawfoot photo, but no square tub.
            { id: 'freeShape', label: 'Would you like an oval tub, a square tub or a clawfoot tub?', review: 'Tub shape', type: 'single', layout: 'cards', required: true, showIf: { q: 'tubType', in: ['freestanding'] }, options: [
              { id: 'oval', label: 'Oval', image: EST('tub-freestanding') },
              { id: 'square', label: 'Square', swatch: 'linear-gradient(#ffffff,#ffffff) 50% 58%/46% 34% no-repeat,linear-gradient(#e3e6ea,#e3e6ea) 50% 61%/50% 40% no-repeat,#f3f5f8', provisional: true },
              { id: 'clawfoot', label: 'Clawfoot', image: EST('tub-clawfoot') },
            ] },
            { id: 'freeFixtures', label: 'Choose a color for your fixtures.', review: 'Fixture color', type: 'single', layout: 'swatches', required: true, showIf: { q: 'tubType', in: ['freestanding'] }, options: FIXTURE_FINISHES },
          ],
        },
        {
          id: 'b-shower',
          kicker: 'Walk-in shower',
          title: 'Walk-in shower',
          when: [{ q: 'focus', in: ['shower'] }, DESIGNING, { q: 'wet', in: WET_SHOWER }],
          questions: [
            // Her "Shower threshold heights" album (3 unlabelled photos — matched by how high the curb looks; confirm).
            { id: 'pan', label: 'Choose the height of your shower pan.', review: 'Shower pan', type: 'single', layout: 'cards', required: true, options: [
              { id: 'low', label: 'Low profile: 1″ with ramp', image: EST('pan-low') },
              { id: 'standard', label: 'Standard: 4″', image: EST('pan-standard') },
              { id: 'double', label: 'Double threshold: 8″', image: EST('pan-double') },
            ] },
            { id: 'showerDoors', label: 'Glass doors or curtain rod?', review: 'Doors', type: 'single', layout: 'cards', required: true, options: [
              { id: 'glass', label: 'Glass doors', image: EST('doors-glass-shower') },
              { id: 'curtain', label: 'Curtain rod', image: EST('doors-curtain-rod') },
            ] },
            { id: 'showerFixtures', label: 'What color for your fixtures?', review: 'Fixture color', type: 'single', layout: 'swatches', required: true, options: FIXTURE_FINISHES },
            // Photos from her "Showerheads" and "Bathroom options" albums. "A foot pedestal" uses her shaving bar photo (confirm).
            { id: 'showerAddons', label: 'Need anything else in your shower?', hint: 'Your shower will come with a standard shower head and valve, 2 corner shelves and 1 – 18″ grab bar. Choose all that apply.', review: 'Shower extras', type: 'multi', layout: 'cards', fit: 'contain', options: [
              { id: 'handheld', label: 'Handheld showerhead', image: EST('showerhead-slide-bar') },
              { id: 'rain-handheld', label: 'Rain shower with a handheld', image: EST('showerhead-rain-handheld') },
              { id: 'slide-bar', label: 'Slide bar with handheld plus standard shower head', image: EST('showerhead-slide-bar') },
              { id: 'rain-standard', label: 'A rain shower head plus a standard shower head', image: EST('showerhead-rain') },
              { id: 'corner-shelves', label: '2 more corner shelves', image: EST('addon-corner-shelf') },
              { id: 'soap-dish', label: 'Soap dish', image: EST('addon-soap-dish') },
              { id: 'niche', label: 'A niche shelf', image: EST('addon-niche') },
              { id: 'teak-seat', label: 'A teak seat', image: EST('addon-teak-seat') },
              { id: 'bench-seat', label: 'A bench seat', image: EST('addon-bench-seat') },
              { id: 'corner-seat', label: 'A corner seat', image: EST('addon-corner-seat') },
              { id: 'foot-pedestal', label: 'A foot pedestal', image: EST('addon-shaving-bar') },
              { id: 'grab-12', label: 'A 12″ grab bar', image: EST('addon-grab-bar') },
              { id: 'grab-24', label: 'A 24″ grab bar', image: EST('addon-grab-bar') },
              { id: 'grab-valve', label: 'A grab bar around the valve', image: EST('addon-valve-grab-bar') },
            ] },
            ...wallQuestions('shower'),
          ],
        },
        {
          id: 'b-removal',
          kicker: 'Shower removal',
          title: 'Shower removal',
          when: [{ q: 'focus', in: ['shower'] }, DESIGNING, { q: 'wet', in: ['tub-to-walkin-remove'] }],
          questions: [
            { id: 'removalNote', type: 'note', label: 'Once we remove your current shower, we will cap the plumbing and drywall the area – preparing it for painting.' },
            { id: 'removalFinish', label: 'Would you like us to leave it ready for painting or something else?', review: 'After removal', type: 'single', layout: 'list', required: true, options: [
              { id: 'drywall', label: 'Finished drywall' },
              { id: 'drywall-shelves', label: 'Finished drywall and put up floating shelves' },
              { id: 'linen-closet', label: 'Add a linen closet to that area' },
            ] },
          ],
        },
        {
          id: 'b-vanity',
          kicker: 'Vanity',
          title: 'Vanity',
          when: [{ q: 'focus', in: ['vanity'] }, DESIGNING],
          questions: [
            { id: 'vanitySupply', label: 'Would you like us to supply the vanity or would you like to buy your own vanity and have us install it?', review: 'Vanity', type: 'single', layout: 'list', required: true, options: [
              { id: 'us', label: 'I want you to supply the vanity' },
              { id: 'own', label: 'I will supply the vanity myself but I will need you to install it' },
            ] },
            /* A. We supply it */
            { id: 'vanityType', label: 'Would you like a single vanity or a double?', review: 'Single or double', type: 'single', layout: 'list', required: true, showIf: { q: 'vanitySupply', in: ['us'] }, options: [
              { id: 'single', label: 'Single' },
              { id: 'double', label: 'Double' },
            ] },
            // Her "VANITY OPTIONS" album (20 photos, numbered like the old tool's "Vanity 1–20").
            { id: 'vanityDesign', label: 'Choose a design you like:', review: 'Vanity design', type: 'single', layout: 'cards', required: true, showIf: { q: 'vanitySupply', in: ['us'] }, options: countTo(20).map((n) => ({ id: `vanity-${n}`, label: `Vanity ${n}`, image: EST(`vanity-${twoDigits(n)}`) })) },
            { id: 'vanitySize', label: 'Don’t worry, we will match your vanity size to your current vanity. Is that okay? Or would you like to change the size of your vanity?', review: 'Vanity size', type: 'single', layout: 'list', required: true, showIf: { q: 'vanitySupply', in: ['us'] }, options: [
              { id: 'same', label: 'That’s great!' },
              { id: 'bigger', label: 'I want a bigger vanity than the one I have now' },
              { id: 'smaller', label: 'I want a smaller vanity than the one I have now' },
            ] },
            { id: 'faucetNote', type: 'note', label: 'We will match your vanity faucets with the color of your shower faucets.', showIf: { q: 'vanitySupply', in: ['us'] } },
            { id: 'faucet', label: 'Choose a faucet style.', review: 'Faucet style', type: 'single', layout: 'swatches', required: true, provisional: true, showIf: { q: 'vanitySupply', in: ['us'] }, options: numbered('faucet', 'Faucet', ['#E4E6E8', '#D2D5D8', '#C4C8CC', '#B6BBC0', '#A9AEB4', '#9CA2A8']) },
            /* B. They supply it */
            { id: 'bowls', label: 'Are you going from a single bowl vanity to a double bowl vanity?', review: 'Bowls', type: 'single', layout: 'list', required: true, showIf: { q: 'vanitySupply', in: ['own'] }, options: [
              { id: 'yes', label: 'Yes' },
              { id: 'no', label: 'No. I’m keeping the same amount of bowls.' },
            ] },
          ],
        },
        {
          id: 'b-floor',
          kicker: 'Flooring',
          title: 'Flooring',
          desc: 'We offer luxury vinyl plank and luxury vinyl tile. This is the best product for any bathroom space due to its durability, softness to the feet, and waterproofing capabilities.',
          when: [{ q: 'focus', in: ['flooring'] }, DESIGNING],
          questions: [
            // Her "FLOORING OPTIONS" album (22 photos, numbered like the old tool's "Style 1–22").
            { id: 'floor', label: 'Choose a design:', review: 'Flooring design', type: 'single', layout: 'swatches', required: true, options: countTo(22).map((n) => ({ id: `style-${n}`, label: `Style ${n}`, image: EST(`floor-${twoDigits(n)}`) })) },
          ],
        },
        {
          id: 'b-toilet',
          kicker: 'Toilet',
          title: 'Toilet',
          when: [{ q: 'focus', in: ['toilet'] }, DESIGNING],
          questions: [
            { id: 'toiletSupply', label: 'Would you like us to supply the toilet or will you be supplying the toilet and need us to install it?', review: 'Toilet', type: 'single', layout: 'list', required: true, options: [
              { id: 'us', label: 'You supply the toilet' },
              { id: 'own', label: 'I will supply the toilet but I’ll need you to install it' },
            ] },
            { id: 'toiletColor', label: 'Choose a color for your toilet.', review: 'Toilet color', type: 'single', layout: 'swatches', required: true, showIf: { q: 'toiletSupply', in: ['us'] }, options: [
              { id: 'white', label: 'White', swatch: '#FFFFFF' },
              { id: 'black', label: 'Black', swatch: '#161619' },
              { id: 'almond', label: 'Almond', swatch: '#EFE3C8' },
            ] },
            { id: 'toiletStyle', label: 'Choose a style.', review: 'Toilet style', type: 'single', layout: 'list', required: true, showIf: { q: 'toiletSupply', in: ['us'] }, options: [
              { id: 'standard', label: 'Standard' },
              { id: 'comfort', label: 'Comfort height – a bit taller. Helps your knees…' },
              { id: 'bidet', label: 'A fancy toilet and bidet combo. Very modern. Very mindful. Very demure.' },
            ] },
            { id: 'toiletOwnType', label: 'Is this a standard toilet or a toilet/bidet that needs electricity?', review: 'Toilet type', type: 'single', layout: 'list', required: true, showIf: { q: 'toiletSupply', in: ['own'] }, options: [
              { id: 'standard', label: 'Standard' },
              { id: 'electric', label: 'Needs electricity' },
            ] },
          ],
        },
        {
          // Her 3 Oct message: "For the CUSTOMER GLASS option: Framed, Rollers, Frameless Glass" (+ her "Custom Glass" album).
          id: 'b-glass',
          kicker: 'Custom glass',
          title: 'Custom glass',
          when: [{ q: 'focus', in: ['glass'] }, DESIGNING],
          questions: [
            { id: 'glassStyle', label: 'Choose a glass style.', review: 'Glass style', type: 'single', layout: 'cards', required: true, options: [
              { id: 'framed', label: 'Framed', image: EST('glass-framed') },
              { id: 'rollers', label: 'Rollers', image: EST('glass-rollers') },
              { id: 'frameless', label: 'Frameless glass', image: EST('glass-frameless') },
            ] },
          ],
        },
        {
          // "You do it for me" skips straight here (every design page above needs "Let me design it").
          id: 'b-details',
          title: 'You did it!',
          review: 'Bathroom — anything else',
          questions: [
            { id: 'extras', label: 'Is there anything else you would like to add to your estimate?', review: 'Also add', hint: 'Choose all that apply.', type: 'multi', layout: 'list', options: [
              { id: 'wainscot', label: 'Remove tile wainscotting around the walls' },
              { id: 'mirror', label: 'Remove the vanity mirror' },
              { id: 'ceiling-light', label: 'Add a ceiling light with exhaust' },
              { id: 'vanity-lights', label: 'Replace vanity lights' },
            ] },
            { id: 'bathMore', label: 'More details', review: 'More details', type: 'textarea' },
          ],
        },
      ],
    },

    /* ================= WINDOWS ================= */
    {
      id: 'windows',
      label: 'Windows',
      card: { text: 'Style, color & grids', image: PHOTO('windows', 'windows-double-hung-grids') },
      pages: [
        {
          id: 'w-photos',
          title: 'Please upload a photo of each window you want to replace.',
          // "Up to 60%" is the client's own claim — confirm she can substantiate it before launch.
          intro: { icon: 'sun', title: 'It looks like you want to replace your windows. Great idea!', text: 'Energy efficient windows pay for themselves. You can save up to 60% on your energy bill just by replacing your windows.' },
          photos: { tips: [['eye', 'Stand back so the whole window is in frame'], ['sun', 'Daylight photos work best'], ['home', 'Inside or outside views both help']] },
          questions: [],
        },
        {
          id: 'w-design',
          kicker: 'Windows',
          title: 'Window design',
          questions: [
            { id: 'windowStyle', label: 'Would you like to replace your windows with the style you currently have or would you like us to replace your windows with the best option?', review: 'Style', type: 'single', layout: 'list', required: true, options: [
              { id: 'same', label: 'Replace with the same style I have' },
              { id: 'you-decide', label: 'You decide' },
            ] },
            { id: 'windowColor', label: 'Choose a color for your windows.', review: 'Color', type: 'single', layout: 'swatches', required: true, options: [] /* filled from WINDOW_COLORS below */ },
            { id: 'windowGrids', label: 'Would you like grids in your windows?', review: 'Grids', type: 'single', layout: 'list', required: true, options: [
              { id: 'no', label: 'No' },
              { id: 'yes', label: 'Yes' },
              { id: 'diamond', label: 'I want diamond pattern grids' },
              { id: 'colonial', label: 'I want colonial pattern grids' },
            ] },
            { id: 'windowNote', type: 'note', label: 'All of our window installs come with re-framing, new sills and casing. Any windows on 2nd floor landings, in bathrooms, and/or are less than 16″ from the floor will be tempered.', more: 'Any bathroom windows will be tempered and obscure.' },
          ],
        },
      ],
    },

    /* ================= SIDING ================= */
    {
      id: 'siding',
      label: 'Siding',
      card: { text: 'Style, color, trim & gutters', image: PHOTO('projects', 'exterior-farmhouse-porch') },
      pages: [
        {
          id: 's-photos',
          title: 'We will need you to upload 8 photos for your siding estimate.',
          desc: 'Front, back, left side, right side, and all 4 corners.',
          intro: { icon: 'home', title: 'Awesome choice! Looks like you want new siding.', text: 'Replacing your old siding will reduce your energy costs and protect your home from bad weather. It also adds to your curb appeal and has a great return on investment!' },
          photos: {},
          questions: [],
        },
        {
          id: 's-first',
          kicker: 'Siding',
          title: '1st floor siding',
          questions: [
            { id: 'siding1Style', label: 'Choose a style for your siding on the 1st floor of your home.', review: '1st floor style', type: 'single', layout: 'swatches', required: true, provisional: true, options: numbered('style', 'Style', SIDING_PATTERNS) },
            { id: 'siding1Color', label: 'Choose a color.', review: '1st floor color', type: 'single', layout: 'swatches', required: true, provisional: true, options: numbered('color', 'Color', PLACEHOLDER_COLORS) },
          ],
        },
        {
          id: 's-second',
          kicker: 'Siding',
          title: '2nd floor siding',
          questions: [
            { id: 'siding2Style', label: 'Choose a style for your siding on the 2nd floor of your home.', hint: 'If your home is only 1 story, choose the same siding design.', review: '2nd floor style', type: 'single', layout: 'swatches', required: true, provisional: true, options: numbered('style', 'Style', SIDING_PATTERNS) },
            { id: 'siding2Color', label: 'Choose a color.', review: '2nd floor color', type: 'single', layout: 'swatches', required: true, provisional: true, options: numbered('color', 'Color', PLACEHOLDER_COLORS) },
          ],
        },
        {
          id: 's-trim',
          kicker: 'Siding',
          title: 'Trim & gutters',
          questions: [
            { id: 'trimColor', label: 'Choose a color for your trim, soffits, and fascia.', review: 'Trim, soffits & fascia', type: 'single', layout: 'list', required: true, options: [
              { id: 'white', label: 'White' },
              { id: 'black', label: 'Black' },
              { id: 'bone', label: 'Bone' },
              { id: 'match', label: 'Match your siding' },
            ] },
            { id: 'sidingGutters', label: 'Would you like to add new gutters?', review: 'New gutters', type: 'single', layout: 'list', required: true, options: YES_NO },
          ],
        },
      ],
    },

    /* ================= DOORS ================= */
    {
      id: 'doors',
      label: 'Doors',
      card: { text: 'Entry, sliding & patio doors', image: PHOTO('projects', 'exterior-white-cottage') },
      pages: [
        {
          id: 'd-photos',
          title: 'Upload a photo of each door you want replaced.',
          intro: { icon: 'door', title: 'Good choice!', text: 'Doors are there to protect you and your family from intruders and the elements. Replacing your old doors with new, secure doors will give you the thing you want the most when it comes to protecting your family – peace of mind.' },
          photos: {},
          questions: [],
        },
        {
          id: 'd-design',
          kicker: 'Doors',
          title: 'Door design',
          questions: [
            { id: 'entryDoor', label: 'Do you want to replace an entry door?', review: 'Entry door', type: 'single', layout: 'list', required: true, options: YES_NO },
            /* Yes: entry door */
            { id: 'doorMaterial', label: 'Do you want a steel door or a fiberglass door?', review: 'Material', type: 'single', layout: 'list', required: true, showIf: { q: 'entryDoor', in: ['yes'] }, options: [
              { id: 'steel', label: 'Steel' },
              { id: 'fiberglass', label: 'Fiberglass' },
            ] },
            { id: 'doorStyle', label: 'Choose a door style.', review: 'Door style', type: 'single', layout: 'swatches', required: true, provisional: true, showIf: { q: 'entryDoor', in: ['yes'] }, options: numbered('style', 'Style', DOOR_PATTERNS) },
            { id: 'doorColor', label: 'Choose a door color.', review: 'Door color', type: 'single', layout: 'swatches', required: true, provisional: true, showIf: { q: 'entryDoor', in: ['yes'] }, options: numbered('color', 'Color', PLACEHOLDER_COLORS.slice(0, 6)) },
            { id: 'doorHandset', label: 'Choose a handset.', review: 'Handset', type: 'single', layout: 'swatches', required: true, provisional: true, showIf: { q: 'entryDoor', in: ['yes'] }, options: numbered('handset', 'Handset', FIXTURE_FINISHES.slice(0, 4).map((f) => f.swatch)) },
            { id: 'doorExtras', label: 'Choose any extra features you would like on your door.', hint: 'Choose all that apply.', review: 'Extra features', type: 'multi', layout: 'list', showIf: { q: 'entryDoor', in: ['yes'] }, options: [
              { id: 'peephole', label: 'Peephole' },
              { id: 'knocker', label: 'Knocker with peephole' },
              { id: 'mail-slot', label: 'Mail slot' },
              { id: 'doggie-door', label: 'Doggie door' },
            ] },
            /* No: sliding or patio */
            { id: 'patioDoor', label: 'Are you looking for a sliding glass door or a patio door?', review: 'Sliding or patio', type: 'single', layout: 'list', required: true, showIf: { q: 'entryDoor', in: ['no'] }, options: [
              { id: 'sliding', label: 'Sliding glass door' },
              { id: 'french', label: 'Patio French doors' },
              { id: 'neither', label: 'Neither' },
            ] },
            { id: 'patioColor', label: 'Choose a color.', review: 'Color', type: 'single', layout: 'swatches', required: true, showIf: { q: 'patioDoor', in: ['sliding', 'french'] }, options: [
              { id: 'white', label: 'White', swatch: '#FFFFFF' },
              { id: 'black', label: 'Black', swatch: '#1F2124' },
              { id: 'tan', label: 'Tan', swatch: '#C7AD86' },
            ] },
            { id: 'patioMore', label: 'Is there anything else you would like to add?', review: 'Anything else', type: 'textarea', showIf: { q: 'patioDoor', in: ['sliding', 'french'] } },
            { id: 'doorOther', label: 'Tell us what you are looking for.', review: 'Looking for', type: 'textarea', required: true, showIf: { q: 'patioDoor', in: ['neither'] } },
          ],
        },
      ],
    },

    /* ================= ROOFING ================= */
    {
      id: 'roofing',
      label: 'Roofing',
      card: { text: 'Shingle or metal & gutters', image: PHOTO('projects', 'exterior-cottage-grids') },
      pages: [
        {
          id: 'r-photos',
          title: 'Please upload 4–6 photos of the outside of your home and roof.',
          intro: { icon: 'roof', title: 'Need a new roof? We got you!', text: 'Your roof protects everything and everyone in your home, so it’s important that your roof stays in good condition and is qualified to handle the weather in your area!' },
          photos: {},
          questions: [],
        },
        {
          id: 'r-design',
          kicker: 'Roofing',
          title: 'Roof design',
          questions: [
            { id: 'roofType', label: 'Would you like a shingled roof or a metal roof?', review: 'Roof type', type: 'single', layout: 'list', required: true, options: [
              { id: 'shingle', label: 'Shingle' },
              { id: 'metal', label: 'Metal' },
            ] },
            { id: 'shingleColor', label: 'We only use the best in roofing shingles, GAF. Choose a color.', review: 'Shingle color', type: 'single', layout: 'swatches', required: true, provisional: true, showIf: { q: 'roofType', in: ['shingle'] }, options: numbered('color', 'Color', SHINGLE_COLORS) },
            { id: 'shingleGutters', label: 'Would you like to add new gutters? We highly suggest it when replacing a roof.', review: 'New gutters', type: 'single', layout: 'list', required: true, showIf: { q: 'roofType', in: ['shingle'] }, options: YES_NO },
            { id: 'metalColor', label: 'Choose a color.', review: 'Metal color', type: 'single', layout: 'swatches', required: true, showIf: { q: 'roofType', in: ['metal'] }, options: [
              { id: 'black', label: 'Black', swatch: '#232427' },
              { id: 'green', label: 'Green', swatch: '#2F4B3A' },
              { id: 'red', label: 'Red', swatch: '#8E2A2A' },
              { id: 'brown', label: 'Brown', swatch: '#5A3E2B' },
            ] },
            { id: 'metalGutters', label: 'Would you like to add new gutters?', review: 'New gutters', type: 'single', layout: 'list', required: true, showIf: { q: 'roofType', in: ['metal'] }, options: YES_NO },
          ],
        },
      ],
    },

    /* ================= SOMETHING ELSE ================= */
    {
      id: 'other',
      label: 'Something else',
      card: { text: 'Decks, fencing, additions & more', image: PHOTO('projects', 'exterior-porch-autumn') },
      pages: [
        {
          id: 'o-project',
          title: 'Please add photos of the area you want renovated.',
          review: 'Your project',
          intro: { icon: 'sparkle', title: 'New deck? Fencing? Do you need to build a mother-in-law suite?? (Let’s hope not..)', text: 'We can probably do it! We just need a bit more information.' },
          photos: {},
          questions: [
            { id: 'otherDetails', label: 'Tell us about your project', review: 'Your project', type: 'textarea', required: true },
          ],
        },
      ],
    },
  ];

  const ESTIMATE_PRODUCTS = Array.isArray(window.SITE_ESTIMATE_PRODUCTS) ? window.SITE_ESTIMATE_PRODUCTS : DEFAULT_ESTIMATE_PRODUCTS;

  // Window colors share one list with the Windows page visualizer.
  ESTIMATE_PRODUCTS.forEach((product) =>
    product.pages.forEach((page) =>
      (page.questions || []).forEach((q) => {
        if (q.id === 'windowColor' && !(q.options || []).length) {
          q.options = WINDOW_COLORS.map((c) => ({ id: c.id, label: c.label, swatch: c.exterior.hex }));
        }
      })
    )
  );

  const productById = (id) => ESTIMATE_PRODUCTS.find((p) => p.id === id);
  const FLOW_PAGES = ESTIMATE_PRODUCTS.flatMap((p) => p.pages.map((page) => ({ ...page, product: p.id })));
  const FLOW_QUESTIONS = FLOW_PAGES.flatMap((page) => (page.questions || []).map((q) => ({ ...q, page: page.id, product: page.product })));
  const PAGE_BY_ID = new Map(FLOW_PAGES.map((page) => [page.id, page]));
  const QUESTION_BY_ID = new Map(FLOW_QUESTIONS.map((q) => [q.id, q]));

  /** Products in flow order (the order of ESTIMATE_PRODUCTS), whatever order they were ticked in. */
  const orderProducts = (ids) => ESTIMATE_PRODUCTS.filter((p) => ids.includes(p.id)).map((p) => p.id);

  const hasAnswer = (value) => (Array.isArray(value) ? value.length > 0 : Boolean(String(value || '').trim()));

  /** True when a when/showIf condition (one { q, in } or an array of them) holds for these answers. */
  function condHolds(cond, answers) {
    if (!cond) return true;
    if (Array.isArray(cond)) return cond.every((c) => condHolds(c, answers));
    const value = answers[cond.q];
    const list = Array.isArray(value) ? value : value ? [value] : [];
    return list.some((v) => cond.in.includes(v));
  }

  const condRefs = (cond) => (!cond ? [] : Array.isArray(cond) ? cond.map((c) => c.q) : [cond.q]);

  /** A page applies when its product is chosen and its `when` holds on questions that themselves apply. */
  function pageApplies(page, state) {
    if (!page || !state.products.includes(page.product)) return false;
    return condHolds(page.when, state.answers) && condRefs(page.when).every((id) => questionApplies(QUESTION_BY_ID.get(id), state));
  }

  /** A question applies when its page applies and its showIf holds — and the question it depends on applies too. */
  function questionApplies(q, state) {
    if (!q) return false;
    if (!pageApplies(PAGE_BY_ID.get(q.page), state)) return false;
    return condHolds(q.showIf, state.answers) && condRefs(q.showIf).every((id) => questionApplies(QUESTION_BY_ID.get(id), state));
  }

  /** Answered questions that currently apply → [{ product, page, id, question, answer, long }], human-readable. */
  function answerList(state) {
    return FLOW_QUESTIONS.filter((q) => q.type !== 'note' && hasAnswer(state.answers[q.id]) && questionApplies(q, state)).map((q) => {
      const value = state.answers[q.id];
      const labelOf = (v) => ((q.options || []).find((o) => o.id === v) || {}).label || v;
      const isText = q.type === 'text' || q.type === 'textarea';
      return {
        product: q.product,
        page: q.page,
        id: q.id,
        question: q.review || q.label,
        answer: isText ? String(value).trim() : (Array.isArray(value) ? value : [value]).map(labelOf).join(', '),
        long: q.type === 'textarea',
      };
    });
  }

  /** Groups a product's answers by review heading, in page order (consecutive pages may share a heading). */
  function answerSections(answered, pageIds) {
    const sections = [];
    pageIds.forEach((pageId) => {
      const page = PAGE_BY_ID.get(pageId);
      const rows = answered.filter((a) => a.page === pageId);
      if (!page || !rows.length) return;
      const title = page.review || page.title;
      const last = sections[sections.length - 1];
      if (last && last.title === title) {
        last.rows.push(...rows);
        last.until = pageId;
      } else {
        sections.push({ title, start: pageId, until: pageId, rows: rows.slice() });
      }
    });
    return sections;
  }

  /* Inline icon set (matches the icons used in the HTML) */
  const ICON_PATHS = {
    drop: '<path d="M12 3.5s6 6.4 6 10.5a6 6 0 0 1-12 0c0-4.1 6-10.5 6-10.5z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    door: '<path d="M6 20.5v-16a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v16"/><path d="M4 20.5h16"/><circle cx="14.5" cy="12.5" r=".9"/>',
    roof: '<path d="M3 12 12 4.5 21 12"/><path d="M5.5 10v9.5h13V10"/><path d="M15.5 6.6V4.5H18v4.2"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.8v.2"/>',
    upload: '<path d="M12 15.5V4M7 9l5-5 5 5M4.5 14.5v4A1.5 1.5 0 0 0 6 20h12a1.5 1.5 0 0 0 1.5-1.5v-4"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    edit: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
    trash: '<path d="M4.5 7h15M9.5 7V5h5v2M6.5 7l.8 12a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4l.8-12"/>',
    refresh: '<path d="M4 12a8 8 0 0 1 13.7-5.6L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 0 1-13.7 5.6L4 15.5M4 20v-4.5h4.5"/>',
    window: '<rect x="5" y="3.5" width="14" height="17" rx="1.5"/><path d="M5 12h14M12 3.5v17"/>',
    bath: '<path d="M3.5 12h17v2.5a5 5 0 0 1-5 5h-7a5 5 0 0 1-5-5z"/><path d="M6 12V6.5a2.5 2.5 0 0 1 4.8-1"/><path d="m7 19.5-1 1.5M17 19.5l1 1.5"/>',
    home: '<path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1z"/>',
    user: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>',
    'map-pin': '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    camera: '<path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2.1l1.3-2h6.2l1.3 2h2.1A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z"/><circle cx="12" cy="13" r="3.5"/>',
    chat: '<path d="M5 18.5v-12A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5v8a1.5 1.5 0 0 1-1.5 1.5H8z"/><path d="M9 9.5h6M9 12.5h4"/>',
    palette: '<circle cx="8.5" cy="12" r="4.5"/><circle cx="15.5" cy="12" r="4.5"/>',
    layers: '<path d="m12 4 8.5 4.5L12 13 3.5 8.5z"/><path d="m3.5 12.5 8.5 4.5 8.5-4.5"/>',
    image: '<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="9" cy="9.5" r="1.5"/><path d="m20.5 16-5-5-9 8.5"/>',
    sparkle: '<path d="M12 3.5 13.9 9 19.5 11l-5.6 2L12 18.5 10.1 13 4.5 11l5.6-2z"/>',
    shower: '<path d="M6 21V7a3 3 0 0 1 3-3h1a3 3 0 0 1 3 3v1"/><path d="M9.5 8h7"/><path d="M11 11v.5M13 12v.5M15 11v.5M12 14.5v.5M14 15v.5"/>',
    vanity: '<rect x="4" y="11" width="16" height="9" rx="1.5"/><path d="M12 11v9M9 15h.01M15 15h.01"/><path d="M9 11V8.5a3 3 0 0 1 6 0V11"/>',
    floor: '<path d="M2.5 20h19L17.5 12h-11zM9 12l-2 8M15 12l2 8M4.3 16h15.4"/>',
    toilet: '<path d="M7 3.5h7v6H7z"/><path d="M5 9.5h14v1a6 6 0 0 1-6 6h-2a6 6 0 0 1-6-6z"/><path d="m9 16.5-1 4h8l-1-4"/>',
  };

  function icon(name, className = 'icon') {
    return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICON_PATHS[name] || ''}</svg>`;
  }

  /* -------------------------------------------------------------------
     1b. Shared SVG diagrams — one source for the Windows page,
         the estimator and decorative previews.
     ------------------------------------------------------------------- */

  const fmt = (n) => Math.round(n * 10) / 10;
  const seg = (x1, y1, x2, y2) => `M${fmt(x1)} ${fmt(y1)}L${fmt(x2)} ${fmt(y2)}`;

  const SASH_UPPER = { x: 17, y: 15, w: 86, h: 60 };
  const SASH_LOWER = { x: 17, y: 85, w: 86, h: 60 };

  function colonialLines(g) {
    return (
      seg(g.x + g.w / 3, g.y, g.x + g.w / 3, g.y + g.h) +
      seg(g.x + (2 * g.w) / 3, g.y, g.x + (2 * g.w) / 3, g.y + g.h) +
      seg(g.x, g.y + g.h / 2, g.x + g.w, g.y + g.h / 2)
    );
  }

  /** Diagonal lattice clipped to the glass rectangle (no clipPath ids needed). */
  function diamondLines(g, spacing) {
    let d = '';
    for (let c = -g.h + spacing / 2; c < g.w; c += spacing) {
      const x1 = Math.max(0, c);
      const x2 = Math.min(g.w, c + g.h);
      if (x2 > x1) d += seg(g.x + x1, g.y + x1 - c, g.x + x2, g.y + x2 - c);
    }
    for (let c = spacing / 2; c < g.w + g.h; c += spacing) {
      const x1 = Math.max(0, c - g.h);
      const x2 = Math.min(g.w, c);
      if (x2 > x1) d += seg(g.x + x1, g.y + c - x1, g.x + x2, g.y + c - x2);
    }
    return d;
  }

  /** Small perimeter panes around a large center pane. */
  function queenAnneLines(g, border) {
    let d =
      seg(g.x + border, g.y, g.x + border, g.y + g.h) +
      seg(g.x + g.w - border, g.y, g.x + g.w - border, g.y + g.h) +
      seg(g.x, g.y + border, g.x + g.w, g.y + border) +
      seg(g.x, g.y + g.h - border, g.x + g.w, g.y + g.h - border);
    const innerW = g.w - border * 2;
    for (let i = 1; i < 4; i += 1) {
      const x = g.x + border + (innerW * i) / 4;
      d += seg(x, g.y, x, g.y + border) + seg(x, g.y + g.h - border, x, g.y + g.h);
    }
    const midY = g.y + g.h / 2;
    d += seg(g.x, midY, g.x + border, midY) + seg(g.x + g.w - border, midY, g.x + g.w, midY);
    return d;
  }

  function gridPath(grid) {
    switch (grid) {
      case 'colonial':
      case 'same':
        return colonialLines(SASH_UPPER) + colonialLines(SASH_LOWER);
      case 'diamond':
        return diamondLines(SASH_UPPER, 17.2);
      case 'queen-anne':
        return queenAnneLines(SASH_UPPER, 11);
      default:
        return '';
    }
  }

  /** Double-hung window. Frame color follows the CSS var --frame-color. */
  function windowSVG(grid = 'none', { withTrim = false } = {}) {
    const d = gridPath(grid);
    let muntins = '';
    if (d && grid === 'same') {
      muntins = `<path class="win-muntin-dashed" d="${d}" stroke-width="1.6" fill="none"/>`;
    } else if (d) {
      muntins =
        `<path class="win-muntin-edge" d="${d}" stroke-width="4.2" fill="none" stroke-linecap="square"/>` +
        `<path class="win-muntin" d="${d}" stroke-width="2.6" fill="none" stroke-linecap="square"/>`;
    }
    const trim = withTrim
      ? '<rect x="-7" y="-6" width="134" height="170" rx="3" fill="#FBFBFA" stroke="#C9D3DA" stroke-width="1"/>' +
        '<rect x="-13" y="156" width="146" height="9" rx="2" fill="#F3F4F2" stroke="#C9D3DA" stroke-width="1"/>'
      : '';
    const viewBox = withTrim ? '-14 -8 148 176' : '0 0 120 160';
    return (
      `<svg viewBox="${viewBox}" aria-hidden="true" focusable="false">` +
      trim +
      '<rect class="win-frame" x="8" y="6" width="104" height="148" rx="4" stroke-width="1.2"/>' +
      '<rect class="win-frame" x="13" y="11" width="94" height="68" rx="2" stroke-width="0.8"/>' +
      '<rect class="win-frame" x="13" y="81" width="94" height="68" rx="2" stroke-width="0.8"/>' +
      '<rect class="win-glass" x="17" y="15" width="86" height="60" rx="1"/>' +
      '<rect class="win-glass" x="17" y="85" width="86" height="60" rx="1"/>' +
      '<path class="win-glare" d="M17 56 58 15h13L17 69zM17 126l41-41h13l-54 54z"/>' +
      muntins +
      '</svg>'
    );
  }

  /** Architectural line drawings for window styles (Windows page). */
  function styleSVG(style) {
    const open = '<svg viewBox="0 0 160 140" aria-hidden="true" focusable="false" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">';
    const dash = 'stroke-dasharray="5 4"';
    const shapes = {
      'double-hung':
        '<rect class="line-art" x="36" y="8" width="88" height="124" rx="3"/>' +
        '<rect class="line-art line-art-glass" x="44" y="16" width="72" height="52" rx="1.5"/>' +
        '<rect class="line-art line-art-glass" x="44" y="72" width="72" height="52" rx="1.5"/>' +
        '<path class="line-art-accent" d="M80 26v28M73 47l7 7 7-7M80 114V86M73 93l7-7 7 7"/>',
      casement:
        '<rect class="line-art" x="38" y="8" width="84" height="124" rx="3"/>' +
        '<rect class="line-art line-art-glass" x="46" y="16" width="68" height="108" rx="1.5"/>' +
        `<path class="line-art-accent" ${dash} d="M114 16 46 70l68 54"/>` +
        '<path class="line-art" d="M110 64v12"/>',
      sliding:
        '<rect class="line-art" x="14" y="26" width="132" height="88" rx="3"/>' +
        '<rect class="line-art line-art-glass" x="22" y="34" width="60" height="72" rx="1.5"/>' +
        '<rect class="line-art line-art-glass" x="78" y="34" width="60" height="72" rx="1.5"/>' +
        '<path class="line-art-accent" d="M126 70H94M101 63l-7 7 7 7"/>',
      picture:
        '<rect class="line-art" x="14" y="18" width="132" height="104" rx="3"/>' +
        '<rect class="line-art line-art-glass" x="22" y="26" width="116" height="88" rx="1.5"/>' +
        '<path class="line-art-accent" d="M22 100l30-28 20 17 22-24 44 38"/>' +
        '<circle class="line-art-accent" cx="112" cy="46" r="7"/>',
      bay:
        '<path class="line-art line-art-glass" d="M16 34 54 22v96l-38-12z"/>' +
        '<rect class="line-art line-art-glass" x="54" y="22" width="52" height="96" rx="1.5"/>' +
        '<path class="line-art line-art-glass" d="m106 22 38 12v72l-38 12z"/>' +
        '<path class="line-art" d="M10 110 54 124h52l44-14"/>' +
        '<path class="line-art-accent" d="M80 34v72" stroke-dasharray="2 5"/>',
      awning:
        '<rect class="line-art" x="18" y="28" width="124" height="84" rx="3"/>' +
        '<rect class="line-art line-art-glass" x="26" y="36" width="108" height="68" rx="1.5"/>' +
        `<path class="line-art-accent" ${dash} d="M26 104 80 36l54 68"/>` +
        '<path class="line-art" d="M74 100h12"/>',
    };
    return open + (shapes[style] || shapes.picture) + '</svg>';
  }

  /** Small illustrations for the "window style approach" choices. */
  function approachSVG(type) {
    const frame = (x) =>
      `<rect class="line-art line-art-glass" x="${x}" y="12" width="40" height="64" rx="2.5"/>` +
      `<path class="line-art" d="M${x} 44h40M${x + 20} 12v64"/>`;
    const open = '<svg viewBox="0 0 140 88" aria-hidden="true" focusable="false" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
    if (type === 'similar') {
      return open + frame(20) + frame(80) + '<path class="line-art-accent" d="M64 39h12M64 49h12" stroke-width="2.6"/></svg>';
    }
    if (type === 'recommend') {
      return (
        open + frame(50) +
        '<circle cx="94" cy="20" r="13" fill="#7FD2FE"/>' +
        '<path d="m88 20 4 4 8-8" fill="none" stroke="#1B1B41" stroke-width="2.6"/></svg>'
      );
    }
    return (
      open + frame(50) +
      '<circle cx="94" cy="20" r="13" fill="#E0F4FF" stroke="#0D71A5" stroke-width="1.6"/>' +
      '<text x="94" y="25.5" text-anchor="middle" font-size="16" font-weight="800" fill="#0D71A5" font-family="General Sans, sans-serif">?</text></svg>'
    );
  }

  /* ===================================================================
     2. DOM HELPERS
     =================================================================== */

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function on(target, type, handler, options) {
    if (target) target.addEventListener(type, handler, options);
  }

  function escapeHTML(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getPath(obj, path) {
    return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
  }

  function setPath(obj, path, value) {
    const keys = path.split('.');
    const last = keys.pop();
    const target = keys.reduce((acc, key) => {
      if (acc[key] == null || typeof acc[key] !== 'object') acc[key] = {};
      return acc[key];
    }, obj);
    target[last] = value;
  }

  /* ===================================================================
     3. NAVIGATION (mobile drawer)
     =================================================================== */

  function initMobileNav() {
    const toggle = $('[data-nav-toggle]');
    const nav = $('[data-mobile-nav]');
    if (!toggle || !nav) return;

    const panel = $('.mobile-nav__panel', nav);
    let lastFocused = null;

    const focusables = () =>
      $$('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])', panel);

    function onKeydown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    function open() {
      lastFocused = document.activeElement;
      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      lockScroll();
      document.addEventListener('keydown', onKeydown);
      const closeBtn = $('.icon-btn[data-nav-close]', nav);
      if (closeBtn) closeBtn.focus({ preventScroll: true });
    }

    function close({ restoreFocus = true } = {}) {
      if (!nav.classList.contains('is-open')) return;
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      unlockScroll();
      document.removeEventListener('keydown', onKeydown);
      if (restoreFocus && lastFocused) lastFocused.focus({ preventScroll: true });
    }

    on(toggle, 'click', () => (nav.classList.contains('is-open') ? close() : open()));
    $$('[data-nav-close]', nav).forEach((el) => on(el, 'click', () => close()));
    $$('a[href]', panel).forEach((link) => on(link, 'click', () => close({ restoreFocus: false })));
  }

  /* ===================================================================
     4. SCROLL HEADER
     =================================================================== */

  function initHeader(header) {
    // Always visible (sticky); it only changes its look, never hides.
    let ticking = false;
    // Over a photo hero the bar stays transparent until the next section covers it.
    const overlay = document.body.dataset.header === 'overlay';
    const hero = overlay ? $('[data-hero], [data-header-hero]') : null;
    const darkZones = $$('[data-header-theme="dark"]');
    const update = () => {
      const y = window.scrollY;
      const h = header.offsetHeight;
      const threshold = hero ? Math.max(8, hero.offsetHeight - h) : 8;
      header.classList.toggle('is-scrolled', y > threshold);
      // Dark sections under the bar switch it to its dark variant.
      const dark = darkZones.some((zone) => {
        const r = zone.getBoundingClientRect();
        return r.top <= h / 2 && r.bottom >= h / 2;
      });
      header.classList.toggle('is-dark', dark);
      ticking = false;
    };
    update();
    on(
      window,
      'scroll',
      () => {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /* ===================================================================
     5. REVEAL ANIMATIONS
     =================================================================== */

  /**
   * Clip-path wipe (bottom → top) with the photo settling from a slight zoom.
   * Runs through WAAPI so nothing is left clipped afterwards (shadows, floating cards).
   */
  function revealClip(el, delay = 0) {
    if (typeof el.animate !== 'function') return;
    const timing = { duration: 1150, delay, fill: 'backwards' };
    el.animate([{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], {
      ...timing,
      easing: 'cubic-bezier(0.77, 0, 0.175, 1)',
    });
    const img = el.tagName === 'IMG' ? null : el.querySelector('img');
    if (img) {
      img.animate([{ transform: 'scale(1.12)' }, { transform: 'scale(1)' }], {
        ...timing,
        easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
      });
    }
  }

  function reveal(el) {
    el.classList.add('is-revealed');
    if (el.dataset.reveal === 'clip') revealClip(el);
    if (el.hasAttribute('data-reveal-clip')) {
      Array.from(el.children).forEach((child, i) => revealClip(child, i * 90));
    }
  }

  function initReveal() {
    const elements = $$('[data-reveal]');
    if (!elements.length) return;

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    // Anything already on screen is shown immediately (no flash on load);
    // photo wipes still play, since they start from a hidden state anyway.
    const viewport = window.innerHeight;
    elements.forEach((el) => {
      if (el.getBoundingClientRect().top >= viewport * 0.9) return;
      if (el.dataset.reveal === 'clip' || el.hasAttribute('data-reveal-clip')) reveal(el);
      else el.classList.add('is-revealed');
    });
    document.documentElement.classList.add('reveal-ready');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    elements.forEach((el) => {
      if (!el.classList.contains('is-revealed')) observer.observe(el);
    });
  }

  /**
   * Masked line reveal for inner-page headlines ([data-split-lines]).
   * Wraps each rendered line in its own mask, plays the rise, then restores
   * the original markup so the heading reflows naturally on resize.
   */
  function splitLines(el) {
    const original = el.innerHTML;
    const tokens = [];
    (function walk(node, wrap) {
      node.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (part) tokens.push({ text: part, space: !part.trim(), wrap });
          });
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          walk(child, child);
        }
      });
    })(el, null);

    const open = (w) => (w ? `<${w.tagName.toLowerCase()}${w.className ? ` class="${escapeHTML(w.className)}"` : ''}>` : '');
    const close = (w) => (w ? `</${w.tagName.toLowerCase()}>` : '');

    // 1. Measure: one span per word, keeping inline wrappers such as <em class="text-accent">.
    el.innerHTML = tokens.map((t) => (t.space ? ' ' : `${open(t.wrap)}<span class="sl-w">${escapeHTML(t.text)}</span>${close(t.wrap)}`)).join('');
    const words = $$('.sl-w', el);
    const lines = [];
    let lastTop = null;
    let w = 0;
    tokens.forEach((t) => {
      if (t.space) {
        if (lines.length) lines[lines.length - 1].push(t);
        return;
      }
      const top = Math.round(words[w].getBoundingClientRect().top);
      w += 1;
      if (lastTop === null || top > lastTop + 4) {
        lines.push([]);
        lastTop = top;
      }
      lines[lines.length - 1].push(t);
    });

    // 2. Rebuild: each line in its own overflow mask.
    el.innerHTML = lines
      .map((line) => {
        while (line.length && line[line.length - 1].space) line.pop();
        let html = '';
        let current = null;
        line.forEach((t, i) => {
          const wrap = t.space ? current : t.wrap;
          if (i === 0 || wrap !== current) {
            html += close(current) + open(wrap);
            current = wrap;
          }
          html += escapeHTML(t.text);
        });
        return `<span class="sl-line"><span class="sl-inner">${html}${close(current)}</span></span>`;
      })
      .join('');
    $$('.sl-inner', el).forEach((inner, i) => inner.style.setProperty('--l', i));
    el.classList.add('is-split');

    const duration = 120 + (lines.length - 1) * 90 + 1000 + 100;
    window.setTimeout(() => {
      el.innerHTML = original;
    }, duration);
  }

  function initSplitHeadlines() {
    const heads = $$('[data-split-lines]');
    if (!heads.length || prefersReducedMotion()) return;
    const fonts = document.fonts;
    const ready =
      fonts && fonts.load
        ? fonts.load('500 48px "General Sans"')
        : Promise.resolve();
    // If the font is slow, keep the plain CSS rise instead of re-flowing mid-entrance.
    let expired = false;
    const timer = window.setTimeout(() => {
      expired = true;
    }, 240);
    ready
      .then(() => {
        window.clearTimeout(timer);
        if (!expired) heads.forEach(splitLines);
      })
      .catch(() => {});
  }

  /* ===================================================================
     6. ACCORDIONS
     =================================================================== */

  function initAccordion(root) {
    const single = root.dataset.accordion === 'single';
    const triggers = $$('[data-accordion-trigger]', root);

    function setOpen(trigger, open) {
      const item = trigger.closest('.accordion__item');
      trigger.setAttribute('aria-expanded', String(open));
      if (item) item.classList.toggle('is-open', open);
    }

    triggers.forEach((trigger) => {
      on(trigger, 'click', () => {
        const willOpen = trigger.getAttribute('aria-expanded') !== 'true';
        if (single && willOpen) triggers.forEach((other) => other !== trigger && setOpen(other, false));
        setOpen(trigger, willOpen);
      });
    });
  }

  /* ===================================================================
     7. BEFORE / AFTER SLIDER (+ tabs)
     =================================================================== */

  function initCompare(root) {
    const stage = $('[data-compare-stage]', root);
    const before = $('[data-compare-before]', root);
    const handle = $('[data-compare-handle]', root);
    const range = $('[data-compare-range]', root);
    if (!stage || !before || !handle || !range) return;

    let position = Number(range.value) || 50;
    let activePointer = null;

    function render() {
      // Update transforms/clip directly on the elements (no inherited CSS var recalcs).
      before.style.clipPath = `inset(0 ${100 - position}% 0 0)`;
      handle.style.transform = `translateX(${position}%)`;
      range.value = String(Math.round(position));
      range.setAttribute('aria-valuetext', `${Math.round(position)}% before, ${Math.round(100 - position)}% after`);
    }

    function setFromPointer(event) {
      const rect = stage.getBoundingClientRect();
      position = clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100);
      render();
    }

    on(stage, 'pointerdown', (event) => {
      if (activePointer !== null) return; // ignore extra fingers
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      activePointer = event.pointerId;
      stage.setPointerCapture(event.pointerId);
      stage.classList.add('is-dragging');
      if (event.pointerType === 'mouse') setFromPointer(event);
    });

    on(stage, 'pointermove', (event) => {
      if (event.pointerId !== activePointer) return;
      setFromPointer(event);
    });

    const release = (event) => {
      if (event.pointerId !== activePointer) return;
      activePointer = null;
      stage.classList.remove('is-dragging');
    };
    on(stage, 'pointerup', release);
    on(stage, 'pointercancel', release);

    on(range, 'input', () => {
      position = Number(range.value);
      render();
    });
    on(range, 'focus', () => root.classList.toggle('is-focused', range.matches(':focus-visible')));
    on(range, 'blur', () => root.classList.remove('is-focused'));

    // Clicking the stage with a mouse also focuses the accessible control.
    on(stage, 'click', () => range.focus({ preventScroll: true }));

    render();
  }

  function initTabs(root) {
    const list = $('[role="tablist"]', root);
    const tabs = $$('[role="tab"]', root);
    if (!list || !tabs.length) return;

    function activate(index, { focus = false } = {}) {
      tabs.forEach((tab, i) => {
        const selected = i === index;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
        const panel = document.getElementById(tab.getAttribute('aria-controls'));
        if (panel) panel.hidden = !selected;
      });
      list.dataset.active = String(index);
      if (focus) tabs[index].focus();
    }

    tabs.forEach((tab, index) => on(tab, 'click', () => activate(index)));

    on(list, 'keydown', (event) => {
      const current = tabs.indexOf(document.activeElement);
      if (current === -1) return;
      let next = null;
      if (event.key === 'ArrowRight') next = (current + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === null) return;
      event.preventDefault();
      activate(next, { focus: true });
    });

    activate(Math.max(0, tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true')));
  }

  /* ===================================================================
     8. TESTIMONIALS & PAGE COMPONENTS
     =================================================================== */

  function initReviews(root) {
    const track = $('[data-reviews-track]', root);
    const prev = $('[data-reviews-prev]', root);
    const next = $('[data-reviews-next]', root);
    if (!track || !prev || !next) return;

    const step = () => {
      const card = track.firstElementChild;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 16;
      return card ? card.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
    };

    const update = () => {
      const max = track.scrollWidth - track.clientWidth - 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max;
    };

    const behavior = () => (prefersReducedMotion() ? 'auto' : 'smooth');
    on(prev, 'click', () => track.scrollBy({ left: -step(), behavior: behavior() }));
    on(next, 'click', () => track.scrollBy({ left: step(), behavior: behavior() }));
    on(track, 'scroll', debounce(update, 60), { passive: true });
    on(window, 'resize', debounce(update, 150));
    update();
  }

  /**
   * Scroll-driven card row. The section pins under the header while the page
   * scrolls, and the row slides sideways 1:1 with the scroll, eased so it
   * glides instead of snapping. Once the last card is in view the page moves on.
   * Reduced motion keeps the swipeable row and its arrows (initReviews).
   */
  function initScrollTrack(root) {
    const track = $('[data-reviews-track]', root);
    if (!track || prefersReducedMotion() || track.children.length < 2) return false;
    track.classList.add('is-scroll-driven');
    const controls = $('.reviews__controls', root);
    if (controls) controls.hidden = true;

    // Wrap the section's content in a sticky "pin"; the section itself becomes
    // the tall scroll runway. The section's padding moves onto the pin.
    const pin = document.createElement('div');
    pin.className = 'quotes-ref__pin';
    const cs = getComputedStyle(root);
    pin.style.paddingTop = cs.paddingTop;
    pin.style.paddingBottom = cs.paddingBottom;
    while (root.firstChild) pin.appendChild(root.firstChild);
    root.appendChild(pin);
    root.classList.add('is-pinned');

    const header = $('[data-site-header]');
    let max = 0;
    let stickyTop = 0;
    let runway = 1;
    const layout = () => {
      const prevTransform = track.style.transform;
      track.style.transform = 'none';
      const tr = track.getBoundingClientRect();
      const last = track.lastElementChild.getBoundingClientRect();
      const padEnd = parseFloat(getComputedStyle(track).paddingRight) || 0;
      max = Math.max(0, last.right + padEnd - tr.right);
      track.style.transform = prevTransform;

      const vh = window.innerHeight;
      const headerH = header ? header.getBoundingClientRect().height : 64;
      const pinH = pin.offsetHeight;
      // Centre the pinned block in the space under the header; if it is taller
      // than that space, stick it higher so the cards stay in view.
      const free = vh - headerH - pinH;
      stickyTop = free >= 0 ? headerH + free / 2 : vh - pinH;
      pin.style.top = `${stickyTop}px`;
      runway = Math.max(1, max);                 // 1px of scroll = 1px of sideways travel
      root.style.height = `${pinH + runway}px`;
    };
    layout();

    // Ease toward the scroll position instead of jumping to it each frame
    let target = 0;
    let current = 0;
    let raf = 0;
    const step = () => {
      current += (target - current) * 0.12;
      if (Math.abs(target - current) < 0.3) current = target;
      track.style.transform = `translate3d(${current.toFixed(1)}px, 0, 0)`;
      raf = current === target ? 0 : window.requestAnimationFrame(step);
    };
    const progress = () => clamp((stickyTop - root.getBoundingClientRect().top) / runway, 0, 1);
    onScrollFrame(() => {
      target = -progress() * max;
      if (!raf) raf = window.requestAnimationFrame(step);
    });
    on(window, 'resize', debounce(() => { layout(); window.dispatchEvent(new Event('scroll')); }, 150));

    // Keyboard: tabbing to a card scrolls the page to where that card is on screen
    on(track, 'focusin', (e) => {
      const card = e.target.closest('.quote-card');
      if (!card || !max) return;
      const padStart = parseFloat(getComputedStyle(track).paddingLeft) || 0;
      const offset = card.getBoundingClientRect().left - track.getBoundingClientRect().left - padStart;
      const p = clamp(offset / max, 0, 1);
      window.scrollTo({ top: window.scrollY + root.getBoundingClientRect().top - stickyTop + p * runway, behavior: 'auto' });
      target = current = -p * max;
      track.style.transform = `translate3d(${current.toFixed(1)}px, 0, 0)`;
    });
    return true;
  }

  /** Remove sample/placeholder sections in one switch (SITE_CONFIG.hidePlaceholderSections). */
  function initPlaceholderSections() {
    if (!SITE_CONFIG.hidePlaceholderSections) return;
    $$('[data-placeholder-section]').forEach((section) => section.remove());
  }

  function initDevNotes() {
    document.documentElement.classList.toggle('show-dev-notes', Boolean(SITE_CONFIG.showDevNotes));
  }

  /** Phone / email render only when real values exist in SITE_CONFIG. */
  function initConfigContact() {
    let hasAny = false;
    $$('[data-config-item]').forEach((item) => {
      const key = item.dataset.configItem;
      const value = String(SITE_CONFIG[key] || '').trim();
      const link = $('[data-config-link]', item);
      if (!value || !link) {
        item.hidden = true;
        return;
      }
      hasAny = true;
      item.hidden = false;
      link.textContent = value;
      link.href = key === 'phone' ? `tel:${value.replace(/[^\d+]/g, '')}` : `mailto:${value}`;
    });
    $$('[data-config-fallback]').forEach((el) => {
      el.hidden = hasAny;
    });
  }

  function initYear() {
    const year = String(new Date().getFullYear());
    $$('[data-year]').forEach((el) => {
      el.textContent = year;
    });
  }

  function initDiagrams(root = document) {
    $$('[data-diagram]', root).forEach((el) => {
      const type = el.dataset.diagram;
      if (type === 'grid') el.innerHTML = windowSVG(el.dataset.grid || 'none');
      if (type === 'style') el.innerHTML = styleSVG(el.dataset.style);
      if (type === 'approach') el.innerHTML = approachSVG(el.dataset.approach);
    });
  }

  /**
   * "How it works" tour: clickable steps drive the phone mockup.
   * Auto-advances when each step's timer bar finishes; pauses while hovered,
   * focused or off-screen, and never auto-advances for reduced motion.
   */
  function initTour(root) {
    const steps = $$('.tour-step', root);
    const screens = $$('[data-screen]', root);
    const progress = $('[data-phone-progress]', root);
    const counter = $('[data-phone-count]', root);
    if (!steps.length) return;

    const auto = !prefersReducedMotion();
    root.classList.toggle('is-manual', !auto);
    let index = 0;

    function show(next) {
      index = (next + steps.length) % steps.length;
      steps.forEach((step, i) => {
        const active = i === index;
        const bar = $('.tour-step__bar', step);
        step.classList.toggle('is-active', active);
        $('.tour-step__btn', step).setAttribute('aria-current', active ? 'step' : 'false');
        if (active && bar) {
          // Restart the timer even when the same step is chosen again.
          bar.style.animation = 'none';
          void bar.offsetWidth;
          bar.style.animation = '';
        }
      });
      screens.forEach((screen) => screen.classList.toggle('is-active', Number(screen.dataset.screen) === index + 1));
      if (progress) progress.style.transform = `scaleX(${(index + 1) / steps.length})`;
      if (counter) counter.textContent = `Step ${index + 1} of ${steps.length}`;
    }

    steps.forEach((step, i) => {
      on($('.tour-step__btn', step), 'click', () => show(i));
      on($('.tour-step__bar', step), 'animationend', () => {
        if (auto && i === index) show(index + 1);
      });
    });

    let hovered = false;
    let focused = false;
    let visible = false;
    const sync = () => root.classList.toggle('is-paused', hovered || focused || !visible);
    on(root, 'pointerenter', (event) => {
      if (event.pointerType === 'mouse') {
        hovered = true;
        sync();
      }
    });
    on(root, 'pointerleave', () => {
      hovered = false;
      sync();
    });
    on(root, 'focusin', () => {
      focused = true;
      sync();
    });
    on(root, 'focusout', (event) => {
      if (!root.contains(event.relatedTarget)) {
        focused = false;
        sync();
      }
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
        sync();
      }, { threshold: 0.35 }).observe(root);
    } else {
      visible = true;
    }

    show(0);
    sync();
  }

  /* -------------------------------------------------------------------
     Reference motion (assets/ref.mp4): scroll-linked effects share one
     rAF-throttled scroll loop. All of them are skipped for reduced motion.
     ------------------------------------------------------------------- */

  const scrollJobs = [];
  let scrollTicking = false;

  function runScrollJobs() {
    scrollTicking = false;
    const vh = window.innerHeight;
    scrollJobs.forEach((job) => job(vh));
  }

  function onScrollFrame(job) {
    if (!scrollJobs.length) {
      const request = () => {
        if (!scrollTicking) {
          scrollTicking = true;
          window.requestAnimationFrame(runScrollJobs);
        }
      };
      on(window, 'scroll', request, { passive: true });
      on(window, 'resize', request);
    }
    scrollJobs.push(job);
    job(window.innerHeight);
  }

  /** 0 → 1 as `el` travels from `start` to `end` (fractions of viewport height, measured at its top). */
  function progressOf(el, vh, start, end) {
    const top = el.getBoundingClientRect().top;
    return clamp((start * vh - top) / ((start - end) * vh), 0, 1);
  }

  /** Hero stays pinned while the page slides over it; its copy lifts and fades. */
  function initHeroScroll(hero) {
    if (prefersReducedMotion()) return;
    const content = $('[data-hero-content]', hero);
    const img = $('.hero__img', hero);
    onScrollFrame((vh) => {
      const p = clamp(window.scrollY / (hero.offsetHeight || vh), 0, 1);
      if (content) {
        content.style.transform = `translateY(${-p * 80}px) scale(${1 - p * 0.04})`;
        content.style.opacity = String(1 - p * 1.25);
      }
      if (img) img.style.transform = `scale(${1 + p * 0.08})`;
    });
  }

  /** Headings darken word by word as they scroll into place (grey → ink). */
  function initWordReveal(heading) {
    if (prefersReducedMotion()) return;
    const words = [];
    const wrap = (node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (!part.trim()) {
              frag.appendChild(document.createTextNode(part));
              return;
            }
            const span = document.createElement('span');
            span.className = 'wr-word';
            span.textContent = part;
            words.push(span);
            frag.appendChild(span);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE && !child.hasAttribute('aria-hidden')) {
          wrap(child);
        }
      });
    };
    wrap(heading);
    heading.classList.add('is-word-reveal');
    const extras = $$('[aria-hidden="true"]', heading);
    onScrollFrame((vh) => {
      const p = progressOf(heading, vh, 0.92, 0.42);
      const lit = p * (words.length + 1);
      words.forEach((word, i) => word.classList.toggle('is-lit', i < lit));
      extras.forEach((el) => el.classList.toggle('is-lit', p > 0.6));
    });
  }

  /** Big stat numbers rise out from under their hairline and count up. */
  function initStats(list) {
    const rows = $$('.stat-row', list);
    const counters = $$('[data-count]', list);
    const reduced = prefersReducedMotion();
    function count(el) {
      const target = Number(el.dataset.count);
      if (reduced || !target) return;
      const start = performance.now();
      const duration = 1100;
      const tick = (now) => {
        const t = clamp((now - start) / duration, 0, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = String(Math.round(target * eased));
        if (t < 1) requestAnimationFrame(tick);
      };
      el.textContent = '0';
      requestAnimationFrame(tick);
    }
    if (!('IntersectionObserver' in window)) return;
    list.classList.add('is-armed');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          const counter = $('[data-count]', entry.target);
          if (counter) count(counter);
          io.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.4 }
    );
    rows.forEach((row) => io.observe(row));
    if (!counters.length) list.classList.remove('is-armed');
  }

  /** Inset photo grows to full bleed and loses its radius as it scrolls up. */
  function initExpand(section) {
    const frame = $('[data-expand-frame]', section);
    const img = $('[data-expand-img]', section);
    if (!frame || prefersReducedMotion()) return;
    onScrollFrame((vh) => {
      const p = progressOf(section, vh, 1, 0.15);
      const side = (1 - p) * 7; // % inset per side
      const radius = (1 - p) * 32;
      frame.style.clipPath = `inset(0 ${side}% round ${radius}px)`;
      const rect = section.getBoundingClientRect();
      const drift = clamp((rect.top + rect.height / 2 - vh / 2) / vh, -1, 1);
      if (img) img.style.transform = `translateY(${drift * 8}%) scale(1.16)`;
    });
  }

  /** Services: pinned on desktop; scrolling through the section walks the list.
   *  Everywhere else it is a plain click accordion. */
  function initServices(section) {
    const items = $$('.svc', section);
    const imgs = $$('.services-ref__img', section);
    if (!items.length) return;
    let active = 0;

    function set(i) {
      if (i === active && items[i].classList.contains('is-active')) return;
      active = i;
      items.forEach((item, k) => {
        const on = k === i;
        item.classList.toggle('is-active', on);
        $('.svc__btn', item).setAttribute('aria-expanded', String(on));
      });
      imgs.forEach((img, k) => img.classList.toggle('is-active', k === i));
    }

    const pinned = window.matchMedia('(min-width: 1024px)');
    items.forEach((item, i) => {
      on($('.svc__btn', item), 'click', () => {
        if (pinned.matches && !prefersReducedMotion()) {
          // Scroll to the point in the pinned section where this item is active.
          const rect = section.getBoundingClientRect();
          const span = section.offsetHeight - window.innerHeight;
          const top = window.scrollY + rect.top + span * ((i + 0.5) / items.length);
          window.scrollTo({ top, behavior: 'smooth' });
        }
        set(i);
      });
    });

    // Pin only when the whole stage (heading + every item + the open panel) fits the viewport;
    // otherwise fall back to the normal click accordion so nothing is ever cut off.
    const content = $('.services-ref__content', section);
    const pinArea = $('.services-ref__pin', section);
    const apply = () => {
      section.classList.remove('is-pinned');
      if (!pinned.matches || prefersReducedMotion() || window.innerHeight < 620) return;
      section.classList.add('is-pinned');
      const cs = getComputedStyle(pinArea);
      const room = pinArea.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      if (content.scrollHeight > room + 1) section.classList.remove('is-pinned');
    };
    apply();
    on(pinned, 'change', apply);
    on(window, 'resize', debounce(apply, 150));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(apply);

    onScrollFrame(() => {
      if (!section.classList.contains('is-pinned')) return;
      const rect = section.getBoundingClientRect();
      const span = section.offsetHeight - window.innerHeight;
      if (span <= 0) return;
      const p = clamp(-rect.top / span, 0, 0.999);
      set(Math.floor(p * items.length));
    });
  }

  /** How it works: the active column widens and fills; auto-advances on a timer. */
  function initSteps(list) {
    const cols = $$('.step-col', list);
    if (!cols.length) return;
    const auto = !prefersReducedMotion();
    list.classList.toggle('is-manual', !auto);
    let index = 0;

    function show(next) {
      index = (next + cols.length) % cols.length;
      cols.forEach((col, i) => {
        const on = i === index;
        col.classList.toggle('is-active', on);
        $('.step-col__btn', col).setAttribute('aria-expanded', String(on));
        const cta = $('.step-col__cta', col);
        if (cta) cta.tabIndex = on ? 0 : -1;
        const bar = $('.step-col__bar', col);
        if (on && bar) {
          bar.style.animation = 'none';
          void bar.offsetWidth;
          bar.style.animation = '';
        }
      });
    }

    cols.forEach((col, i) => {
      on($('.step-col__btn', col), 'click', () => show(i));
      on($('.step-col__bar', col), 'animationend', () => {
        if (auto && i === index) show(index + 1);
      });
    });

    let hovered = false;
    let focused = false;
    let visible = false;
    const sync = () => list.classList.toggle('is-paused', hovered || focused || !visible);
    on(list, 'pointerenter', (e) => {
      if (e.pointerType === 'mouse') {
        hovered = true;
        sync();
      }
    });
    on(list, 'pointerleave', () => {
      hovered = false;
      sync();
    });
    on(list, 'focusin', () => {
      focused = true;
      sync();
    });
    on(list, 'focusout', (e) => {
      if (!list.contains(e.relatedTarget)) {
        focused = false;
        sync();
      }
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
        sync();
      }, { threshold: 0.4 }).observe(list);
    } else {
      visible = true;
    }
    show(0);
    sync();
  }

  /** Mouse drag-to-scroll for horizontal card tracks (touch scrolls natively). */
  function initDragScroll(track) {
    if (track.classList.contains('is-scroll-driven')) return;
    let startX = 0;
    let startLeft = 0;
    let dragging = false;
    let moved = false;
    on(track, 'pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      dragging = true;
      moved = false;
      startX = e.clientX;
      startLeft = track.scrollLeft;
      track.classList.add('is-grabbing');
    });
    on(window, 'pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      track.scrollLeft = startLeft - dx;
    });
    on(window, 'pointerup', () => {
      if (!dragging) return;
      dragging = false;
      track.classList.remove('is-grabbing');
    });
    on(track, 'click', (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  }

  /** Highlights the process step nearest the middle of the viewport. */
  function initProcess(list) {
    const steps = $$('.process-step', list);
    if (steps.length < 2 || !('IntersectionObserver' in window)) return;
    const setActive = (active) => steps.forEach((step) => step.classList.toggle('is-active', step === active));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target)),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    steps.forEach((step) => observer.observe(step));
  }

  /* ---- Data-driven option renderers (shared by Windows page + estimator) ---- */

  function isDarkColor(hex) {
    const n = parseInt(hex.replace('#', ''), 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b < 128;
  }

  const frameEdge = (hex) => (isDarkColor(hex) ? '#0D1114' : '#9FB0BC');

  function renderWindowColors(container) {
    const name = container.dataset.inputName || 'windowColor';
    const bind = container.dataset.bind ? ` data-bind="${container.dataset.bind}"` : '';
    container.innerHTML = WINDOW_COLORS.map(
      (color) => `
      <label class="swatch-card">
        <input class="swatch-card__input" type="radio" name="${name}" value="${color.id}"${bind}>
        <span class="swatch-pair" aria-hidden="true">
          ${color.interior.hex === color.exterior.hex
            ? `<span class="swatch-pair__side" data-swatch="${color.interior.hex}"></span>`
            : `<span class="swatch-pair__side" data-swatch="${color.interior.hex}"><span>Int</span></span><span class="swatch-pair__side" data-swatch="${color.exterior.hex}"><span>Ext</span></span>`}
        </span>
        <span class="swatch-card__name">${escapeHTML(color.label)}</span>
        <span class="swatch-card__check" aria-hidden="true">${icon('check')}</span>
      </label>`
    ).join('');
    // Set colors via CSSOM (CSP-friendly; no inline style attributes in markup).
    $$('[data-swatch]', container).forEach((side) => {
      side.style.setProperty('--swatch', side.dataset.swatch);
      if (isDarkColor(side.dataset.swatch)) side.style.setProperty('--swatch-ink', 'rgba(255,255,255,0.78)');
    });
  }

  function renderWindowGrids(container) {
    const interactive = Boolean(container.dataset.inputName);
    if (interactive) {
      const bind = container.dataset.bind ? ` data-bind="${container.dataset.bind}"` : '';
      container.innerHTML = WINDOW_GRIDS.map(
        (grid) => `
        <label class="option-card option-card--diagram">
          <input class="option-card__input" type="radio" name="${container.dataset.inputName}" value="${grid.id}"${bind}>
          <span class="option-card__art" aria-hidden="true">${windowSVG(grid.id)}</span>
          <span class="option-card__body">
            <span class="option-card__title">${escapeHTML(grid.label)}</span>
            <span class="option-card__text">${escapeHTML(grid.description)}</span>
          </span>
          <span class="option-card__check" aria-hidden="true">${icon('check')}</span>
        </label>`
      ).join('');
      return;
    }
    container.innerHTML = WINDOW_GRIDS.map(
      (grid) => `
      <article class="grid-card">
        <div class="grid-card__diagram" aria-hidden="true">${windowSVG(grid.id)}</div>
        <h3>${escapeHTML(grid.label)}</h3>
        <p>${escapeHTML(grid.description)}</p>
      </article>`
    ).join('');
  }

  function renderDataDriven() {
    $$('[data-render="window-colors"]').forEach(renderWindowColors);
    $$('[data-render="window-grids"]').forEach(renderWindowGrids);
  }

  /** Selected-state styling for any radio card group. */
  function syncChoiceCards(name, root = document) {
    $$(`input[type="radio"][name="${name}"]`, root).forEach((input) => {
      const card = input.closest('.option-card, .swatch-card');
      if (card) card.classList.toggle('is-selected', input.checked);
    });
  }

  /* ---- Windows page: color visualizer ---- */
  function initColorVisualizer(root) {
    const stage = $('.color-viz__stage', root);
    const windowEl = $('[data-viz-window]', root);
    const nameEl = $('[data-viz-name]', root);
    const detailEl = $('[data-viz-detail]', root);
    const viewButtons = $$('[data-viz-view]', root);
    const frameRoot = root.closest('[data-frame-root]');
    if (!stage || !windowEl) return;

    let view = 'interior';
    let color = WINDOW_COLORS[0];
    windowEl.innerHTML = windowSVG('colonial', { withTrim: true });

    function update() {
      const side = color[view];
      stage.dataset.view = view;
      stage.style.setProperty('--frame-color', side.hex);
      stage.style.setProperty('--frame-edge', frameEdge(side.hex));
      if (nameEl) nameEl.textContent = color.label;
      if (detailEl) detailEl.textContent = color.interior.hex === color.exterior.hex ? `${color.label} inside and out` : `Interior: ${color.interior.name} · Exterior: ${color.exterior.name}`;
      // Grid diagrams further down the page follow the exterior color.
      if (frameRoot) {
        frameRoot.style.setProperty('--frame-color', color.exterior.hex);
        frameRoot.style.setProperty('--frame-edge', frameEdge(color.exterior.hex));
      }
    }

    const inputs = $$('input[type="radio"]', root);
    inputs.forEach((input) => {
      on(input, 'change', () => {
        if (!input.checked) return;
        color = WINDOW_COLORS.find((c) => c.id === input.value) || WINDOW_COLORS[0];
        syncChoiceCards(input.name, root);
        update();
      });
    });
    if (inputs[0]) {
      inputs[0].checked = true;
      syncChoiceCards(inputs[0].name, root);
    }

    viewButtons.forEach((button) => {
      on(button, 'click', () => {
        view = button.dataset.vizView;
        viewButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
        update();
      });
    });

    update();
  }

  /* ---- Bath page: configuration-driven selections ---- */
  function initBathShowcase(container) {
    if (!bathOptions.length) return; // section stays hidden until the client's items exist
    const section = container.closest('[data-bath-selections]');
    if (section) section.hidden = false;
    container.innerHTML = bathOptions
      .map(
        (cat) => `
      <section class="bath-category">
        <header class="bath-category__head">
          <h3 class="h3">${escapeHTML(cat.category)}</h3>
          ${cat.description ? `<p>${escapeHTML(cat.description)}</p>` : ''}
        </header>
        <ul class="product-grid" role="list">
          ${(cat.options || [])
            .map(
              (opt) => `
            <li class="product-card">
              ${opt.image ? `<img class="product-card__img" src="${escapeHTML(opt.image)}" alt="${escapeHTML(opt.label)}" loading="lazy" decoding="async" width="640" height="480">` : ''}
              <div class="product-card__body">
                <h4>${escapeHTML(opt.label)}</h4>
                ${opt.description ? `<p>${escapeHTML(opt.description)}</p>` : ''}
              </div>
            </li>`
            )
            .join('')}
        </ul>
      </section>`
      )
      .join('');
  }

  /* ---- Our Work: filter + lightbox ---- */
  function initGallery(grid) {
    const filterGroup = $('[data-gallery-filter]');
    const count = $('[data-gallery-count]');
    const items = $$('.work-item', grid);
    const lightbox = $('[data-lightbox]');

    function applyFilter(filter) {
      let visible = 0;
      items.forEach((item) => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.hidden = !show;
        if (show) visible += 1;
      });
      grid.classList.toggle('is-filtered', filter !== 'all');
      if (count) count.textContent = `${visible} ${visible === 1 ? 'project' : 'projects'}`;
    }

    if (filterGroup) {
      const chips = $$('[data-filter]', filterGroup);
      chips.forEach((chip) => {
        on(chip, 'click', () => {
          chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
          applyFilter(chip.dataset.filter);
        });
      });
    }
    applyFilter('all');

    if (!lightbox || typeof lightbox.showModal !== 'function') return;
    const img = $('[data-lightbox-img]', lightbox);
    const caption = $('[data-lightbox-caption]', lightbox);
    let index = 0;

    const visibleButtons = () => items.filter((item) => !item.hidden).map((item) => $('[data-lightbox-open]', item));

    function show(i) {
      const buttons = visibleButtons();
      if (!buttons.length) return;
      index = (i + buttons.length) % buttons.length;
      const button = buttons[index];
      const thumb = $('img', button);
      const title = $('.work-item__title', button);
      const cat = $('.work-item__cat', button);
      img.src = button.dataset.full;
      img.alt = thumb ? thumb.alt : '';
      caption.textContent = [title && title.textContent, cat && cat.textContent].filter(Boolean).join(' — ');
    }

    items.forEach((item) => {
      const button = $('[data-lightbox-open]', item);
      on(button, 'click', () => {
        show(visibleButtons().indexOf(button));
        lightbox.showModal();
      });
    });

    on($('[data-lightbox-close]', lightbox), 'click', () => lightbox.close());
    on($('[data-lightbox-prev]', lightbox), 'click', () => show(index - 1));
    on($('[data-lightbox-next]', lightbox), 'click', () => show(index + 1));
    on(lightbox, 'keydown', (event) => {
      if (event.key === 'ArrowLeft') show(index - 1);
      if (event.key === 'ArrowRight') show(index + 1);
    });
    // Click on the backdrop area closes
    on(lightbox, 'click', (event) => {
      if (event.target === lightbox || event.target.classList.contains('lightbox__inner')) lightbox.close();
    });
  }

  /* ---- Contact form ---- */
  function initContactForm(form) {
    const status = $('[data-form-status]', form);
    const submit = $('[data-submit]', form);
    let sending = false;

    $$('.field__input', form).forEach((input) => {
      on(input, 'input', () => {
        if (input.getAttribute('aria-invalid') === 'true') validateField(input);
      });
      on(input, 'blur', () => {
        if (input.value.trim()) validateField(input);
      });
    });

    on(form, 'submit', async (event) => {
      event.preventDefault();
      if (sending) return;
      const fields = $$('.field__input', form);
      const invalid = fields.filter((field) => !validateField(field));
      if (invalid.length) {
        invalid[0].focus();
        return;
      }

      const data = new FormData(form);
      const payload = {
        firstName: String(data.get('firstName') || '').trim(),
        lastName: String(data.get('lastName') || '').trim(),
        email: String(data.get('email') || '').trim(),
        phone: String(data.get('phone') || '').trim(),
        topic: String(data.get('topic') || ''),
        message: String(data.get('message') || '').trim(),
        createdAt: new Date().toISOString(),
      };

      sending = true;
      setButtonLoading(submit, true);
      status.hidden = true;
      try {
        const result = await submitContactMessage(payload);
        status.hidden = false;
        if (result.mode === 'development' && SITE_CONFIG.showDevNotes) {
          status.className = 'form-status is-dev';
          status.textContent = 'Development mode: this message was NOT sent because CONTACT_ENDPOINT is not configured in main.js. The payload was logged to the console.';
        } else {
          status.className = 'form-status is-success';
          status.textContent = 'Thank you — your message was sent. Our team will be in touch soon.';
          form.reset();
        }
      } catch (error) {
        console.error('[Contact] Message failed to send', error);
        status.hidden = false;
        status.className = 'form-status is-error';
        status.textContent = "We couldn't send your message. Please check your connection and try again.";
      } finally {
        sending = false;
        setButtonLoading(submit, false);
      }
    });
  }

  /* ===================================================================
     9. IMAGE UPLOAD (reusable component)
     =================================================================== */

  /**
   * Creates a photo uploader bound to [data-uploader] markup.
   * Files stay in memory as File objects; previews use object URLs that
   * are revoked on remove/replace/reset. Nothing is uploaded here — the
   * submission adapter sends files only when an endpoint exists.
   */
  function createUploader(root, { group, onChange = () => {} }) {
    const input = $('[data-uploader-input]', root);
    const camera = $('[data-uploader-camera]', root);
    const replaceInput = $('[data-uploader-replace]', root);
    const list = $('[data-uploader-list]', root);
    const status = $('[data-uploader-status]', root);
    const errorEl = $('[data-uploader-error]', root);
    const maxBytes = UPLOAD_RULES.maxFileSizeMB * 1024 * 1024;

    let items = [];
    let replaceTargetId = null;

    function validateFile(file) {
      const ext = (file.name.split('.').pop() || '').toLowerCase();
      const typeOk = UPLOAD_RULES.acceptedTypes.includes(file.type) || UPLOAD_RULES.acceptedExtensions.includes(ext);
      if (!typeOk) return `“${file.name}” isn’t a supported image. Please use JPG, PNG or WEBP.`;
      if (file.size === 0) return `“${file.name}” appears to be empty.`;
      if (file.size > maxBytes) return `“${file.name}” is larger than ${UPLOAD_RULES.maxFileSizeMB} MB. Please choose a smaller photo.`;
      return null;
    }

    function showErrors(errors) {
      if (!errorEl) return;
      errorEl.hidden = !errors.length;
      errorEl.textContent = errors.join(' ');
    }

    function updateStatus() {
      if (!status) return;
      if (!items.length) {
        status.textContent = '';
        return;
      }
      const total = items.reduce((sum, item) => sum + item.file.size, 0);
      status.textContent = `${items.length} of ${UPLOAD_RULES.maxFiles} ${items.length === 1 ? 'photo' : 'photos'} added · ${formatBytes(total)}`;
    }

    function itemMarkup(item) {
      const name = escapeHTML(item.file.name);
      return `
        <img class="upload-item__thumb" src="${item.url}" alt="" width="200" height="150" decoding="async">
        <div class="upload-item__meta">
          <span class="upload-item__name" title="${name}">${name}</span>
          <span class="upload-item__size">${formatBytes(item.file.size)}</span>
        </div>
        <div class="upload-item__actions">
          <button class="upload-item__btn" type="button" data-action="replace" aria-label="Replace ${name}">${icon('refresh')}</button>
          <button class="upload-item__btn" type="button" data-action="remove" aria-label="Remove ${name}">${icon('trash')}</button>
        </div>`;
    }

    function appendItem(item) {
      const li = document.createElement('li');
      li.className = 'upload-item';
      li.dataset.id = item.id;
      li.innerHTML = itemMarkup(item);
      list.appendChild(li);
    }

    function changed() {
      updateStatus();
      onChange(items.slice());
    }

    function addFiles(fileList) {
      const errors = [];
      Array.from(fileList || []).forEach((file) => {
        if (items.length >= UPLOAD_RULES.maxFiles) {
          if (!errors.some((e) => e.startsWith('You can add'))) errors.push(`You can add up to ${UPLOAD_RULES.maxFiles} photos.`);
          return;
        }
        const error = validateFile(file);
        if (error) {
          errors.push(error);
          return;
        }
        const duplicate = items.some(
          (item) => item.file.name === file.name && item.file.size === file.size && item.file.lastModified === file.lastModified
        );
        if (duplicate) {
          errors.push(`“${file.name}” has already been added.`);
          return;
        }
        const item = { id: uid(), group, file, url: URL.createObjectURL(file) };
        items.push(item);
        appendItem(item);
      });
      showErrors(errors);
      changed();
    }

    function removeItem(id) {
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) return;
      const [item] = items.splice(index, 1);
      URL.revokeObjectURL(item.url);
      const li = $(`[data-id="${id}"]`, list);
      const nextLi = li && (li.nextElementSibling || li.previousElementSibling);
      if (li) li.remove();
      showErrors([]);
      changed();
      // Keep keyboard focus somewhere sensible.
      const focusTarget = nextLi ? $('[data-action="remove"]', nextLi) : input;
      if (focusTarget) focusTarget.focus({ preventScroll: true });
      if (status) status.textContent = `Removed ${item.file.name}. ${status.textContent}`;
    }

    function replaceItem(id, file) {
      const item = items.find((i) => i.id === id);
      if (!item) return;
      const error = validateFile(file);
      if (error) {
        showErrors([error]);
        return;
      }
      URL.revokeObjectURL(item.url);
      item.file = file;
      item.url = URL.createObjectURL(file);
      const li = $(`[data-id="${id}"]`, list);
      if (li) li.innerHTML = itemMarkup(item);
      showErrors([]);
      changed();
      const btn = li && $('[data-action="replace"]', li);
      if (btn) btn.focus({ preventScroll: true });
    }

    on(input, 'change', () => {
      addFiles(input.files);
      input.value = ''; // allow choosing the same file again
    });
    on(camera, 'change', () => {
      addFiles(camera.files);
      camera.value = '';
    });
    on(replaceInput, 'change', () => {
      if (replaceTargetId && replaceInput.files[0]) replaceItem(replaceTargetId, replaceInput.files[0]);
      replaceTargetId = null;
      replaceInput.value = '';
    });

    on(list, 'click', (event) => {
      const button = event.target.closest('[data-action]');
      if (!button) return;
      const id = button.closest('.upload-item').dataset.id;
      if (button.dataset.action === 'remove') removeItem(id);
      if (button.dataset.action === 'replace' && replaceInput) {
        replaceTargetId = id;
        replaceInput.click();
      }
    });

    // Desktop drag & drop
    let dragDepth = 0;
    on(root, 'dragenter', (event) => {
      if (!hasFiles(event)) return;
      event.preventDefault();
      dragDepth += 1;
      root.classList.add('is-dragover');
    });
    on(root, 'dragover', (event) => {
      if (!hasFiles(event)) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
    });
    on(root, 'dragleave', () => {
      dragDepth = Math.max(0, dragDepth - 1);
      if (!dragDepth) root.classList.remove('is-dragover');
    });
    on(root, 'drop', (event) => {
      if (!hasFiles(event)) return;
      event.preventDefault();
      dragDepth = 0;
      root.classList.remove('is-dragover');
      addFiles(event.dataTransfer.files);
    });

    return {
      group,
      getItems: () => items.slice(),
      reset() {
        items.forEach((item) => URL.revokeObjectURL(item.url));
        items = [];
        list.innerHTML = '';
        showErrors([]);
        changed();
      },
    };
  }

  function hasFiles(event) {
    return Boolean(event.dataTransfer && Array.from(event.dataTransfer.types || []).includes('Files'));
  }

  /* ===================================================================
     10. ESTIMATE STATE
     =================================================================== */

  function createInitialState() {
    return {
      currentStep: 'project',
      furthestStep: 'project',
      products: [], // ESTIMATE_PRODUCTS ids, in flow order
      contact: { firstName: '', lastName: '', email: '', phone: '', preferredContact: '' },
      address: { street: '', line2: '', city: '', region: '', postalCode: '' },
      answers: {}, // question id → value / [values]
      uploads: [], // { id, group (product id), file, url } — File objects are never persisted
    };
  }

  const estimateState = createInitialState();

  function hasProgress() {
    const s = estimateState;
    return Boolean(
      s.products.length ||
        Object.values(s.contact).some(Boolean) ||
        Object.values(s.address).some(Boolean)
    );
  }

  /** Persists non-file answers to this device only. */
  function saveEstimateDraft() {
    if (!hasProgress()) return;
    try {
      const { uploads, ...rest } = estimateState;
      const draft = {
        v: 2,
        savedAt: Date.now(),
        state: rest,
        photoCount: uploads.length,
      };
      window.localStorage.setItem(SITE_CONFIG.draftStorageKey, JSON.stringify(draft));
    } catch (error) {
      /* Storage may be unavailable (private mode / quota) — the estimate still works. */
    }
  }

  function loadEstimateDraft() {
    try {
      const raw = window.localStorage.getItem(SITE_CONFIG.draftStorageKey);
      if (!raw) return null;
      const draft = JSON.parse(raw);
      const maxAge = SITE_CONFIG.draftMaxAgeDays * 24 * 60 * 60 * 1000;
      if (!draft || draft.v !== 2 || !draft.state || Date.now() - draft.savedAt > maxAge) {
        clearEstimateDraft();
        return null;
      }
      return draft;
    } catch (error) {
      return null;
    }
  }

  function clearEstimateDraft() {
    try {
      window.localStorage.removeItem(SITE_CONFIG.draftStorageKey);
    } catch (error) {
      /* ignore */
    }
  }

  /** Copies only known, correctly-typed values from a stored draft. */
  function applyDraft(saved) {
    const base = createInitialState();
    const str = (v) => (typeof v === 'string' ? v : '');
    const pick = (defaults, source) => {
      const out = { ...defaults };
      Object.keys(defaults).forEach((key) => {
        if (source && typeof source[key] === typeof defaults[key]) out[key] = source[key];
      });
      return out;
    };

    estimateState.products = Array.isArray(saved.products) ? orderProducts(saved.products) : [];
    estimateState.contact = pick(base.contact, saved.contact);
    estimateState.address = pick(base.address, saved.address);
    estimateState.answers = {};
    if (saved.answers && typeof saved.answers === 'object') {
      Object.keys(saved.answers).forEach((id) => {
        const value = saved.answers[id];
        const ok = typeof value === 'string' || (Array.isArray(value) && value.every((v) => typeof v === 'string'));
        if (QUESTION_BY_ID.has(id) && ok) estimateState.answers[id] = value;
      });
    }
    estimateState.currentStep = str(saved.currentStep) || 'project';
    estimateState.furthestStep = str(saved.furthestStep) || estimateState.currentStep;
  }

  /* ===================================================================
     11. ESTIMATE VALIDATION
     =================================================================== */

  const FIELD_NAMES = {
    'contact.firstName': 'your first name',
    'contact.lastName': 'your last name',
    'contact.email': 'your email address',
    'contact.phone': 'your phone number',
    'address.street': 'your street address',
    'address.city': 'your city',
    'address.region': 'your state or region',
    'address.postalCode': 'your ZIP or postal code',
    firstName: 'your first name',
    lastName: 'your last name',
    email: 'your email address',
    message: 'a short message',
  };

  const VALIDATORS = {
    required: (value, name) => String(value ?? '').trim() !== '' || `Please enter ${name || 'this field'}.`,
    email: (value) =>
      !String(value).trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value).trim()) || 'Please enter a valid email address, like name@example.com.',
    phone: (value) => {
      if (!String(value).trim()) return true;
      const digits = String(value).replace(/\D/g, '');
      return (digits.length >= 7 && digits.length <= 15) || 'Please enter a valid phone number.';
    },
    postal: (value) =>
      !String(value).trim() || /^[A-Za-z0-9][A-Za-z0-9 -]{1,9}$/.test(String(value).trim()) || 'Please enter a valid ZIP or postal code.',
  };

  function errorElementFor(field) {
    const ids = (field.getAttribute('aria-describedby') || '').split(/\s+/);
    const id = ids.find((x) => x.endsWith('-error'));
    return id ? document.getElementById(id) : null;
  }

  function showFieldError(field, message) {
    field.setAttribute('aria-invalid', 'true');
    const error = errorElementFor(field);
    if (error) {
      error.textContent = message;
      error.classList.add('is-visible');
    }
    const qty = field.closest('.qty');
    if (qty) qty.classList.add('is-invalid');
  }

  function clearFieldError(field) {
    field.removeAttribute('aria-invalid');
    const error = errorElementFor(field);
    if (error) {
      error.textContent = '';
      error.classList.remove('is-visible');
    }
    const qty = field.closest('.qty');
    if (qty) qty.classList.remove('is-invalid');
  }

  /** Runs the validators listed in data-validate (space-separated). */
  function validateField(field) {
    const rules = (field.dataset.validate || '').split(/\s+/).filter(Boolean);
    if (!rules.length) return true;
    const key = field.dataset.bind || field.name;
    for (const rule of rules) {
      const validator = VALIDATORS[rule];
      if (!validator) continue;
      const result = validator(field.value, FIELD_NAMES[key]);
      if (result !== true) {
        showFieldError(field, result);
        return false;
      }
    }
    clearFieldError(field);
    return true;
  }

  /* ===================================================================
     12. ESTIMATE NAVIGATION
     =================================================================== */

  /**
   * Flow definition. Product pages come from ESTIMATE_PRODUCTS (one page per
   * "HIT NEXT" in Erin's script); `when` decides whether a step applies.
   */
  const ESTIMATE_STEPS = [
    { id: 'project', phase: 'Project', choices: ['products'] },
    { id: 'contact', phase: 'Contact' },
    { id: 'location', phase: 'Contact' },
    ...FLOW_PAGES.map((page) => ({
      id: page.id,
      phase: productById(page.product).label,
      product: page.product,
      photos: page.photos ? page.product : null,
      when: (s) => pageApplies(page, s),
    })),
    { id: 'review', phase: 'Submit' },
  ];

  const getActiveSteps = () => ESTIMATE_STEPS.filter((step) => !step.when || step.when(estimateState));
  const stepIndex = (id, steps = getActiveSteps()) => steps.findIndex((step) => step.id === id);

  function initEstimator(root) {
    const form = $('[data-est-form]', root);
    if (!form) return;

    const nextBtn = $('[data-est-next]', form);
    const nextLabel = $('[data-est-next-label]', form);
    const backBtn = $('[data-est-back]', form);
    const phasesEl = $('[data-est-phases]', root);
    const progressFill = $('[data-est-progress-fill]');
    const confirmation = $('[data-est-confirmation]', root);
    const submitError = $('[data-submit-error]', form);
    const banner = $('[data-draft-banner]', root);
    const uploaders = {};
    let editing = null; // { until: stepId } while editing from the review screen
    let isSubmitting = false;

    const stepEl = (id) => $(`[data-step="${id}"]`, form);
    const reachedIndex = () => stepIndex(estimateState.furthestStep);
    const answers = () => estimateState.answers;
    const applies = (q) => questionApplies(q, estimateState);

    /* ===================================================================
       Rendering — every product page is built from ESTIMATE_PRODUCTS
       =================================================================== */

    // Project step: one checkbox card per product (customers can choose several).
    const productHost = $('[data-render="products"]', form);
    if (productHost) {
      productHost.innerHTML = ESTIMATE_PRODUCTS.map(
        (p) => `
        <label class="option-card option-card--media option-card--product">
          <input class="option-card__input" type="checkbox" name="products" value="${escapeHTML(p.id)}">
          <span class="option-card__media"><img src="${escapeHTML(p.card.image)}" alt="" width="640" height="427" loading="lazy" decoding="async"></span>
          <span class="option-card__body">
            <span class="option-card__title">${escapeHTML(p.label)}</span>
            <span class="option-card__text">${escapeHTML(p.card.text)}</span>
          </span>
          <span class="option-card__check" aria-hidden="true">${icon('check')}</span>
        </label>`
      ).join('');
    }

    function introMarkup(intro) {
      if (!intro) return '';
      return `
        <aside class="est-intro">${icon(intro.icon || 'sparkle')}<div>
          <p class="est-intro__title">${escapeHTML(intro.title)}</p>
          ${intro.text ? `<p>${escapeHTML(intro.text)}</p>` : ''}
        </div></aside>`;
    }

    function photosMarkup(group, photos) {
      const tips = (photos.tips || []).map(([name, text]) => `<li>${icon(name)} ${escapeHTML(text)}</li>`).join('');
      const accept = 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp';
      return `
        ${tips ? `<ul class="photo-tips" role="list">${tips}</ul>` : ''}
        <div class="uploader" data-uploader="${group}">
          <input class="uploader__input visually-hidden" id="${group}-photos-input" type="file" accept="${accept}" multiple data-uploader-input aria-describedby="${group}-photos-help">
          <label class="uploader__zone" for="${group}-photos-input" data-uploader-zone>
            <span class="uploader__icon">${icon('upload')}</span>
            <span class="uploader__title"><span class="only-fine">Drag photos here or <span class="uploader__link">browse your files</span></span><span class="only-coarse">Tap to choose photos</span></span>
            <span class="uploader__meta" id="${group}-photos-help">JPG, PNG or WEBP · up to ${UPLOAD_RULES.maxFileSizeMB}&nbsp;MB each · up to ${UPLOAD_RULES.maxFiles} photos</span>
          </label>
          <input class="visually-hidden uploader__camera-input" id="${group}-photos-camera" type="file" accept="image/*" capture="environment" data-uploader-camera>
          <label class="btn btn--secondary btn--block uploader__camera" for="${group}-photos-camera">${icon('camera')} Take a photo</label>
          <p class="uploader__status" data-uploader-status aria-live="polite"></p>
          <p class="uploader__error" data-uploader-error role="alert" hidden></p>
          <ul class="upload-list" role="list" data-uploader-list></ul>
          <input class="visually-hidden" type="file" accept="${accept}" data-uploader-replace tabindex="-1" aria-hidden="true">
        </div>
        <p class="skip-note" data-skip-note>No photos handy? You can continue and share them later.</p>`;
    }

    function optionMedia(opt) {
      if (opt.image) return `<span class="option-card__media"><img src="${escapeHTML(opt.image)}" alt="" width="640" height="427" loading="lazy" decoding="async"></span>`;
      if (opt.swatch) return `<span class="option-card__media bq-swatch" data-bg="${escapeHTML(opt.swatch)}" aria-hidden="true"></span>`;
      return '';
    }

    function renderQuestion(q, { asTitle = false } = {}) {
      const id = escapeHTML(q.id);
      const wrap = `data-bq-wrap="${id}"${q.showIf ? ' hidden' : ''}`;
      const num = asTitle ? '' : '<span class="bq__num" aria-hidden="true"></span>';
      const optional = q.required || asTitle ? '' : ' <span class="field__optional">Optional</span>';

      if (q.type === 'note') {
        return `
          <div class="bq bq--note" ${wrap}>
            <span class="bq-note__icon">${icon('info')}</span>
            <div><p>${escapeHTML(q.label)}</p>${q.more ? `<p>${escapeHTML(q.more)}</p>` : ''}</div>
          </div>`;
      }

      if (q.type === 'text' || q.type === 'textarea') {
        const control =
          q.type === 'textarea'
            ? `<textarea class="field__input field__textarea" id="bq-${id}" rows="4" maxlength="2000" data-bq="${id}"></textarea>`
            : `<input class="field__input" id="bq-${id}" type="text" maxlength="160" data-bq="${id}">`;
        return `
          <div class="bq bq--text" ${wrap}>
            <label class="${asTitle ? 'visually-hidden' : 'bq__label'}" for="bq-${id}">${num}${escapeHTML(q.label)}${optional}</label>
            ${q.hint && !asTitle ? `<p class="bq__hint">${escapeHTML(q.hint)}</p>` : ''}
            <div class="bq__options bq__options--text">${control}</div>
          </div>`;
      }

      const layout = q.layout || 'list';
      const inputType = q.type === 'multi' ? 'checkbox' : 'radio';
      const options = (q.options || [])
        .map((opt) => {
          const rowIcon = layout === 'list' && opt.icon ? `<span class="option-card__row-icon">${icon(opt.icon)}</span>` : '';
          return `
            <label class="option-card bq-opt${layout === 'list' ? ' option-card--row' : ' option-card--media'}${q.fit === 'contain' ? ' option-card--contain' : ''}">
              <input class="option-card__input" type="${inputType}" name="bq-${id}" value="${escapeHTML(opt.id)}" data-bq="${id}">
              ${optionMedia(opt)}${rowIcon}
              <span class="option-card__body"><span class="option-card__title">${escapeHTML(opt.label)}</span></span>
              <span class="option-card__check" aria-hidden="true">${icon('check')}</span>
            </label>`;
        })
        .join('');
      return `
        <fieldset class="bq bq--${layout}" ${wrap}>
          <legend class="${asTitle ? 'visually-hidden' : 'bq__label'}">${num}${escapeHTML(q.label)}${optional}</legend>
          ${q.hint && !asTitle ? `<p class="bq__hint">${escapeHTML(q.hint)}</p>` : ''}
          ${q.provisional ? '<p class="dev-note">Placeholder options — replace with the client&rsquo;s own photos.</p>' : ''}
          <div class="bq__options bq__options--${layout}">${options}</div>
        </fieldset>`;
    }

    const reviewStep = stepEl('review');
    FLOW_PAGES.forEach((page) => {
      const questions = FLOW_QUESTIONS.filter((q) => q.page === page.id);
      const lead = page.titleQuestion ? questions[0] : null;
      const title = lead ? lead.label : page.title;
      const desc = page.desc || (lead && lead.hint) || '';
      const section = document.createElement('section');
      section.className = 'est-step';
      section.dataset.step = page.id;
      section.hidden = true;
      section.setAttribute('aria-labelledby', `st-${page.id}`);
      section.innerHTML = `
        <header class="est-step__header">
          <p class="est-step__kicker" data-step-kicker></p>
          ${introMarkup(page.intro)}
          <h2 class="est-step__title" id="st-${page.id}" tabindex="-1">${escapeHTML(title)}</h2>
          ${desc ? `<p class="est-step__desc">${escapeHTML(desc)}</p>` : ''}
        </header>
        <div class="est-step__body">
          ${page.photos ? photosMarkup(page.product, page.photos) : ''}
          ${questions.length ? `<div class="bq-list${page.photos ? ' bq-list--after-photos' : ''}">${questions.map((q) => renderQuestion(q, { asTitle: q === lead })).join('')}</div>` : ''}
        </div>
        <p class="step-error" data-step-error role="alert"></p>`;
      reviewStep.before(section);
    });
    $$('.bq-swatch', form).forEach((el) => {
      el.style.background = el.dataset.bg;
      el.removeAttribute('data-bg');
    });

    /* ---- Answers ---- */
    function refreshVisibility() {
      FLOW_QUESTIONS.forEach((q) => {
        if (!q.showIf) return;
        const wrap = $(`[data-bq-wrap="${q.id}"]`, form);
        if (wrap) wrap.hidden = !applies(q);
      });
    }

    function syncFlowInputs() {
      $$('[data-bq]', form).forEach((input) => {
        const value = answers()[input.dataset.bq];
        if (input.type === 'checkbox') input.checked = Array.isArray(value) && value.includes(input.value);
        else if (input.type === 'radio') input.checked = value === input.value;
        else input.value = value || '';
      });
      $$('.bq-opt', form).forEach((card) => card.classList.toggle('is-selected', $('input', card).checked));
      refreshVisibility();
    }

    function onFlowInput(event) {
      const input = event.target.closest('[data-bq]');
      if (!input) return;
      const id = input.dataset.bq;
      if (input.type === 'checkbox') {
        answers()[id] = $$(`[data-bq="${id}"]:checked`, form).map((i) => i.value);
      } else if (input.type === 'radio') {
        if (!input.checked) return;
        answers()[id] = input.value;
      } else {
        answers()[id] = input.value;
      }
      $$(`[data-bq="${id}"]`, form).forEach((i) => {
        const card = i.closest('.bq-opt');
        if (card) card.classList.toggle('is-selected', i.checked);
      });
      refreshVisibility();
      clearStepError(input.closest('.est-step'));
      onStateChange(`answers.${id}`);
    }
    on(form, 'change', onFlowInput);
    on(form, 'input', (event) => {
      if (event.target.matches('input[type="text"][data-bq], textarea[data-bq]')) onFlowInput(event);
    });

    /* ---- Products (project step) ---- */
    function syncProductCards() {
      $$('input[name="products"]', form).forEach((input) => {
        input.checked = estimateState.products.includes(input.value);
        input.closest('.option-card').classList.toggle('is-selected', input.checked);
      });
    }
    on(form, 'change', (event) => {
      if (!event.target.matches('input[name="products"]')) return;
      estimateState.products = orderProducts($$('input[name="products"]:checked', form).map((i) => i.value));
      syncProductCards();
      onStateChange('products');
    });

    /* ---- Uploaders (one per product photo page) ---- */
    $$('[data-uploader]', form).forEach((el) => {
      const group = el.dataset.uploader;
      uploaders[group] = createUploader(el, {
        group,
        onChange: () => {
          estimateState.uploads = Object.values(uploaders).flatMap((u) => u.getItems());
          updateActions();
          renderSummary();
          updateSkipNotes();
          saveDraftSoon();
        },
      });
    });

    // Stop the browser from opening a file dropped outside a drop zone.
    on(window, 'dragover', (event) => hasFiles(event) && event.preventDefault());
    on(window, 'drop', (event) => hasFiles(event) && event.preventDefault());

    /* ---- Field binding (contact + address) ---- */
    // Drafts are only written after the homeowner actually interacts with the form.
    let dirty = false;
    let submitted = false; // set after a server-confirmed submission — never re-save a draft after that
    const saveDraftSoon = debounce(() => dirty && !submitted && saveEstimateDraft(), 300);

    function onStateChange(path) {
      dirty = true;
      if (path === 'products') {
        editing = null; // a new set of projects means walking through the new steps
        clearStepError(stepEl('project'));
      }
      updateChrome();
      renderSummary();
      saveDraftSoon();
    }

    $$('[data-bind]', form).forEach((field) => {
      const path = field.dataset.bind;
      const isChoice = field.type === 'radio' || field.type === 'checkbox';
      on(field, isChoice ? 'change' : 'input', () => {
        if (isChoice && !field.checked) return;
        setPath(estimateState, path, field.value);
        if (isChoice) {
          syncChoiceCards(field.name, form);
          clearStepError(field.closest('.est-step'));
        } else if (field.getAttribute('aria-invalid') === 'true') {
          validateField(field);
        }
        onStateChange(path);
      });
      if (!isChoice && field.dataset.validate) {
        on(field, 'blur', () => {
          if (String(field.value).trim()) validateField(field);
        });
      }
    });

    function syncFormFromState() {
      $$('[data-bind]', form).forEach((field) => {
        const value = getPath(estimateState, field.dataset.bind);
        if (field.type === 'radio') field.checked = value === field.value;
        else field.value = value == null ? '' : String(value);
      });
      new Set($$('input[type="radio"][data-bind]', form).map((r) => r.name)).forEach((name) => syncChoiceCards(name, form));
      syncProductCards();
      syncFlowInputs();
    }

    /* ---- Step-level validation ---- */
    function clearStepError(step) {
      const error = step && $('[data-step-error]', step);
      if (error) {
        error.textContent = '';
        error.classList.remove('is-visible');
      }
    }

    function validateStep(id, { focus = true } = {}) {
      const step = stepEl(id);
      const config = ESTIMATE_STEPS.find((s) => s.id === id);
      if (!step || !config) return true;

      const invalidFields = $$('[data-validate]', step).filter((field) => !validateField(field));
      const missingChoice = (config.choices || []).find((name) => !$(`input[name="${name}"]:checked`, step));
      const missingAnswer = FLOW_QUESTIONS.find(
        (q) => q.page === id && q.required && q.type !== 'note' && applies(q) && !hasAnswer(answers()[q.id])
      );

      const error = $('[data-step-error]', step);
      if (missingChoice && error) {
        error.textContent = id === 'project' ? 'Please choose at least one project to continue.' : 'Please choose an option to continue.';
        error.classList.add('is-visible');
      } else if (missingAnswer && error) {
        error.textContent = `Please answer: “${missingAnswer.label.replace(/[.?:]$/, '')}”`;
        error.classList.add('is-visible');
      } else {
        clearStepError(step);
      }

      if (focus) {
        if (invalidFields.length) invalidFields[0].focus();
        else if (missingChoice) {
          const first = $(`input[name="${missingChoice}"]`, step);
          if (first) first.focus();
        } else if (missingAnswer) {
          const first = $(`[data-bq="${missingAnswer.id}"]`, step);
          if (first) {
            first.closest('.bq').scrollIntoView({ block: 'center', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
            first.focus({ preventScroll: true });
          }
        }
      }
      return !invalidFields.length && !missingChoice && !missingAnswer;
    }

    /* ---- Chrome: progress, phases, kicker, buttons ---- */
    function updateChrome() {
      const steps = getActiveSteps();
      const index = stepIndex(estimateState.currentStep, steps);
      const chosen = estimateState.products.length > 0;
      const total = chosen ? steps.length : 12;

      // Progress bar (transform only — cheap to animate)
      if (progressFill) progressFill.style.transform = `scaleX(${Math.max(0.04, (index + 1) / total)})`;

      // Kicker
      const current = steps[index];
      const kicker = current && $('[data-step-kicker]', stepEl(current.id));
      if (kicker) {
        const page = PAGE_BY_ID.get(current.id);
        const label = page ? page.kicker || productById(page.product).label : current.phase;
        kicker.textContent = chosen ? `${label} · Step ${index + 1} of ${steps.length}` : 'Getting started';
      }

      // Phase indicator
      if (phasesEl) {
        const phases = [];
        steps.forEach((step) => {
          if (!phases.includes(step.phase)) phases.push(step.phase);
        });
        if (!chosen) phases.splice(phases.length - 1, 0, 'Details');
        const currentPhase = current ? current.phase : 'Project';
        const currentPhaseIndex = phases.indexOf(currentPhase);
        phasesEl.classList.toggle('is-many', phases.length > 5);
        phasesEl.innerHTML = phases
          .map((phase, i) => {
            const state = i < currentPhaseIndex ? 'done' : i === currentPhaseIndex ? 'current' : 'upcoming';
            const dot = state === 'done' ? icon('check') : String(i + 1);
            return `<li class="est-phase" data-state="${state}"${state === 'current' ? ' aria-current="step"' : ''}><span class="est-phase__dot">${dot}</span><span class="est-phase__label">${escapeHTML(phase)}</span><span class="visually-hidden"> (${state === 'done' ? 'completed' : state === 'current' ? 'current' : 'upcoming'})</span></li>`;
          })
          .join('');
        // Narrow phones scroll the phase row: keep the current phase in view
        const cur = $('.est-phase[data-state="current"]', phasesEl);
        if (cur && phasesEl.scrollWidth > phasesEl.clientWidth) phasesEl.scrollLeft = Math.max(0, cur.offsetLeft - phasesEl.offsetLeft - 8);
      }

      updateActions();
    }

    function updateActions() {
      const steps = getActiveSteps();
      const id = estimateState.currentStep;
      const index = stepIndex(id, steps);
      const config = steps[index];
      const page = PAGE_BY_ID.get(id);
      backBtn.classList.toggle('is-hidden', index <= 0);
      backBtn.disabled = index <= 0;

      let label = 'Continue';
      if (id === 'review') label = 'Submit';
      else if (editing && editing.until === id) label = 'Save & Review';
      else if (config && config.photos && !(page.questions || []).length && !estimateState.uploads.some((u) => u.group === config.photos)) label = 'Skip for Now';
      nextLabel.textContent = label;
    }

    function updateSkipNotes() {
      $$('[data-skip-note]', form).forEach((note) => {
        const uploader = $('[data-uploader]', note.closest('.est-step'));
        const group = uploader && uploader.dataset.uploader;
        note.hidden = estimateState.uploads.some((u) => u.group === group);
      });
    }

    /* ---- Step transitions ---- */
    function animateStepIn(step, direction) {
      if (!step.animate) return;
      const distance = prefersReducedMotion() ? 0 : direction === 'back' ? -14 : 14;
      step.animate(
        [
          { opacity: 0, transform: `translateX(${distance}px)` },
          { opacity: 1, transform: 'translateX(0)' },
        ],
        { duration: 260, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }
      );
    }

    function goToStep(id, { direction = 'forward', push = true, focus = true } = {}) {
      const steps = getActiveSteps();
      const target = steps.find((step) => step.id === id) || steps[0];
      const previous = stepEl(estimateState.currentStep);
      const next = stepEl(target.id);

      $$('.est-step', form).forEach((step) => {
        step.hidden = step !== next;
      });

      estimateState.currentStep = target.id;
      if (stepIndex(target.id, steps) > reachedIndex()) estimateState.furthestStep = target.id;

      if (target.id === 'review') renderReview();
      if (submitError) submitError.hidden = true;

      updateChrome();
      if (previous !== next) animateStepIn(next, direction);

      if (push) {
        try {
          window.history.pushState({ estimateStep: target.id }, '', `#step-${target.id}`);
        } catch (error) {
          /* file:// or sandboxed contexts */
        }
      }

      if (focus) {
        const top = form.getBoundingClientRect().top + window.scrollY - 88;
        if (window.scrollY > top) window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
        const heading = $('.est-step__title', next);
        if (heading) heading.focus({ preventScroll: true });
      }
      saveDraftSoon();
    }

    function goNext() {
      dirty = true;
      const steps = getActiveSteps();
      const id = estimateState.currentStep;
      if (id === 'review') {
        handleSubmit();
        return;
      }
      if (!validateStep(id)) return;
      const index = stepIndex(id, steps);
      if (editing) {
        const endIndex = stepIndex(editing.until, steps);
        if (endIndex !== -1 && index >= endIndex) {
          editing = null;
          goToStep('review');
          return;
        }
      }
      const next = steps[index + 1];
      if (next) goToStep(next.id, { direction: 'forward' });
    }

    function goBack() {
      const steps = getActiveSteps();
      const index = stepIndex(estimateState.currentStep, steps);
      if (index > 0) goToStep(steps[index - 1].id, { direction: 'back' });
    }

    on(form, 'submit', (event) => {
      event.preventDefault();
      goNext();
    });
    on(backBtn, 'click', goBack);

    on(window, 'popstate', (event) => {
      const id = event.state && event.state.estimateStep;
      if (!id || (confirmation && !confirmation.hidden)) return;
      const steps = getActiveSteps();
      const target = stepIndex(id, steps);
      if (target === -1 || target > reachedIndex()) return;
      const direction = target < stepIndex(estimateState.currentStep, steps) ? 'back' : 'forward';
      goToStep(id, { direction, push: false });
    });

    /* ---- Summary (sidebar + mobile) ---- */
    // Rows "stamp" (brief highlight) when they first appear, or when a choice changes.
    const STAMP_ON_CHANGE = new Set(['Projects']);
    let lastSummary = null;

    const productLabels = (s) => s.products.map((id) => productById(id).label);
    const projectTitle = (s) => {
      const labels = productLabels(s);
      if (!labels.length) return 'Let’s get started';
      return labels.length <= 2 ? labels.join(' + ') : `${labels.length} projects`;
    };
    const projectImages = (s) => s.products.slice(0, 2).map((id) => productById(id).card.image);

    function renderSummary() {
      const s = estimateState;
      const items = [];
      if (s.products.length) items.push(['Projects', escapeHTML(productLabels(s).join(', '))]);
      const name = [s.contact.firstName, s.contact.lastName].filter(Boolean).join(' ');
      if (name) items.push(['Name', escapeHTML(name)]);
      const place = [s.address.city, s.address.region].filter(Boolean).join(', ');
      if (place) items.push(['Location', escapeHTML(place)]);
      const answered = answerList(s);
      const focus = answered.find((a) => a.id === 'focus');
      if (focus) items.push(['Bathroom', escapeHTML(focus.answer)]);
      s.products.forEach((id) => {
        const n = s.uploads.filter((u) => u.group === id).length;
        if (n) items.push([`${escapeHTML(productById(id).label)} photos`, String(n)]);
      });

      const previous = lastSummary;
      lastSummary = Object.fromEntries(items);
      const markup = items
        .map(([dt, dd]) => {
          const fresh = previous && (!(dt in previous) || (STAMP_ON_CHANGE.has(dt) && previous[dt] !== dd));
          return `<div class="summary-item${fresh ? ' is-new' : ''}"><dt>${dt}</dt><dd>${dd}</dd></div>`;
        })
        .join('');
      $$('[data-summary-list]', root).forEach((list) => {
        list.innerHTML = markup;
      });
      $$('[data-summary-count]', root).forEach((el) => {
        el.textContent = items.length ? String(items.length) : '';
      });

      const title = $('[data-summary-title]', root);
      if (title) title.textContent = projectTitle(s);

      const media = $('[data-summary-media]', root);
      if (media) {
        const srcs = projectImages(s);
        const key = srcs.join('|');
        if (media.dataset.key !== key) {
          media.dataset.key = key;
          media.classList.toggle('is-split', srcs.length > 1);
          media.innerHTML = srcs.length
            ? srcs.map((src) => `<img src="${src}" alt="" width="640" height="427" decoding="async">`).join('')
            : `<span class="summary-card__placeholder" aria-hidden="true">${icon('home')}</span>`;
        }
      }
    }

    /* ===================================================================
       13. REVIEW RENDERING
       =================================================================== */

    function reviewGroups() {
      const s = estimateState;
      const dash = '<span class="review-empty">Not provided</span>';
      const val = (v) => (String(v || '').trim() ? escapeHTML(v) : dash);
      const groups = [
        {
          title: 'You & your home',
          start: 'contact',
          until: 'location',
          rows: [
            ['Name', val([s.contact.firstName, s.contact.lastName].filter(Boolean).join(' '))],
            ['Phone', val(s.contact.phone)],
            ['Email', val(s.contact.email)],
            ['Best way to reach you', s.contact.preferredContact ? escapeHTML(CONTACT_METHODS[s.contact.preferredContact]) : 'No preference'],
            ['Address', val([s.address.street, s.address.line2, s.address.city, [s.address.region, s.address.postalCode].filter(Boolean).join(' ')].filter(Boolean).join(', ')), true],
          ],
        },
      ];

      const answered = answerList(s);
      const active = getActiveSteps();
      s.products.forEach((id) => {
        const product = productById(id);
        const pageIds = active.filter((st) => st.product === id).map((st) => st.id);
        answerSections(answered, pageIds).forEach((section) => {
          groups.push({
            title: section.title,
            start: section.start,
            until: section.until,
            rows: section.rows.map((a) => [escapeHTML(a.question), escapeHTML(a.answer), a.long]),
          });
        });
        const photoStep = active.find((st) => st.product === id && st.photos);
        if (photoStep) groups.push({ title: `${product.label} photos`, start: photoStep.id, photos: id });
      });
      return groups;
    }

    /** Top of the review: what the project is, at a glance. */
    function reviewSummary() {
      const s = estimateState;
      const imgs = projectImages(s);
      const chips = productLabels(s).map((label) => escapeHTML(label));
      const photoCount = s.uploads.filter((u) => s.products.includes(u.group)).length;
      chips.push(`${photoCount} ${photoCount === 1 ? 'photo' : 'photos'}`);
      const name = [s.contact.firstName, s.contact.lastName].filter(Boolean).join(' ');
      const place = [s.address.street, s.address.city].filter(Boolean).join(', ');
      return `
        <div class="review-hero">
          <div class="review-hero__media${imgs.length > 1 ? ' is-split' : ''}">${imgs.map((src) => `<img src="${src}" alt="" width="640" height="427" decoding="async">`).join('')}</div>
          <div class="review-hero__body">
            <p class="review-hero__kicker">Your project</p>
            <p class="review-hero__title">${escapeHTML(projectTitle(s))}</p>
            ${name || place ? `<p class="review-hero__for">${[name && `For ${escapeHTML(name)}`, place && escapeHTML(place)].filter(Boolean).join(' · ')}</p>` : ''}
            <ul class="review-hero__chips" role="list">${chips.map((c) => `<li>${c}</li>`).join('')}</ul>
          </div>
        </div>`;
    }

    function renderReview() {
      const container = $('[data-review]', form);
      if (!container) return;
      const sections = reviewGroups()
        .map((group, i) => {
          let body = '';
          if (group.photos) {
            const photos = estimateState.uploads.filter((u) => u.group === group.photos);
            body = photos.length
              ? `<div class="review-photos">${photos.map((p) => `<img src="${p.url}" alt="${escapeHTML(p.file.name)}" width="72" height="72">`).join('')}</div>`
              : '<p class="review-empty">No photos yet &mdash; that&rsquo;s okay, you can share them later.</p>';
          } else {
            body = `<dl class="review-list">${group.rows
              .map(([dt, dd, long]) => `<div class="review-row${long ? ' review-row--long' : ''}"><dt>${dt}</dt><dd>${dd}</dd></div>`)
              .join('')}</dl>`;
          }
          return `
            <li class="review-sec">
              <div class="review-sec__head">
                <span class="review-sec__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
                <h3 class="review-sec__title" id="rg-${i}">${escapeHTML(group.title)}</h3>
                <button class="review-sec__edit" type="button" data-edit="${group.start}" data-edit-until="${group.until || group.start}" aria-label="Edit ${escapeHTML(group.title)}">Edit</button>
              </div>
              <div class="review-sec__body">${body}</div>
            </li>`;
        })
        .join('');
      container.innerHTML = `${reviewSummary()}<ol class="review-secs" role="list">${sections}</ol>`;
    }

    on(form, 'click', (event) => {
      const button = event.target.closest('[data-edit]');
      if (!button) return;
      editing = { until: button.dataset.editUntil };
      goToStep(button.dataset.edit, { direction: 'back' });
    });

    /* ---- Submission ---- */
    function setSubmitting(active) {
      isSubmitting = active;
      setButtonLoading(nextBtn, active);
      nextLabel.textContent = active ? 'Sending…' : 'Submit';
      backBtn.disabled = active;
    }

    async function handleSubmit() {
      if (isSubmitting) return; // no double submissions

      // Re-check every active step before sending anything.
      const steps = getActiveSteps().filter((step) => step.id !== 'review');
      for (const step of steps) {
        if (!validateStep(step.id, { focus: false })) {
          goToStep(step.id, { direction: 'back' });
          validateStep(step.id);
          return;
        }
      }

      submitError.hidden = true;
      setSubmitting(true);
      const payload = buildEstimatePayload();
      const files = estimateState.uploads
        .filter((u) => estimateState.products.includes(u.group))
        .map((u) => ({ group: u.group, file: u.file }));

      try {
        const result = await submitEstimate(payload, files);
        showConfirmation(result, payload);
      } catch (error) {
        console.error('[Estimate] Submission failed', error);
        submitError.hidden = false;
        submitError.textContent =
          'We couldn’t send your project just now. Please check your connection and try again — your answers and photos are still here.';
        submitError.setAttribute('tabindex', '-1');
        submitError.focus();
      } finally {
        setSubmitting(false);
        updateActions();
      }
    }

    function showConfirmation(result, payload) {
      // The dev frame is a warning for the team; hidden with the other dev notes.
      const isDev = result.mode === 'development' && SITE_CONFIG.showDevNotes;
      form.hidden = true;
      if (banner) banner.hidden = true;
      confirmation.hidden = false;
      confirmation.classList.toggle('is-dev', isDev);
      $('[data-confirm-dev]', confirmation).hidden = !isDev;
      $('[data-confirm-name]', confirmation).textContent = estimateState.contact.firstName ? `, ${estimateState.contact.firstName}` : '';
      if (isDev) $('[data-confirm-payload]', confirmation).textContent = JSON.stringify(payload, null, 2);

      if (progressFill) progressFill.style.transform = 'scaleX(1)';
      if (phasesEl) $$('.est-phase', phasesEl).forEach((li) => {
        li.dataset.state = 'done';
        li.removeAttribute('aria-current');
        $('.est-phase__dot', li).innerHTML = icon('check');
      });

      if (result.mode !== 'development' || !SITE_CONFIG.showDevNotes) {
        // Finished: forget the draft so the next visit starts fresh. Only the team's dev preview
        // (showDevNotes on, with its "Back to review" button) keeps the answers for checking.
        submitted = true;
        clearEstimateDraft();
        Object.values(uploaders).forEach((u) => u.reset());
      }

      window.scrollTo({ top: 0, behavior: 'auto' });
      confirmation.focus({ preventScroll: true });
      requestAnimationFrame(() => {
        confirmation.classList.add('is-shown');
        burstConfetti($('[data-confetti]', confirmation));
      });
      try {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      } catch (error) {
        /* ignore */
      }
    }

    on($('[data-confirm-back]', confirmation), 'click', () => {
      confirmation.hidden = true;
      confirmation.classList.remove('is-shown');
      form.hidden = false;
      goToStep('review', { direction: 'back' });
    });

    /* ---- Start over / Save & exit ---- */
    function resetEstimate() {
      submitted = false;
      clearEstimateDraft();
      Object.values(uploaders).forEach((u) => u.reset());
      Object.assign(estimateState, createInitialState());
      editing = null;
      form.reset();
      $$('[data-bind]', form).forEach((field) => field.removeAttribute('aria-invalid'));
      $$('.field__error', form).forEach((el) => {
        el.textContent = '';
        el.classList.remove('is-visible');
      });
      $$('[data-step-error]', form).forEach((el) => clearStepError(el.closest('.est-step')));
      syncFormFromState();
      if (banner) banner.hidden = true;
      confirmation.hidden = true;
      form.hidden = false;
      renderSummary();
      goToStep('project', { direction: 'back', push: false });
      try {
        window.history.replaceState({ estimateStep: 'project' }, '', '#step-project');
      } catch (error) {
        /* ignore */
      }
    }

    const restartDialog = $('[data-dialog="restart"]');
    const exitDialog = $('[data-dialog="exit"]');

    $$('[data-est-restart]').forEach((button) =>
      on(button, 'click', () => {
        if (restartDialog && typeof restartDialog.showModal === 'function') restartDialog.showModal();
        else if (window.confirm('Start over? This clears your answers and photos from this device.')) resetEstimate();
      })
    );
    on(restartDialog, 'close', () => {
      if (restartDialog.returnValue === 'confirm') resetEstimate();
      restartDialog.returnValue = '';
    });

    on($('[data-est-exit]'), 'click', () => {
      if (!hasProgress()) {
        window.location.href = 'index.html';
        return;
      }
      if (exitDialog && typeof exitDialog.showModal === 'function') exitDialog.showModal();
      else {
        saveEstimateDraft();
        window.location.href = 'index.html';
      }
    });
    on(exitDialog, 'close', () => {
      if (exitDialog.returnValue === 'confirm') {
        saveEstimateDraft();
        window.location.href = 'index.html';
      }
      exitDialog.returnValue = '';
    });

    // Flush pending draft writes when the tab is hidden or closed.
    on(document, 'visibilitychange', () => document.visibilityState === 'hidden' && dirty && !submitted && confirmation.hidden && saveEstimateDraft());
    on(window, 'pagehide', () => dirty && !submitted && confirmation.hidden && saveEstimateDraft());

    /* ---- Boot: restore draft, apply ?project=, show first step ---- */
    const draft = loadEstimateDraft();
    if (draft) {
      applyDraft(draft.state);
      if (hasProgress() && banner) {
        banner.hidden = false;
        const photosNote = $('[data-draft-photos]', banner);
        if (photosNote) photosNote.hidden = !draft.photoCount;
      }
    }

    // ?project=bath, ?project=windows,doors … ("both" = bathroom + windows, from older links)
    const requested = new URLSearchParams(window.location.search).get('project');
    if (!estimateState.products.length && requested) {
      estimateState.products = orderProducts(requested === 'both' ? ['bath', 'windows'] : requested.split(','));
    }

    syncFormFromState();
    renderSummary();
    updateSkipNotes();

    const startId = stepIndex(estimateState.currentStep) === -1 ? 'project' : estimateState.currentStep;
    if (stepIndex(estimateState.furthestStep) === -1) estimateState.furthestStep = startId;
    goToStep(startId, { push: false, focus: false });
    try {
      window.history.replaceState({ estimateStep: startId }, '', `#step-${startId}`);
    } catch (error) {
      /* ignore */
    }

    // Expose read-only helpers for QA / CMS integration.
    window.InstallDEstimate = {
      state: estimateState,
      buildPayload: buildEstimatePayload,
      steps: () => getActiveSteps().map((s) => s.id),
      products: ESTIMATE_PRODUCTS,
    };
  }

  /* ===================================================================
     14. SUBMISSION ADAPTER
     -------------------------------------------------------------------
     When a real backend is ready, only submitEstimate() (and optionally
     submitContactMessage()) should need to change.
     =================================================================== */

  function buildEstimatePayload() {
    const s = estimateState;
    const answered = answerList(s);
    const active = getActiveSteps();

    return {
      contact: {
        firstName: s.contact.firstName.trim(),
        lastName: s.contact.lastName.trim(),
        email: s.contact.email.trim(),
        phone: s.contact.phone.trim(),
        preferredContact: s.contact.preferredContact || null,
      },
      address: {
        street: s.address.street.trim(),
        line2: s.address.line2.trim(),
        city: s.address.city.trim(),
        region: s.address.region.trim(),
        postalCode: s.address.postalCode.trim(),
      },
      // Organized by product, then by section, for the email (client ask: "organized by area").
      projects: s.products.map((id) => {
        const pageIds = active.filter((st) => st.product === id).map((st) => st.id);
        return {
          id,
          product: productById(id).label,
          sections: answerSections(answered, pageIds).map((section) => ({
            section: section.title,
            answers: section.rows.map(({ question, answer }) => ({ question, answer })),
          })),
          photoCount: s.uploads.filter((u) => u.group === id).length,
        };
      }),
      photos: s.uploads
        .filter((u) => s.products.includes(u.group))
        .map((u) => ({ group: u.group, name: u.file.name, size: u.file.size, type: u.file.type })),
      source: { form: 'online-estimate', page: window.location.pathname },
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Sends an estimate. Development mode (no endpoint) NEVER reports a
   * server success — it returns { mode: 'development' } so the UI can show
   * a clearly-marked preview.
   *
   * Production contract (adjust to the real backend):
   *   POST multipart/form-data → fields: payload (JSON string),
   *   photos_windows[] / photos_bath[] (image files). Expect 2xx on success.
   */
  async function submitEstimate(payload, files = []) {
    if (!SUBMISSION_ENDPOINT) {
      console.info('[Estimate] Development mode — SUBMISSION_ENDPOINT is empty, nothing was sent.', { payload, files });
      return { ok: true, mode: 'development', payload };
    }

    const body = new FormData();
    body.append('payload', JSON.stringify(payload));
    files.forEach(({ group, file }) => body.append(`photos_${group}[]`, file, file.name));

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 90000);
    try {
      const response = await fetch(SUBMISSION_ENDPOINT, {
        method: 'POST',
        body,
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`Submission failed with status ${response.status}`);
      let data = null;
      try {
        data = await response.json();
      } catch (error) {
        /* Non-JSON 2xx responses are still a success */
      }
      return { ok: true, mode: 'production', data };
    } finally {
      window.clearTimeout(timeout);
    }
  }

  async function submitContactMessage(payload) {
    if (!CONTACT_ENDPOINT) {
      console.info('[Contact] Development mode — CONTACT_ENDPOINT is empty, nothing was sent.', payload);
      return { ok: true, mode: 'development' };
    }
    const response = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`Contact request failed with status ${response.status}`);
    return { ok: true, mode: 'production' };
  }

  /* ===================================================================
     15. UTILITIES
     =================================================================== */

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /** A one-off burst of small "window pane" confetti from the host's center. */
  function burstConfetti(host) {
    if (!host || prefersReducedMotion() || typeof host.animate !== 'function') return;
    host.innerHTML = '';
    const palette = ['#7FD2FE', '#0D71A5', '#A3DFFF', '#C4EAFF', '#1B1B41', '#FFFFFF'];
    const count = 30;
    for (let i = 0; i < count; i += 1) {
      const piece = document.createElement('span');
      const size = 6 + Math.random() * 7;
      piece.className = 'confetti';
      piece.style.width = `${size}px`;
      piece.style.height = `${size * (0.6 + Math.random() * 0.7)}px`;
      piece.style.background = palette[i % palette.length];
      host.appendChild(piece);
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const distance = 90 + Math.random() * 140;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance * 0.8 - 20;
      const spin = Math.random() * 480 - 240;
      piece.animate(
        [
          { transform: 'translate(-50%, -50%) scale(0.6) rotate(0deg)', opacity: 1 },
          { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1) rotate(${spin}deg)`, opacity: 1, offset: 0.65 },
          { transform: `translate(calc(-50% + ${x * 1.08}px), calc(-50% + ${y + 80}px)) scale(0.9) rotate(${spin * 1.6}deg)`, opacity: 0 },
        ],
        { duration: 1300 + Math.random() * 500, delay: 560 + Math.random() * 120, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'both' }
      );
    }
  }

  function debounce(fn, wait) {
    let timer;
    return function debounced(...args) {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  let uidCounter = 0;
  function uid() {
    uidCounter += 1;
    return `u${Date.now().toString(36)}${uidCounter}`;
  }

  function lockScroll() {
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.setProperty('--scrollbar-comp', `${scrollbar}px`);
    document.body.classList.add('is-scroll-locked');
  }

  function unlockScroll() {
    document.body.classList.remove('is-scroll-locked');
    document.body.style.removeProperty('--scrollbar-comp');
  }

  function setButtonLoading(button, loading) {
    if (!button) return;
    button.classList.toggle('is-loading', loading);
    button.disabled = loading;
    button.setAttribute('aria-busy', String(loading));
  }

  /* Keeps the last two words of longer headings together, so a heading never
     ends on a single orphaned word. Runs before the heading animations (which
     keep whitespace as text, so the non-breaking space survives them). */
  function initHeadingWidows(scope = document) {
    $$('h1, h2, h3', scope).forEach((h) => {
      if (h.dataset.widowFixed || h.textContent.trim().split(/\s+/).length < 4) return;
      const walker = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
      let last = null;
      while (walker.nextNode()) if (walker.currentNode.data.trim()) last = walker.currentNode;
      if (!last) return;
      const trimmed = last.data.replace(/\s+$/, '');
      const i = trimmed.search(/\s+\S+$/);
      if (i > 0) last.data = trimmed.slice(0, i) + ' ' + trimmed.slice(i).trim() + last.data.slice(trimmed.length);
      h.dataset.widowFixed = '1';
    });
  }

  /* ===================================================================
     16. INITIALIZATION
     =================================================================== */

  function init() {
    initDevNotes();
    initPlaceholderSections();
    initConfigContact();
    initYear();

    // Content renderers first, so later components see the final DOM.
    renderDataDriven();
    initHeadingWidows();
    initDiagrams();

    const header = $('[data-site-header]');
    if (header) initHeader(header);
    initMobileNav();

    $$('[data-accordion]').forEach(initAccordion);
    $$('[data-tabs]').forEach(initTabs);
    $$('[data-compare]').forEach(initCompare);

    const reviews = $('[data-reviews]');
    if (reviews && !initScrollTrack(reviews)) initReviews(reviews);

    const process = $('[data-process]');
    if (process) initProcess(process);

    $$('[data-tour]').forEach(initTour);
    $$('[data-hero]').forEach(initHeroScroll);
    $$('[data-stats]').forEach(initStats);
    $$('[data-expand]').forEach(initExpand);
    $$('[data-services]').forEach(initServices);
    $$('[data-steps]').forEach(initSteps);
    $$('.quote-track').forEach(initDragScroll);
    $$('[data-word-reveal]').forEach(initWordReveal);

    const viz = $('[data-color-viz]');
    if (viz) initColorVisualizer(viz);

    const bathShowcase = $('[data-bath-options]');
    if (bathShowcase) initBathShowcase(bathShowcase);

    const gallery = $('[data-gallery]');
    if (gallery) initGallery(gallery);

    const contactForm = $('[data-contact-form]');
    if (contactForm) initContactForm(contactForm);

    const estimator = $('[data-estimator]');
    if (estimator) initEstimator(estimator);

    initReveal();
    initSplitHeadlines();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
