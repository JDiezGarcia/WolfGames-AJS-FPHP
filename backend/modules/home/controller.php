<?php

use Utils\res;

class HomeController extends Controller {

    public $middlewares = array(
        //"action" => array('middleware(jwt,json..)
    );

    // /home/carousel/0
    public function carousel_get() {
        $offset = intval(Client::$uri[2]);
        $carousel = $this->model->carousel($offset);
        res::ok($carousel);
    }
    // /shop/platforms/
    public function platforms_img_get() {
        $platforms_img = $this->model->platforms_img();
        res::ok($platforms_img);
    }  
}

?>
