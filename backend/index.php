<?php
header('Content-Type: application/json; charset=utf-8');

require_once 'mvc_lib/app.php';
require_once 'utils/utils.php';

$folders_to_include = array('mvc_lib', 'exceptions','utils','middlewares');
foreach ($folders_to_include as &$folder) { 
    $files = glob($folder . '/*.php');
    foreach ($files as &$file) {
        require_once $file;
    }
}

$app = new App();

?>
