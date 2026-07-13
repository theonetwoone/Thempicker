<?php
/**
 * Paste into your child theme functions.php (or a small custom plugin).
 * Upload the variated/di-tist-danmark-certificerede-kliniske-di-tister/ folder to your child theme directory.
 */
function variated_enqueue_di_tist_danmark_certificerede_kliniske_di_tister(): void {
  if (!is_page_template('variated-di-tist-danmark-certificerede-kliniske-di-tister-template.php')) {
    return;
  }
  $base = get_stylesheet_directory_uri() . '/variated/di-tist-danmark-certificerede-kliniske-di-tister';
  wp_enqueue_style(
    'variated-di-tist-danmark-certificerede-kliniske-di-tister',
    $base . '/style.css',
    [],
    '1.0.0'
  );
  wp_enqueue_script(
    'variated-di-tist-danmark-certificerede-kliniske-di-tister',
    $base . '/script.js',
    [],
    '1.0.0',
    true
  );
}
add_action('wp_enqueue_scripts', 'variated_enqueue_di_tist_danmark_certificerede_kliniske_di_tister');
