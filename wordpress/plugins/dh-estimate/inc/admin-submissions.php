<?php
/**
 * wp-admin screens for Estimates and Messages: list columns, a readable view,
 * and a simple status the owner can track (New → Contacted → Proposal sent → Closed).
 */
defined( 'ABSPATH' ) || exit;

function dh_est_statuses() {
	return array(
		'new'       => 'New',
		'contacted' => 'Contacted',
		'proposal'  => 'Proposal sent',
		'closed'    => 'Closed',
	);
}

/* ---- List columns ---------------------------------------------------------- */
foreach ( array( 'dh_estimate', 'dh_message' ) as $dh_type ) {
	add_filter( "manage_{$dh_type}_posts_columns", function ( $cols ) use ( $dh_type ) {
		return array(
			'cb'        => $cols['cb'],
			'title'     => 'dh_estimate' === $dh_type ? 'Customer — projects' : 'From — about',
			'dh_email'  => 'Email',
			'dh_phone'  => 'Phone',
			'dh_photos' => 'dh_estimate' === $dh_type ? 'Photos' : '',
			'dh_status' => 'Status',
			'dh_date'   => 'Received',
		);
	} );
	add_action( "manage_{$dh_type}_posts_custom_column", function ( $col, $post_id ) {
		switch ( $col ) {
			case 'dh_email':
				$e = get_post_meta( $post_id, '_dh_email', true );
				echo $e ? '<a href="mailto:' . esc_attr( $e ) . '">' . esc_html( $e ) . '</a>' : '—';
				break;
			case 'dh_phone':
				echo esc_html( get_post_meta( $post_id, '_dh_phone', true ) ?: '—' );
				break;
			case 'dh_photos':
				$n = 0;
				foreach ( (array) get_post_meta( $post_id, '_dh_photos', true ) as $ids ) {
					$n += count( (array) $ids );
				}
				echo esc_html( $n );
				break;
			case 'dh_date':
				echo esc_html( get_the_date( 'M j, Y g:i a', $post_id ) );
				break;
			case 'dh_status':
				$s = get_post_meta( $post_id, '_dh_status', true ) ?: 'new';
				$label = dh_est_statuses()[ $s ] ?? $s;
				echo 'new' === $s ? '<strong>' . esc_html( $label ) . '</strong>' : esc_html( $label );
				break;
		}
	}, 10, 2 );
	add_filter( "manage_edit-{$dh_type}_columns", function ( $cols ) use ( $dh_type ) {
		if ( 'dh_message' === $dh_type ) {
			unset( $cols['dh_photos'] );
		}
		return $cols;
	}, 20 );
}

// Private entries are what these lists hold: show them under "All" without a "Private" tag.
add_filter( 'display_post_states', function ( $states, $post ) {
	if ( in_array( $post->post_type, array( 'dh_estimate', 'dh_message' ), true ) ) {
		unset( $states['private'] );
	}
	return $states;
}, 10, 2 );

// Customers create these; the owner only reads them and sets a status — no Quick Edit.
add_filter( 'post_row_actions', function ( $actions, $post ) {
	if ( in_array( $post->post_type, array( 'dh_estimate', 'dh_message' ), true ) ) {
		unset( $actions['inline hide-if-no-js'] );
		if ( isset( $actions['edit'] ) ) {
			$actions['edit'] = str_replace( '>Edit<', '>Open<', $actions['edit'] );
		}
	}
	return $actions;
}, 10, 2 );

// No "Add new" for entries that only customers create.
add_action( 'admin_head', function () {
	$screen = get_current_screen();
	if ( $screen && in_array( $screen->post_type, array( 'dh_estimate', 'dh_message' ), true ) ) {
		echo '<style>.page-title-action{display:none}#titlediv #title{pointer-events:none;background:#f6f7f7}</style>';
	}
} );

/* ---- Single view ----------------------------------------------------------- */
add_action( 'add_meta_boxes', function () {
	remove_meta_box( 'submitdiv', 'dh_estimate', 'side' );
	remove_meta_box( 'submitdiv', 'dh_message', 'side' );
	remove_meta_box( 'slugdiv', 'dh_estimate', 'normal' );
	remove_meta_box( 'slugdiv', 'dh_message', 'normal' );
	add_meta_box( 'dh_view', 'Estimate', function ( $post ) {
		echo '<div style="max-width:760px">' . dh_est_render_estimate_html( $post->ID ) . '</div>'; // escaped inside
	}, 'dh_estimate', 'normal', 'high' );
	add_meta_box( 'dh_view', 'Message', function ( $post ) {
		echo dh_est_render_message_html( $post->ID ); // escaped inside
	}, 'dh_message', 'normal', 'high' );
	foreach ( array( 'dh_estimate', 'dh_message' ) as $t ) {
		add_meta_box( 'dh_status', 'Status', 'dh_est_status_box', $t, 'side', 'high' );
	}
} );

function dh_est_status_box( $post ) {
	$current = get_post_meta( $post->ID, '_dh_status', true ) ?: 'new';
	wp_nonce_field( 'dh_status_save', 'dh_status_nonce' );
	echo '<p><select name="dh_status" style="width:100%">';
	foreach ( dh_est_statuses() as $k => $label ) {
		echo '<option value="' . esc_attr( $k ) . '"' . selected( $current, $k, false ) . '>' . esc_html( $label ) . '</option>';
	}
	echo '</select></p>';
	echo '<p style="color:#646970">Received ' . esc_html( get_the_date( 'M j, Y g:i a', $post ) ) . '</p>';
	$mail = get_post_meta( $post->ID, '_dh_mail', true );
	if ( $mail ) {
		echo '<p style="color:#646970">Email: ' . esc_html( $mail ) . '</p>';
	}
	echo '<p><button type="submit" class="button button-primary" name="save" value="1">Save status</button> ';
	echo '<a class="submitdelete" style="color:#b32d2e;margin-left:8px" href="' . esc_url( get_delete_post_link( $post->ID ) ) . '">Move to Trash</a></p>';
}

add_action( 'save_post', function ( $post_id, $post ) {
	if ( ! in_array( $post->post_type, array( 'dh_estimate', 'dh_message' ), true ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! isset( $_POST['dh_status_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['dh_status_nonce'] ) ), 'dh_status_save' ) ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}
	$status = sanitize_key( wp_unslash( $_POST['dh_status'] ?? 'new' ) );
	if ( isset( dh_est_statuses()[ $status ] ) ) {
		update_post_meta( $post_id, '_dh_status', $status );
	}
}, 10, 2 );

// Saving the status must not change the entry from private to published.
add_filter( 'wp_insert_post_data', function ( $data, $postarr ) {
	if ( in_array( $data['post_type'], array( 'dh_estimate', 'dh_message' ), true ) && ! empty( $postarr['ID'] ) && 'trash' !== $data['post_status'] ) {
		$data['post_status'] = 'private';
	}
	return $data;
}, 10, 2 );

// Deleting an estimate permanently also deletes its photos.
add_action( 'before_delete_post', function ( $post_id ) {
	if ( 'dh_estimate' !== get_post_type( $post_id ) ) {
		return;
	}
	foreach ( (array) get_post_meta( $post_id, '_dh_photos', true ) as $ids ) {
		foreach ( (array) $ids as $id ) {
			wp_delete_attachment( (int) $id, true );
		}
	}
} );

// Count of new estimates on the menu, so nothing is missed.
add_action( 'admin_menu', function () {
	global $menu;
	$new = get_posts( array(
		'post_type'      => 'dh_estimate',
		'post_status'    => 'private',
		'meta_key'       => '_dh_status',
		'meta_value'     => 'new',
		'fields'         => 'ids',
		'posts_per_page' => 99,
		'no_found_rows'  => true,
	) );
	if ( ! $new ) {
		return;
	}
	foreach ( $menu as $i => $item ) {
		if ( 'dh-estimate' === ( $item[2] ?? '' ) ) {
			$menu[ $i ][0] .= ' <span class="awaiting-mod"><span class="pending-count">' . count( $new ) . '</span></span>';
		}
	}
}, 99 );
