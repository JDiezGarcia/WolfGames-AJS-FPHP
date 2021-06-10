<?php

use Utils\res;

class CartController extends Controller {

    public $middlewares = array(
        "list_get" => array('token_expiration'),
        "insert_list_post" => array('token_expiration','json'),
        "checkout_get" => array('token_expiration')
        //"action" => array('middleware(jwt,json..)
    );

    public function list_get() {
        $cart_products = $this->model->select_order(Client::$jwt_session->userCod);
        res::ok($cart_products);
    }
    
    public function insert_list_post($games) {
        $this->model->insert_lines(
            $games, 
            Client::$jwt_session->userCod
        );
        res::ok("Se actualizo el carrito");
    }

    public function checkout_get(){
        $check = $this->model->cart_checkout(Client::$jwt_session->userCod);
        res::ok($check);
    }
}

?>
