<?php

use Utils\res;

class HomeController extends Controller {

    public $middlewares = array(
        "carousel_get" => array('json'),
        "platforms_img_get" => array('json'),
        //"action" => array('middleware(jwt,json..)
    );

    // /home/carousel/0
    public function carousel_get() {
        $carousel = $this->model->carousel(intval(Client::$uri[2]));
        res::ok($carousel);
    }
    // /shop/platforms/
    public function platforms_img_get() {
        $platforms_img = $this->model->platforms_img();
        res::ok($platforms_img);
    }  
}

?>
