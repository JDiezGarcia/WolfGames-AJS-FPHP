<?php

use Utils\res;

class CartController extends Controller {

    public $middlewares = array(
        "list_get" => array('user_expiration'),
        "insert_list_post" => array('user_expiration','json'),
        "checkout_get" => array('user_expiration'),
        "delete_list_get" => array('user_expiration')
        //"action" => array('middleware(jwt,json..)
    );

    public function list_get() {
        $user = Client::$jwt_session->userCod;
        $cart_products = $this->model->select_order($user);
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

    public function delete_list_get(){
        $this->model->delete_lines(
            Client::$jwt_session->userCod
        );
        res::ok("Se elimino carrito");
    }
}

?>
