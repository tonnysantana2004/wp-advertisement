<?php
/**
 * Plugin Name:     Wp Advertisement
 * Plugin URI:      PLUGIN SITE HERE
 * Description:     PLUGIN DESCRIPTION HERE
 * Author:          YOUR NAME HERE
 * Author URI:      YOUR SITE HERE
 * Text Domain:     wp-advertisement
 * Domain Path:     /languages
 * Version:         0.1.0
 *
 * @package         WP Advertisement
 */

namespace WPADS;

add_action(
	'plugins_loaded',
	function () {

		define( 'WPADS_PLUGIN_DIR', __DIR__ );
		define( 'WPADS_PLUGIN_FILE', __FILE__ );

		if ( is_Readable( WPADS_PLUGIN_DIR . '/vendor/autoload.php' ) ) {
			include_once WPADS_PLUGIN_DIR . '/vendor/autoload.php';
		}

		AdvertisementPostType::init();
	}
);
