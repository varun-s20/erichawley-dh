<?php defined( 'ABSPATH' ) || exit; ?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#06070C">
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?> data-page="<?php echo esc_attr( dh_page_data( 'data_page' ) ); ?>"<?php echo dh_page_data( 'overlay' ) ? ' data-header="overlay"' : ''; ?>>
<?php wp_body_open(); ?>
  