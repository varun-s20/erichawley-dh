<?php
/**
 * The estimate's content: products → pages → questions → options.
 *
 * Stored as one JSON option, edited in Estimate → Builder, and printed for the
 * front end as window.SITE_ESTIMATE_PRODUCTS (via the theme's
 * `dh_estimate_products` filter). data/default-products.json — exported from the
 * approved prototype — is the starting point and the fallback if nothing is saved.
 *
 * Image paths are either Media Library URLs or theme-relative "assets/…" paths
 * (the built-in photos), which are resolved against the active theme on output.
 */
defined( 'ABSPATH' ) || exit;

const DH_EST_PRODUCTS_OPTION = 'dh_estimate_products';

function dh_est_default_products() {
	static $defaults = null;
	if ( null === $defaults ) {
		$json     = file_get_contents( DH_EST_DIR . 'data/default-products.json' ); // phpcs:ignore WordPress.WP.AlternativeFunctions
		$defaults = json_decode( (string) $json, true ) ?: array();
	}
	return $defaults;
}

/** The saved products, or the defaults when nothing has been saved yet. */
function dh_est_products() {
	$saved = get_option( DH_EST_PRODUCTS_OPTION, '' );
	$data  = $saved ? json_decode( (string) $saved, true ) : null;
	return is_array( $data ) && $data ? $data : dh_est_default_products();
}

function dh_est_save_products( array $products ) {
	$clean = dh_est_sanitize_products( $products );
	update_option( DH_EST_PRODUCTS_OPTION, wp_json_encode( $clean ), false );
	return $clean;
}

/* ---------------------------------------------------------------------------
 * Front end: hand the products to the theme with image paths resolved.
 * ------------------------------------------------------------------------- */
add_filter( 'dh_estimate_products', function () {
	return dh_est_resolve_images( dh_est_products() );
} );

function dh_est_image_url( $path ) {
	if ( ! $path ) {
		return '';
	}
	if ( preg_match( '#^assets/#', $path ) ) {
		return trailingslashit( get_template_directory_uri() ) . $path;
	}
	return $path;
}

function dh_est_resolve_images( array $products ) {
	foreach ( $products as &$product ) {
		if ( ! empty( $product['card']['image'] ) ) {
			$product['card']['image'] = dh_est_image_url( $product['card']['image'] );
		}
		foreach ( $product['pages'] as &$page ) {
			foreach ( $page['questions'] as &$q ) {
				// Loop by key: `foreach ( $q['options'] ?? array() as &$opt )` would
				// reference a temporary copy and the resolved URLs would be lost.
				if ( empty( $q['options'] ) || ! is_array( $q['options'] ) ) {
					continue;
				}
				foreach ( array_keys( $q['options'] ) as $i ) {
					if ( ! empty( $q['options'][ $i ]['image'] ) ) {
						$q['options'][ $i ]['image'] = dh_est_image_url( $q['options'][ $i ]['image'] );
					}
				}
			}
			unset( $q );
		}
		unset( $page );
	}
	unset( $product );
	return $products;
}

/* ---------------------------------------------------------------------------
 * Sanitising: keep only the known shape; every string cleaned.
 * ------------------------------------------------------------------------- */
function dh_est_s_text( $v, $long = false ) {
	$v = is_scalar( $v ) ? (string) $v : '';
	return $long ? sanitize_textarea_field( $v ) : sanitize_text_field( $v );
}

function dh_est_s_id( $v ) {
	return substr( preg_replace( '/[^A-Za-z0-9_-]/', '', (string) $v ), 0, 60 );
}

/** Theme-relative "assets/…" path or an http(s) URL. */
function dh_est_s_image( $v ) {
	$v = trim( (string) $v );
	if ( preg_match( '#^assets/[A-Za-z0-9/_.-]+$#', $v ) ) {
		return $v;
	}
	return esc_url_raw( $v, array( 'http', 'https' ) );
}

/** CSS colour / gradient used for swatches: a conservative character whitelist (no url(), no ;). */
function dh_est_s_swatch( $v ) {
	$v = trim( (string) $v );
	if ( '' === $v || preg_match( '/url\s*\(|expression|[;{}<>"\'\\\\]/i', $v ) ) {
		return '';
	}
	return preg_match( '/^[#A-Za-z0-9(),.%\/ \-]+$/', $v ) ? substr( $v, 0, 400 ) : '';
}

/** A show-if rule: { q, in: [] } or an array of them. Always saved as an array. */
function dh_est_s_condition( $c ) {
	if ( ! $c ) {
		return null;
	}
	$list = isset( $c['q'] ) ? array( $c ) : (array) $c;
	$out  = array();
	foreach ( $list as $rule ) {
		if ( ! is_array( $rule ) || empty( $rule['q'] ) ) {
			continue;
		}
		$values = array_values( array_filter( array_map( 'dh_est_s_id', (array) ( $rule['in'] ?? array() ) ) ) );
		if ( $values ) {
			$out[] = array( 'q' => dh_est_s_id( $rule['q'] ), 'in' => $values );
		}
	}
	return $out ?: null;
}

function dh_est_sanitize_products( array $products ) {
	$types   = array( 'single', 'multi', 'text', 'textarea', 'number', 'note' );
	$layouts = array( 'list', 'cards', 'swatches' );
	$out     = array();
	foreach ( array_slice( $products, 0, 30 ) as $p ) {
		if ( ! is_array( $p ) || empty( $p['id'] ) ) {
			continue;
		}
		$product = array(
			'id'    => dh_est_s_id( $p['id'] ),
			'label' => dh_est_s_text( $p['label'] ?? '' ),
			'card'  => array(
				'text'  => dh_est_s_text( $p['card']['text'] ?? '' ),
				'image' => dh_est_s_image( $p['card']['image'] ?? '' ),
			),
			'pages' => array(),
		);
		foreach ( array_slice( (array) ( $p['pages'] ?? array() ), 0, 60 ) as $pg ) {
			if ( ! is_array( $pg ) || empty( $pg['id'] ) ) {
				continue;
			}
			$page = array(
				'id'        => dh_est_s_id( $pg['id'] ),
				'title'     => dh_est_s_text( $pg['title'] ?? '' ),
				'questions' => array(),
			);
			foreach ( array( 'kicker', 'review' ) as $k ) {
				if ( ! empty( $pg[ $k ] ) ) {
					$page[ $k ] = dh_est_s_text( $pg[ $k ] );
				}
			}
			if ( ! empty( $pg['desc'] ) ) {
				$page['desc'] = dh_est_s_text( $pg['desc'], true );
			}
			if ( ! empty( $pg['titleQuestion'] ) ) {
				$page['titleQuestion'] = true;
			}
			if ( ! empty( $pg['intro'] ) && is_array( $pg['intro'] ) && ( ! empty( $pg['intro']['title'] ) || ! empty( $pg['intro']['text'] ) ) ) {
				$page['intro'] = array(
					'icon'  => sanitize_key( $pg['intro']['icon'] ?? 'sparkle' ),
					'title' => dh_est_s_text( $pg['intro']['title'] ?? '' ),
					'text'  => dh_est_s_text( $pg['intro']['text'] ?? '', true ),
				);
			}
			// An uploader with no tips is stored as {} and decodes to an empty array — still "on".
			if ( array_key_exists( 'photos', $pg ) && null !== $pg['photos'] && false !== $pg['photos'] ) {
				$tips = array();
				foreach ( (array) ( $pg['photos']['tips'] ?? array() ) as $tip ) {
					if ( is_array( $tip ) && ! empty( $tip[1] ) ) {
						$tips[] = array( sanitize_key( $tip[0] ?? 'camera' ), dh_est_s_text( $tip[1] ) );
					}
				}
				$page['photos'] = $tips ? array( 'tips' => $tips ) : new stdClass();
			}
			$when = dh_est_s_condition( $pg['when'] ?? null );
			if ( $when ) {
				$page['when'] = $when;
			}
			foreach ( array_slice( (array) ( $pg['questions'] ?? array() ), 0, 60 ) as $q ) {
				if ( ! is_array( $q ) || empty( $q['id'] ) ) {
					continue;
				}
				$type     = in_array( $q['type'] ?? '', $types, true ) ? $q['type'] : 'single';
				$question = array(
					'id'    => dh_est_s_id( $q['id'] ),
					'label' => dh_est_s_text( $q['label'] ?? '', 'note' === $type ),
					'type'  => $type,
				);
				if ( in_array( $type, array( 'single', 'multi' ), true ) ) {
					$question['layout'] = in_array( $q['layout'] ?? '', $layouts, true ) ? $q['layout'] : 'list';
				}
				foreach ( array( 'review', 'hint' ) as $k ) {
					if ( ! empty( $q[ $k ] ) ) {
						$question[ $k ] = dh_est_s_text( $q[ $k ], 'hint' === $k );
					}
				}
				if ( ! empty( $q['more'] ) ) {
					$question['more'] = dh_est_s_text( $q['more'], true );
				}
				if ( 'number' === $type ) {
					foreach ( array( 'unit', 'unitOne' ) as $k ) {
						if ( ! empty( $q[ $k ] ) ) {
							$question[ $k ] = dh_est_s_text( $q[ $k ] );
						}
					}
					$picks = array_values( array_unique( array_filter( array_map( 'absint', (array) ( $q['picks'] ?? array() ) ), function ( $n ) {
						return $n > 0 && $n < 1000;
					} ) ) );
					if ( $picks ) {
						$question['picks'] = array_slice( $picks, 0, 12 );
					}
				}
				if ( ! empty( $q['required'] ) && 'note' !== $type ) {
					$question['required'] = true;
				}
				if ( ! empty( $q['provisional'] ) ) {
					$question['provisional'] = true;
				}
				if ( 'contain' === ( $q['fit'] ?? '' ) ) {
					$question['fit'] = 'contain';
				}
				$show = dh_est_s_condition( $q['showIf'] ?? null );
				if ( $show ) {
					$question['showIf'] = $show;
				}
				if ( isset( $question['layout'] ) ) {
					$question['options'] = array();
					foreach ( array_slice( (array) ( $q['options'] ?? array() ), 0, 120 ) as $o ) {
						if ( ! is_array( $o ) || empty( $o['id'] ) ) {
							continue;
						}
						$opt = array( 'id' => dh_est_s_id( $o['id'] ), 'label' => dh_est_s_text( $o['label'] ?? '' ) );
						$img = dh_est_s_image( $o['image'] ?? '' );
						if ( $img ) {
							$opt['image'] = $img;
						}
						$sw = dh_est_s_swatch( $o['swatch'] ?? '' );
						if ( $sw && ! $img ) {
							$opt['swatch'] = $sw;
						}
						if ( ! empty( $o['icon'] ) ) {
							$opt['icon'] = sanitize_key( $o['icon'] );
						}
						$question['options'][] = $opt;
					}
				}
				$page['questions'][] = $question;
			}
			$product['pages'][] = $page;
		}
		$out[] = $product;
	}
	return $out;
}

/* ---------------------------------------------------------------------------
 * REST: save / reset (admins only; the Builder page sends the wp_rest nonce).
 * ------------------------------------------------------------------------- */
add_action( 'rest_api_init', function () {
	$can = function () {
		return current_user_can( 'manage_options' );
	};
	register_rest_route( 'dh-estimate/v1', '/products', array(
		array(
			'methods'             => 'GET',
			'permission_callback' => $can,
			'callback'            => function () {
				return rest_ensure_response( dh_est_products() );
			},
		),
		array(
			'methods'             => 'POST',
			'permission_callback' => $can,
			'callback'            => function ( WP_REST_Request $request ) {
				$data = $request->get_json_params();
				if ( ! is_array( $data ) || ! $data ) {
					return new WP_Error( 'dh_bad', 'Nothing to save.', array( 'status' => 400 ) );
				}
				return rest_ensure_response( array( 'ok' => true, 'products' => dh_est_save_products( $data ) ) );
			},
		),
		array(
			'methods'             => 'DELETE',
			'permission_callback' => $can,
			'callback'            => function () {
				delete_option( DH_EST_PRODUCTS_OPTION );
				return rest_ensure_response( array( 'ok' => true, 'products' => dh_est_default_products() ) );
			},
		),
	) );
} );
