<?php

abstract class Model {
    public $db;
    public $module_name;

    public function __construct() {
        $this->db = new Database();
        $this->module_name = strtolower(str_replace('Model', '', get_called_class())); // obtiene shop de ShopModel
    }
}

?>
