<?php
/**
 * Estimate → Settings: brand, contact details, where submissions are emailed.
 * The theme reads every value through the `dh_setting` filter.
 */
defined( 'ABSPATH' ) || exit;

const DH_EST_OPTION = 'dh_estimate_settings';

/** Every setting with its default, so a fresh install renders exactly like the prototype. */
function dh_est_setting_fields() {
	return array(
		'brand_name'    => array( 'label' => 'Business name', 'default' => 'install-D Home Remodeling', 'type' => 'text', 'help' => 'Shown in the footer, page titles and emails.' ),
		'brand_short'   => array( 'label' => 'Short name', 'default' => 'install-D', 'type' => 'text', 'help' => 'Used in the logo wordmark and in sentences (shown in capitals in the logo).' ),
		'logo_id'       => array( 'label' => 'Logo', 'default' => 0, 'type' => 'image', 'help' => 'A square logo or emblem, at least 256 × 256 px. Leave empty to use the built-in emblem.' ),
		'phone'         => array( 'label' => 'Phone number', 'default' => '(910) 617-9122', 'type' => 'text', 'help' => 'Shown on the contact page and in the estimate sidebar.' ),
		'public_email'  => array( 'label' => 'Public email', 'default' => '', 'type' => 'email', 'help' => 'Shown on the contact page. Leave empty to hide it.' ),
		'notify_email'  => array( 'label' => 'Send new estimates and messages to', 'default' => '', 'type' => 'email', 'help' => 'Leave empty to only store submissions here in WordPress (no email).' ),
	);
}

function dh_est_settings() {
	$saved = get_option( DH_EST_OPTION, array() );
	$out   = array();
	foreach ( dh_est_setting_fields() as $key => $field ) {
		$out[ $key ] = isset( $saved[ $key ] ) && '' !== $saved[ $key ] ? $saved[ $key ] : $field['default'];
	}
	return $out;
}

function dh_est_get( $key ) {
	$all = dh_est_settings();
	return $all[ $key ] ?? '';
}

// Answer the theme's settings lookups.
add_filter( 'dh_setting', function ( $default, $key ) {
	if ( 'logo_url' === $key ) {
		$id = (int) dh_est_get( 'logo_id' );
		return $id ? (string) wp_get_attachment_image_url( $id, 'medium' ) : $default;
	}
	$all = dh_est_settings();
	return array_key_exists( $key, $all ) && '' !== $all[ $key ] ? $all[ $key ] : $default;
}, 10, 2 );

/* ---------------------------------------------------------------------------
 * Admin: the "Estimate" menu and its Settings screen.
 * ------------------------------------------------------------------------- */
add_action( 'admin_menu', function () {
	add_menu_page( 'Estimate', 'Estimate', 'manage_options', 'dh-estimate', 'dh_est_render_settings', 'dashicons-clipboard', 25 );
	add_submenu_page( 'dh-estimate', 'Estimate settings', 'Settings', 'manage_options', 'dh-estimate', 'dh_est_render_settings' );
} );

add_action( 'admin_init', function () {
	register_setting( 'dh_estimate', DH_EST_OPTION, array(
		'type'              => 'array',
		'sanitize_callback' => 'dh_est_sanitize_settings',
		'default'           => array(),
	) );
} );

function dh_est_sanitize_settings( $input ) {
	$clean = array();
	foreach ( dh_est_setting_fields() as $key => $field ) {
		$value = isset( $input[ $key ] ) ? wp_unslash( $input[ $key ] ) : '';
		switch ( $field['type'] ) {
			case 'email':
				$clean[ $key ] = sanitize_email( $value );
				break;
			case 'image':
				$clean[ $key ] = absint( $value );
				break;
			default:
				$clean[ $key ] = sanitize_text_field( $value );
		}
	}
	return $clean;
}

function dh_est_render_settings() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	wp_enqueue_media();
	$values = dh_est_settings();
	?>
	<div class="wrap">
		<h1>Estimate settings</h1>
		<form method="post" action="options.php">
			<?php settings_fields( 'dh_estimate' ); ?>
			<table class="form-table" role="presentation">
				<?php foreach ( dh_est_setting_fields() as $key => $field ) : ?>
					<?php $name = DH_EST_OPTION . '[' . $key . ']'; $id = 'dh-' . $key; ?>
					<tr>
						<th scope="row"><label for="<?php echo esc_attr( $id ); ?>"><?php echo esc_html( $field['label'] ); ?></label></th>
						<td>
							<?php if ( 'image' === $field['type'] ) : ?>
								<?php $img = $values[ $key ] ? wp_get_attachment_image_url( (int) $values[ $key ], 'thumbnail' ) : ''; ?>
								<div class="dh-image-field">
									<img src="<?php echo esc_url( $img ); ?>" alt="" style="width:80px;height:80px;object-fit:contain;border:1px solid #dcdcde;border-radius:6px;background:#fff;<?php echo $img ? '' : 'display:none;'; ?>">
									<input type="hidden" id="<?php echo esc_attr( $id ); ?>" name="<?php echo esc_attr( $name ); ?>" value="<?php echo esc_attr( $values[ $key ] ); ?>">
									<button type="button" class="button dh-image-pick">Choose image</button>
									<button type="button" class="button-link dh-image-clear" <?php echo $img ? '' : 'hidden'; ?>>Remove</button>
								</div>
							<?php else : ?>
								<input class="regular-text" type="<?php echo 'email' === $field['type'] ? 'email' : 'text'; ?>" id="<?php echo esc_attr( $id ); ?>" name="<?php echo esc_attr( $name ); ?>" value="<?php echo esc_attr( $values[ $key ] ); ?>">
							<?php endif; ?>
							<p class="description"><?php echo esc_html( $field['help'] ); ?></p>
						</td>
					</tr>
				<?php endforeach; ?>
			</table>
			<?php submit_button(); ?>
		</form>
	</div>
	<script>
	document.querySelectorAll('.dh-image-field').forEach(function (box) {
		var input = box.querySelector('input'), img = box.querySelector('img'), clear = box.querySelector('.dh-image-clear');
		box.querySelector('.dh-image-pick').addEventListener('click', function () {
			var frame = wp.media({ title: 'Choose logo', library: { type: 'image' }, multiple: false });
			frame.on('select', function () {
				var a = frame.state().get('selection').first().toJSON();
				input.value = a.id; img.src = (a.sizes && a.sizes.thumbnail ? a.sizes.thumbnail.url : a.url); img.style.display = ''; clear.hidden = false;
			});
			frame.open();
		});
		clear.addEventListener('click', function () { input.value = ''; img.style.display = 'none'; clear.hidden = true; });
	});
	</script>
	<?php
}
