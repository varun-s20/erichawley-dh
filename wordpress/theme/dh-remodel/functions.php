<?php
/**
 * DH Remodel theme bootstrap.
 *
 * The theme only renders the design. Anything the owner edits (estimate
 * questions, submissions, brand name, logo, phone) lives in the DH Estimate
 * plugin, which talks to the theme through the `dh_setting` filter and the
 * `dh_site_config` / `dh_estimate_products` filters below.
 */
defined( 'ABSPATH' ) || exit;

define( 'DH_THEME_VER', '1.0.4' );

require get_template_directory() . '/inc/helpers.php';
require get_template_directory() . '/inc/setup.php';
