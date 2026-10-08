<?php
/**
 * Estimate → Builder: edit the estimate's products, pages, questions and options.
 * The screen is a small vanilla-JS app (assets/builder.js) that saves through the
 * /dh-estimate/v1/products REST route.
 */
defined( 'ABSPATH' ) || exit;

add_action( 'admin_menu', function () {
	$hook = add_submenu_page( 'dh-estimate', 'Estimate builder', 'Builder', 'manage_options', 'dh-estimate-builder', 'dh_est_render_builder', 0 );
	add_action( 'load-' . $hook, function () {
		wp_enqueue_media();
		wp_enqueue_style( 'dh-builder', DH_EST_URL . 'assets/builder.css', array(), DH_EST_VER );
		wp_enqueue_script( 'dh-builder', DH_EST_URL . 'assets/builder.js', array(), DH_EST_VER, true );
		wp_localize_script( 'dh-builder', 'DH_BUILDER', array(
			'products'  => dh_est_products(),
			'restUrl'   => esc_url_raw( rest_url( 'dh-estimate/v1/products' ) ),
			'nonce'     => wp_create_nonce( 'wp_rest' ),
			'themeBase' => trailingslashit( get_template_directory_uri() ),
			'siteUrl'   => esc_url_raw( home_url( '/estimate/' ) ),
			'icons'     => array( 'sparkle', 'drop', 'sun', 'eye', 'camera', 'home', 'door', 'roof', 'window', 'bath', 'shower', 'vanity', 'floor', 'toilet', 'palette', 'info' ),
		) );
	} );
}, 20 );

function dh_est_render_builder() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	?>
	<div class="wrap dhb">
		<h1 class="wp-heading-inline">Estimate builder</h1>
		<p class="dhb-lead">Everything a customer sees in the online estimate: the projects they can choose, each page, every question and its options. Changes go live when you click <strong>Save changes</strong>.</p>
		<div id="dh-builder" class="dhb-app"><p>Loading…</p></div>
		<noscript><p>The builder needs JavaScript.</p></noscript>
	</div>
	<?php
}
