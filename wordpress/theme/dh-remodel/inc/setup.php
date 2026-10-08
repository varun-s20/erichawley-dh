<?php
/**
 * Theme supports, assets, <head> output and WordPress clean-up.
 */
defined( 'ABSPATH' ) || exit;

add_action( 'after_setup_theme', function () {
	add_theme_support( 'title-tag' );
	add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script' ) );
	add_theme_support( 'responsive-embeds' );
} );

/* ---------------------------------------------------------------------------
 * Assets: one stylesheet, one script for every page (as in the prototype).
 * ------------------------------------------------------------------------- */
add_action( 'wp_enqueue_scripts', function () {
	$dir = get_template_directory();
	$uri = get_template_directory_uri();

	wp_enqueue_style( 'dh-site', $uri . '/assets/css/styles.css', array(), filemtime( $dir . '/assets/css/styles.css' ) );
	wp_enqueue_script(
		'dh-site',
		$uri . '/assets/js/main.js',
		array(),
		filemtime( $dir . '/assets/js/main.js' ),
		array( 'strategy' => 'defer', 'in_footer' => false )
	);

	// Everything main.js reads from window, printed before it runs.
	$urls = array();
	foreach ( array_keys( dh_routes() ) as $route ) {
		$urls[ $route ] = dh_url( $route );
	}
	$config = apply_filters( 'dh_site_config', array(
		'brandName' => dh_brand(),
		'phone'     => dh_setting( 'phone', '(910) 617-9122' ),
		'email'     => dh_setting( 'public_email', '' ),
	) );
	$inline  = 'window.SITE_ASSET_BASE=' . wp_json_encode( trailingslashit( $uri ) ) . ';';
	$inline .= 'window.SITE_URLS=' . wp_json_encode( $urls ) . ';';
	$inline .= 'window.SITE_CONFIG_OVERRIDES=' . wp_json_encode( $config ) . ';';
	$products = apply_filters( 'dh_estimate_products', null );
	if ( is_array( $products ) && $products ) {
		$inline .= 'window.SITE_ESTIMATE_PRODUCTS=' . wp_json_encode( $products ) . ';';
	}
	wp_add_inline_script( 'dh-site', $inline, 'before' );

	// The design owns all styling: drop WordPress's block/global styles on the front end
	// so nothing paints over it (Privacy text is plain paragraphs and headings).
	wp_dequeue_style( 'wp-block-library' );
	wp_dequeue_style( 'wp-block-library-theme' );
	wp_dequeue_style( 'global-styles' );
	wp_dequeue_style( 'classic-theme-styles' );
}, 20 );

// Emoji scripts are not part of the design.
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );

/* ---------------------------------------------------------------------------
 * <head>: favicons, hero preload, titles and descriptions.
 * ------------------------------------------------------------------------- */
add_action( 'wp_head', function () {
	$a = trailingslashit( get_template_directory_uri() ) . 'assets/icons/';
	if ( ! has_site_icon() ) {
		echo '<link rel="icon" href="' . esc_url( $a . 'favicon-32.png' ) . '" sizes="32x32" type="image/png">' . "\n";
		echo '<link rel="apple-touch-icon" href="' . esc_url( $a . 'apple-touch-icon.png' ) . '">' . "\n";
	}
	$preload = dh_page_data( 'preload' );
	if ( $preload ) {
		// Generated from the prototype's own <link rel="preload">; {assets} is the theme folder.
		echo str_replace( '{assets}', esc_url( trailingslashit( get_template_directory_uri() ) ), $preload ) . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput -- static markup from the build
	}
	if ( ! defined( 'WPSEO_VERSION' ) ) {
		$desc = dh_page_data( 'description' );
		if ( $desc ) {
			echo '<meta name="description" content="' . esc_attr( $desc ) . '">' . "\n";
		}
	}
}, 2 );

// Page <title>: the prototype's title, unless Yoast (or the editor) supplies one.
add_filter( 'pre_get_document_title', function ( $title ) {
	if ( defined( 'WPSEO_VERSION' ) ) {
		return $title;
	}
	return dh_page_title() ?: $title;
} );

// With Yoast active, the prototype's title/description are the defaults until the owner
// writes their own in the Yoast box.
add_filter( 'wpseo_title', function ( $title ) {
	if ( is_singular() && get_post_meta( get_queried_object_id(), '_yoast_wpseo_title', true ) ) {
		return $title;
	}
	return dh_page_title() ?: $title;
} );
add_filter( 'wpseo_metadesc', function ( $desc ) {
	if ( $desc ) {
		return $desc;
	}
	return dh_page_data( 'description' ) ?: $desc;
} );
