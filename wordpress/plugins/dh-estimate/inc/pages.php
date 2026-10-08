<?php
/**
 * Creates the site's pages on activation, so a fresh install has every page
 * and the home page set. Existing pages are never overwritten.
 */
defined( 'ABSPATH' ) || exit;

function dh_est_page_list() {
	return array(
		'home'           => 'Home',
		'windows'        => 'Windows',
		'bath-remodel'   => 'Bath Remodel',
		'our-work'       => 'Our Work',
		'about'          => 'About',
		'contact'        => 'Contact',
		'privacy-policy' => 'Privacy Policy',
		'estimate'       => 'Free Estimate',
	);
}

function dh_est_create_pages() {
	$ids = array();
	foreach ( dh_est_page_list() as $slug => $title ) {
		$existing = get_page_by_path( $slug );
		if ( $existing && 'publish' === $existing->post_status ) {
			$ids[ $slug ] = $existing->ID;
			continue;
		}
		if ( $existing && 'trash' !== $existing->post_status ) {
			// WordPress installs a *draft* "Privacy Policy" page with its own template text:
			// take it over (publish it with the design's policy) instead of creating a duplicate.
			$update = array( 'ID' => $existing->ID, 'post_status' => 'publish' );
			if ( 'privacy-policy' === $slug ) {
				$file = get_template_directory() . '/inc/privacy-default.html';
				if ( file_exists( $file ) ) {
					$update['post_content'] = (string) file_get_contents( $file );
				}
			}
			wp_update_post( $update );
			$ids[ $slug ] = $existing->ID;
			continue;
		}
		$content = '';
		if ( 'privacy-policy' === $slug ) {
			// Seed the policy with the design's text so the owner edits real copy, not a blank page.
			$file = get_template_directory() . '/inc/privacy-default.html';
			$content = file_exists( $file ) ? (string) file_get_contents( $file ) : '';
		}
		$ids[ $slug ] = wp_insert_post( array(
			'post_type'    => 'page',
			'post_status'  => 'publish',
			'post_title'   => $title,
			'post_name'    => $slug,
			'post_content' => $content,
		) );
	}

	// Static front page.
	if ( ! empty( $ids['home'] ) && ! is_wp_error( $ids['home'] ) ) {
		update_option( 'show_on_front', 'page' );
		update_option( 'page_on_front', (int) $ids['home'] );
	}
	if ( ! empty( $ids['privacy-policy'] ) && ! is_wp_error( $ids['privacy-policy'] ) ) {
		update_option( 'wp_page_for_privacy_policy', (int) $ids['privacy-policy'] );
	}
	// Pretty URLs (/windows/) — only if the site still uses the default "?p=123" links.
	if ( '' === get_option( 'permalink_structure' ) ) {
		update_option( 'permalink_structure', '/%postname%/' );
	}
}
