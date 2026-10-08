<?php
/**
 * Template helpers used by the generated templates.
 * Every value that could change per install (brand, logo, URLs) goes through here.
 */
defined( 'ABSPATH' ) || exit;

/**
 * A site setting. The DH Estimate plugin answers this filter from its Settings
 * screen; without the plugin the theme falls back to the prototype's values.
 */
function dh_setting( $key, $default = '' ) {
	return apply_filters( 'dh_setting', $default, $key );
}

function dh_brand() {
	return dh_setting( 'brand_name', 'install-D Home Remodeling' );
}

function dh_brand_short() {
	return dh_setting( 'brand_short', 'install-D' );
}

function dh_brand_e() {
	echo esc_html( dh_brand() );
}

/** The short name; uppercase for the wide-tracked wordmark. */
function dh_brand_short_e( $upper = false ) {
	$name = dh_brand_short();
	echo esc_html( $upper ? ( function_exists( 'mb_strtoupper' ) ? mb_strtoupper( $name ) : strtoupper( $name ) ) : $name );
}

/** Logo URL: the uploaded logo from Settings, else the theme's emblem at the requested size. */
function dh_logo_url( $size = 128 ) {
	$custom = dh_setting( 'logo_url', '' );
	if ( $custom ) {
		return $custom;
	}
	$size = in_array( (int) $size, array( 128, 256, 512 ), true ) ? (int) $size : 128;
	return get_template_directory_uri() . "/assets/images/brand/installd-emblem-{$size}.webp";
}

/** Echo the theme folder URL with a trailing slash (templates append "assets/..."). */
function dh_assets() {
	echo esc_url( trailingslashit( get_template_directory_uri() ) );
}

/** Page slugs for the prototype's routes. */
function dh_routes() {
	return array(
		'index'        => '',
		'windows'      => 'windows',
		'bath-remodel' => 'bath-remodel',
		'our-work'     => 'our-work',
		'about'        => 'about',
		'contact'      => 'contact',
		'privacy'      => 'privacy-policy',
		'estimate'     => 'estimate',
	);
}

/**
 * URL for a prototype route, e.g. dh_url( 'estimate', '?project=bath' ).
 * Uses the real page permalink when the page exists, so a renamed slug still works.
 */
function dh_url( $route, $suffix = '' ) {
	$routes = dh_routes();
	if ( ! isset( $routes[ $route ] ) ) {
		return home_url( '/' );
	}
	$slug = $routes[ $route ];
	if ( '' === $slug ) {
		$url = home_url( '/' );
	} else {
		$page = get_page_by_path( $slug );
		$url  = $page ? get_permalink( $page ) : home_url( "/{$slug}/" );
	}
	if ( $suffix && '#' === $suffix[0] ) {
		return $url . $suffix;
	}
	return $suffix ? $url . $suffix : $url;
}

/** Route key of the page being viewed. */
function dh_current_route() {
	if ( is_front_page() ) {
		return 'index';
	}
	if ( is_404() ) {
		return '404';
	}
	if ( is_page() ) {
		$slug = get_post_field( 'post_name', get_queried_object_id() );
		$key  = array_search( $slug, dh_routes(), true );
		if ( false !== $key ) {
			return $key;
		}
	}
	return '';
}

/** Prints aria-current on the nav link for the current page. */
function dh_current( $route ) {
	if ( dh_current_route() === $route ) {
		echo ' aria-current="page"';
	}
}

/** Generated per-page data (title, description, preload, body attributes). */
function dh_page_data( $field = null ) {
	static $pages = null;
	if ( null === $pages ) {
		$pages = require __DIR__ . '/pages.php';
	}
	$route = dh_current_route();
	$data  = $pages[ $route ] ?? array( 'title' => '', 'description' => '', 'preload' => '', 'data_page' => 'page', 'overlay' => false );
	return null === $field ? $data : ( $data[ $field ] ?? '' );
}

/** The prototype's page title with the current brand filled in. */
function dh_page_title() {
	$title = dh_page_data( 'title' );
	if ( ! $title ) {
		return '';
	}
	return strtr( $title, array( '{brand}' => dh_brand(), '{short}' => dh_brand_short() ) );
}
