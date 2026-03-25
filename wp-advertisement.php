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
 * @package         Wp_Advertisement
 */

namespace WPADS;

define('WPADS_PLUGIN_DIR', __DIR__);
define('WPADS_PLUGIN_FILE', __FILE__);

function init()
{
    if (is_readable(WPADS_PLUGIN_DIR . '/vendor/autoload.php')) {
        include_once WPADS_PLUGIN_DIR . '/vendor/autoload.php';
    }

    PostType::init();
}

add_action('plugins_loaded', __NAMESPACE__ . '\\init');
