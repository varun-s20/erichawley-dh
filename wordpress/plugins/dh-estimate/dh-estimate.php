<?php
/**
 * Plugin Name:       DH Estimate
 * Description:       The online estimate tool: an editor for its products, questions and photos, stored submissions with photos, the contact form, and the site's brand settings. Works with the DH Remodel theme.
 * Version:           1.0.3
 * Requires at least: 6.3
 * Requires PHP:      7.4
 * Author:            Digital Heroes
 * Text Domain:       dh-estimate
 */
defined( 'ABSPATH' ) || exit;

define( 'DH_EST_VER', '1.0.3' );           // also the asset cache-buster — bump together
define( 'DH_EST_FILE', __FILE__ );
define( 'DH_EST_DIR', plugin_dir_path( __FILE__ ) );
define( 'DH_EST_URL', plugin_dir_url( __FILE__ ) );

require DH_EST_DIR . 'inc/settings.php';
require DH_EST_DIR . 'inc/pages.php';
require DH_EST_DIR . 'inc/submissions.php';
require DH_EST_DIR . 'inc/admin-submissions.php';
require DH_EST_DIR . 'inc/products.php';
require DH_EST_DIR . 'inc/builder.php';

register_activation_hook( __FILE__, function () {
	dh_est_register_types();
	dh_est_create_pages();
	flush_rewrite_rules();
} );
