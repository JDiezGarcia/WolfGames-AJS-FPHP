<?php

$folders_to_include = array('mvc_lib', 'exceptions');
foreach ($folders_to_include as &$folder) { 
    $files = glob($folder . '/*.php');
    foreach ($files as &$file) {
        include_once $file;
    }
}

require 'utils/utils.php';
require 'middlewares/middlewares.php';

$app = new App();

?>
