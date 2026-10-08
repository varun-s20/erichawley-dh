<?php
/**
 * Estimate submissions and contact messages.
 *
 *   POST /wp-json/dh-estimate/v1/estimate   multipart: payload (JSON), hp, elapsed, photos_<product>[]
 *   POST /wp-json/dh-estimate/v1/contact    JSON: firstName, lastName, email, phone, topic, message, hp, elapsed
 *
 * Every submission is saved first (so nothing is lost if email fails), then
 * emailed when Settings → "Send new estimates and messages to" is filled in.
 * Public endpoints, no nonce: the pages are cacheable and a nonce printed into
 * cached HTML expires and silently breaks the form. Spam is handled by the
 * honeypot, a time trap and a per-IP rate limit instead.
 */
defined( 'ABSPATH' ) || exit;

const DH_EST_MAX_PHOTOS    = 60;   // per submission, across all products
const DH_EST_MAX_PHOTO_MB  = 15;
const DH_EST_MIN_SECONDS   = 3;    // faster than this = a bot
const DH_EST_RATE_PER_HOUR = 8;    // submissions per IP per hour

/* ---------------------------------------------------------------------------
 * Entry types: private, only visible in wp-admin.
 * ------------------------------------------------------------------------- */
add_action( 'init', 'dh_est_register_types' );
function dh_est_register_types() {
	$common = array(
		'public'          => false,
		'show_ui'         => true,
		'show_in_menu'    => 'dh-estimate',
		'show_in_rest'    => false,
		'supports'        => array( 'title' ),
		'capability_type' => 'post',
		'map_meta_cap'    => true,
		'capabilities'    => array( 'create_posts' => 'do_not_allow' ), // created by customers only
	);
	register_post_type( 'dh_estimate', $common + array(
		'labels' => array(
			'name'          => 'Estimates',
			'singular_name' => 'Estimate',
			'menu_name'     => 'Estimates',
			'all_items'     => 'Estimates',
			'edit_item'     => 'Estimate',
			'view_item'     => 'View estimate',
			'search_items'  => 'Search estimates',
			'not_found'     => 'No estimates yet.',
		),
	) );
	register_post_type( 'dh_message', $common + array(
		'labels' => array(
			'name'          => 'Messages',
			'singular_name' => 'Message',
			'menu_name'     => 'Messages',
			'all_items'     => 'Messages',
			'edit_item'     => 'Message',
			'search_items'  => 'Search messages',
			'not_found'     => 'No messages yet.',
		),
	) );
}

/* ---------------------------------------------------------------------------
 * Tell the front end where to post (read by main.js as SITE_CONFIG).
 * ------------------------------------------------------------------------- */
add_filter( 'dh_site_config', function ( $config ) {
	$config['submissionEndpoint'] = rest_url( 'dh-estimate/v1/estimate' );
	$config['contactEndpoint']    = rest_url( 'dh-estimate/v1/contact' );
	return $config;
} );

add_action( 'rest_api_init', function () {
	register_rest_route( 'dh-estimate/v1', '/estimate', array(
		'methods'             => 'POST',
		'callback'            => 'dh_est_rest_estimate',
		'permission_callback' => '__return_true',
	) );
	register_rest_route( 'dh-estimate/v1', '/contact', array(
		'methods'             => 'POST',
		'callback'            => 'dh_est_rest_contact',
		'permission_callback' => '__return_true',
	) );
} );

/* ---------------------------------------------------------------------------
 * Spam guards.
 * ------------------------------------------------------------------------- */
function dh_est_client_ip() {
	return sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0' ) );
}

/** Returns a WP_Error for spam, true otherwise. Bots get a fake success so they don't retry. */
function dh_est_spam_check( $hp, $elapsed ) {
	if ( '' !== trim( (string) $hp ) ) {
		return new WP_Error( 'dh_spam', 'honeypot' );
	}
	if ( (int) $elapsed > 0 && (int) $elapsed < DH_EST_MIN_SECONDS * 1000 ) {
		return new WP_Error( 'dh_spam', 'too fast' );
	}
	$key   = 'dh_est_rate_' . md5( dh_est_client_ip() );
	$count = (int) get_transient( $key );
	if ( $count >= DH_EST_RATE_PER_HOUR ) {
		return new WP_Error( 'dh_rate', 'Too many submissions from this connection. Please try again later.', array( 'status' => 429 ) );
	}
	set_transient( $key, $count + 1, HOUR_IN_SECONDS );
	return true;
}

/* ---------------------------------------------------------------------------
 * Helpers: sanitising the estimate payload.
 * ------------------------------------------------------------------------- */
function dh_est_clean_text( $value, $long = false ) {
	$value = is_scalar( $value ) ? (string) $value : '';
	return $long ? sanitize_textarea_field( $value ) : sanitize_text_field( $value );
}

/** Keeps only the known shape of main.js's payload, every string sanitised. */
function dh_est_clean_payload( $raw ) {
	$c  = (array) ( $raw['contact'] ?? array() );
	$a  = (array) ( $raw['address'] ?? array() );
	$out = array(
		'contact' => array(
			'firstName'        => dh_est_clean_text( $c['firstName'] ?? '' ),
			'lastName'         => dh_est_clean_text( $c['lastName'] ?? '' ),
			'email'            => sanitize_email( $c['email'] ?? '' ),
			'phone'            => dh_est_clean_text( $c['phone'] ?? '' ),
			'preferredContact' => dh_est_clean_text( $c['preferredContact'] ?? '' ),
		),
		'address' => array(
			'street'     => dh_est_clean_text( $a['street'] ?? '' ),
			'line2'      => dh_est_clean_text( $a['line2'] ?? '' ),
			'city'       => dh_est_clean_text( $a['city'] ?? '' ),
			'region'     => dh_est_clean_text( $a['region'] ?? '' ),
			'postalCode' => dh_est_clean_text( $a['postalCode'] ?? '' ),
		),
		'projects' => array(),
	);
	foreach ( array_slice( (array) ( $raw['projects'] ?? array() ), 0, 20 ) as $p ) {
		$p        = (array) $p;
		$project  = array(
			'id'       => sanitize_key( $p['id'] ?? '' ),
			'product'  => dh_est_clean_text( $p['product'] ?? '' ),
			'sections' => array(),
		);
		foreach ( array_slice( (array) ( $p['sections'] ?? array() ), 0, 50 ) as $s ) {
			$s       = (array) $s;
			$section = array( 'section' => dh_est_clean_text( $s['section'] ?? '' ), 'answers' => array() );
			foreach ( array_slice( (array) ( $s['answers'] ?? array() ), 0, 80 ) as $ans ) {
				$ans                  = (array) $ans;
				$section['answers'][] = array(
					'question' => dh_est_clean_text( $ans['question'] ?? '' ),
					'answer'   => dh_est_clean_text( $ans['answer'] ?? '', true ),
				);
			}
			$project['sections'][] = $section;
		}
		if ( $project['id'] ) {
			$out['projects'][] = $project;
		}
	}
	return $out;
}

/* ---------------------------------------------------------------------------
 * POST /estimate
 * ------------------------------------------------------------------------- */
function dh_est_rest_estimate( WP_REST_Request $request ) {
	$spam = dh_est_spam_check( $request->get_param( 'hp' ), $request->get_param( 'elapsed' ) );
	if ( is_wp_error( $spam ) ) {
		return 'dh_spam' === $spam->get_error_code() ? rest_ensure_response( array( 'ok' => true ) ) : $spam;
	}

	$raw = json_decode( (string) $request->get_param( 'payload' ), true );
	if ( ! is_array( $raw ) ) {
		return new WP_Error( 'dh_bad_payload', 'The estimate data was missing or unreadable.', array( 'status' => 400 ) );
	}
	$data = dh_est_clean_payload( $raw );
	$c    = $data['contact'];
	if ( '' === $c['firstName'] || ! is_email( $c['email'] ) || '' === $c['phone'] || ! $data['projects'] ) {
		return new WP_Error( 'dh_missing', 'Please fill in your name, email, phone and at least one project.', array( 'status' => 400 ) );
	}

	$products = wp_list_pluck( $data['projects'], 'product' );
	$name     = trim( $c['firstName'] . ' ' . $c['lastName'] );
	$post_id  = wp_insert_post( array(
		'post_type'   => 'dh_estimate',
		'post_status' => 'private',
		'post_title'  => sprintf( '%s — %s', $name, implode( ', ', $products ) ),
	), true );
	if ( is_wp_error( $post_id ) ) {
		return new WP_Error( 'dh_save', 'We could not save your estimate. Please try again.', array( 'status' => 500 ) );
	}
	update_post_meta( $post_id, '_dh_payload', wp_slash( wp_json_encode( $data ) ) );
	update_post_meta( $post_id, '_dh_email', $c['email'] );
	update_post_meta( $post_id, '_dh_phone', $c['phone'] );
	update_post_meta( $post_id, '_dh_status', 'new' );

	// Photos: one field per product (photos_bath[], photos_windows[] …), saved to the Media Library.
	$photos = dh_est_store_photos( $request->get_file_params(), $post_id, wp_list_pluck( $data['projects'], 'id' ) );
	update_post_meta( $post_id, '_dh_photos', $photos );

	dh_est_send_notification( 'estimate', $post_id );
	return rest_ensure_response( array( 'ok' => true, 'id' => $post_id ) );
}

/**
 * Saves uploaded photos as attachments of the submission. Returns [ product id => [ attachment ids ] ].
 * Rejects anything that isn't a real image; resizes very large photos to 2000px.
 */
function dh_est_store_photos( array $files, $post_id, array $products ) {
	require_once ABSPATH . 'wp-admin/includes/file.php';
	require_once ABSPATH . 'wp-admin/includes/image.php';
	require_once ABSPATH . 'wp-admin/includes/media.php';

	$saved = array();
	$total = 0;
	foreach ( $products as $product ) {
		$field = 'photos_' . $product;
		if ( empty( $files[ $field ]['name'] ) ) {
			continue;
		}
		$set = $files[ $field ];
		$n   = is_array( $set['name'] ) ? count( $set['name'] ) : 1;
		for ( $i = 0; $i < $n; $i++ ) {
			if ( $total >= DH_EST_MAX_PHOTOS ) {
				break 2;
			}
			$file = is_array( $set['name'] ) ? array(
				'name'     => $set['name'][ $i ],
				'type'     => $set['type'][ $i ],
				'tmp_name' => $set['tmp_name'][ $i ],
				'error'    => $set['error'][ $i ],
				'size'     => $set['size'][ $i ],
			) : $set;
			if ( UPLOAD_ERR_OK !== (int) $file['error'] || $file['size'] > DH_EST_MAX_PHOTO_MB * MB_IN_BYTES ) {
				continue;
			}
			$check = wp_check_filetype_and_ext( $file['tmp_name'], $file['name'], array(
				'jpg|jpeg|jpe' => 'image/jpeg',
				'png'          => 'image/png',
				'webp'         => 'image/webp',
			) );
			if ( empty( $check['type'] ) || ! @getimagesize( $file['tmp_name'] ) ) { // phpcs:ignore WordPress.PHP.NoSilencedErrors
				continue;
			}
			$file['name'] = sanitize_file_name( 'estimate-' . $post_id . '-' . $product . '-' . ( $i + 1 ) . '.' . $check['ext'] );
			$uploaded     = wp_handle_sideload( $file, array( 'test_form' => false ) );
			if ( ! empty( $uploaded['error'] ) ) {
				continue;
			}
			dh_est_limit_size( $uploaded['file'] );
			$attachment_id = wp_insert_attachment( array(
				'post_mime_type' => $uploaded['type'],
				'post_title'     => sprintf( 'Estimate #%d — %s photo %d', $post_id, $product, $i + 1 ),
				'post_status'    => 'inherit',
			), $uploaded['file'], $post_id );
			if ( is_wp_error( $attachment_id ) ) {
				continue;
			}
			wp_update_attachment_metadata( $attachment_id, wp_generate_attachment_metadata( $attachment_id, $uploaded['file'] ) );
			$saved[ $product ][] = $attachment_id;
			$total++;
		}
	}
	return $saved;
}

/** Shrinks an uploaded image in place to max 2000px on its long side. */
function dh_est_limit_size( $path ) {
	$editor = wp_get_image_editor( $path );
	if ( is_wp_error( $editor ) ) {
		return;
	}
	$size = $editor->get_size();
	if ( max( $size['width'], $size['height'] ) > 2000 ) {
		$editor->resize( 2000, 2000, false );
		$editor->save( $path );
	}
}

/* ---------------------------------------------------------------------------
 * POST /contact
 * ------------------------------------------------------------------------- */
function dh_est_rest_contact( WP_REST_Request $request ) {
	$p    = $request->get_json_params();
	$p    = is_array( $p ) ? $p : $request->get_params();
	$spam = dh_est_spam_check( $p['hp'] ?? '', $p['elapsed'] ?? 0 );
	if ( is_wp_error( $spam ) ) {
		return 'dh_spam' === $spam->get_error_code() ? rest_ensure_response( array( 'ok' => true ) ) : $spam;
	}
	$data = array(
		'firstName' => dh_est_clean_text( $p['firstName'] ?? '' ),
		'lastName'  => dh_est_clean_text( $p['lastName'] ?? '' ),
		'email'     => sanitize_email( $p['email'] ?? '' ),
		'phone'     => dh_est_clean_text( $p['phone'] ?? '' ),
		'topic'     => dh_est_clean_text( $p['topicLabel'] ?? ( $p['topic'] ?? '' ) ),
		'message'   => dh_est_clean_text( $p['message'] ?? '', true ),
	);
	if ( '' === $data['firstName'] || ! is_email( $data['email'] ) || '' === $data['message'] ) {
		return new WP_Error( 'dh_missing', 'Please fill in your name, email and message.', array( 'status' => 400 ) );
	}
	$post_id = wp_insert_post( array(
		'post_type'   => 'dh_message',
		'post_status' => 'private',
		'post_title'  => trim( $data['firstName'] . ' ' . $data['lastName'] ) . ( $data['topic'] ? ' — ' . $data['topic'] : '' ),
	), true );
	if ( is_wp_error( $post_id ) ) {
		return new WP_Error( 'dh_save', 'We could not send your message. Please try again.', array( 'status' => 500 ) );
	}
	update_post_meta( $post_id, '_dh_payload', wp_slash( wp_json_encode( $data ) ) );
	update_post_meta( $post_id, '_dh_email', $data['email'] );
	update_post_meta( $post_id, '_dh_status', 'new' );
	dh_est_send_notification( 'message', $post_id );
	return rest_ensure_response( array( 'ok' => true, 'id' => $post_id ) );
}

/* ---------------------------------------------------------------------------
 * Email (only when an address is set in Settings).
 * ------------------------------------------------------------------------- */
function dh_est_payload( $post_id ) {
	$data = json_decode( (string) get_post_meta( $post_id, '_dh_payload', true ), true );
	return is_array( $data ) ? $data : array();
}

function dh_est_send_notification( $kind, $post_id ) {
	$to = dh_est_get( 'notify_email' );
	if ( ! $to || ! is_email( $to ) ) {
		update_post_meta( $post_id, '_dh_mail', 'not sent — no address in Settings' );
		return;
	}
	$data  = dh_est_payload( $post_id );
	$brand = dh_est_get( 'brand_name' );
	$link  = admin_url( 'post.php?post=' . $post_id . '&action=edit' );

	if ( 'estimate' === $kind ) {
		$c       = $data['contact'];
		$name    = trim( $c['firstName'] . ' ' . $c['lastName'] );
		$subject = sprintf( 'New estimate: %s — %s', $name, implode( ', ', wp_list_pluck( $data['projects'], 'product' ) ) );
		$reply   = $c['email'];
		$body    = dh_est_render_estimate_html( $post_id, true );
	} else {
		$name    = trim( $data['firstName'] . ' ' . $data['lastName'] );
		$subject = sprintf( 'New message: %s', $name );
		$reply   = $data['email'];
		$body    = dh_est_render_message_html( $post_id );
	}
	$html = '<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#232226;max-width:640px">'
		. '<p style="font-size:13px;color:#6B6A73;margin:0 0 12px">' . esc_html( $brand ) . '</p>'
		. $body
		. '<p style="margin:24px 0 0"><a href="' . esc_url( $link ) . '" style="background:#7FD2FE;color:#1B1B41;padding:10px 16px;border-radius:999px;text-decoration:none;font-weight:bold">Open in WordPress</a></p>'
		. '</div>';
	$headers = array( 'Content-Type: text/html; charset=UTF-8' );
	if ( is_email( $reply ) ) {
		$headers[] = 'Reply-To: ' . $name . ' <' . $reply . '>'; // customer goes in Reply-To, never in From
	}
	$sent = wp_mail( $to, $subject, $html, $headers );
	update_post_meta( $post_id, '_dh_mail', $sent ? 'sent ' . current_time( 'mysql' ) : 'failed ' . current_time( 'mysql' ) );
}

/** The estimate, grouped by project → section, as simple inline-styled HTML (used in wp-admin and email). */
function dh_est_render_estimate_html( $post_id, $for_email = false ) {
	$data = dh_est_payload( $post_id );
	if ( ! $data ) {
		return '<p>No data.</p>';
	}
	$c   = $data['contact'];
	$a   = $data['address'];
	$row = function ( $k, $v ) {
		return '<tr><td style="padding:6px 12px 6px 0;color:#6B6A73;vertical-align:top;width:38%">' . esc_html( $k ) . '</td><td style="padding:6px 0;vertical-align:top">' . nl2br( esc_html( $v ) ) . '</td></tr>';
	};
	$h  = '<h2 style="font-size:18px;margin:0 0 8px">Customer</h2><table style="border-collapse:collapse;width:100%">';
	$h .= $row( 'Name', trim( $c['firstName'] . ' ' . $c['lastName'] ) );
	$h .= $row( 'Email', $c['email'] ) . $row( 'Phone', $c['phone'] );
	if ( $c['preferredContact'] ) {
		$h .= $row( 'Best way to reach', $c['preferredContact'] );
	}
	$h .= $row( 'Address', implode( ', ', array_filter( array( $a['street'], $a['line2'], $a['city'], trim( $a['region'] . ' ' . $a['postalCode'] ) ) ) ) );
	$h .= '</table>';

	$photos = (array) get_post_meta( $post_id, '_dh_photos', true );
	foreach ( $data['projects'] as $p ) {
		$h .= '<h2 style="font-size:18px;margin:24px 0 8px;padding-top:16px;border-top:1px solid #E5E5EA">' . esc_html( $p['product'] ) . '</h2>';
		foreach ( $p['sections'] as $s ) {
			$h .= '<h3 style="font-size:14px;margin:12px 0 4px;color:#0D71A5">' . esc_html( $s['section'] ) . '</h3><table style="border-collapse:collapse;width:100%">';
			foreach ( $s['answers'] as $ans ) {
				$h .= $row( $ans['question'], $ans['answer'] );
			}
			$h .= '</table>';
		}
		$ids = $photos[ $p['id'] ] ?? array();
		if ( $ids ) {
			$h .= '<h3 style="font-size:14px;margin:12px 0 6px;color:#0D71A5">Photos (' . count( $ids ) . ')</h3><p>';
			foreach ( $ids as $id ) {
				$full  = wp_get_attachment_url( $id );
				$thumb = wp_get_attachment_image_url( $id, 'thumbnail' );
				$h    .= '<a href="' . esc_url( $full ) . '" target="_blank" rel="noopener"><img src="' . esc_url( $thumb ) . '" width="96" height="96" alt="" style="width:96px;height:96px;object-fit:cover;border-radius:8px;margin:0 6px 6px 0"></a>';
			}
			$h .= '</p>';
		}
	}
	return $h;
}

function dh_est_render_message_html( $post_id ) {
	$d   = dh_est_payload( $post_id );
	$row = function ( $k, $v ) {
		return '<tr><td style="padding:6px 12px 6px 0;color:#6B6A73;vertical-align:top;width:30%">' . esc_html( $k ) . '</td><td style="padding:6px 0">' . nl2br( esc_html( $v ) ) . '</td></tr>';
	};
	return '<table style="border-collapse:collapse;width:100%">'
		. $row( 'Name', trim( ( $d['firstName'] ?? '' ) . ' ' . ( $d['lastName'] ?? '' ) ) )
		. $row( 'Email', $d['email'] ?? '' ) . $row( 'Phone', $d['phone'] ?? '' )
		. $row( 'About', $d['topic'] ?? '' ) . $row( 'Message', $d['message'] ?? '' )
		. '</table>';
}
