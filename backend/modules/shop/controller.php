<?php

use Utils\res;

class ShopController extends Controller {

    public $middlewares = array(
        "products_post" => array('json'),
        "multi_fav_get" => array('user_expiration'),
        "single_fav_get" => array('user_expiration'),
        "fav_action_get" => array('user_expiration')
        //"action" => array('middleware(jwt,json..)
    );

    // /shop/details_product/AAA-000
    public function details_product_get() {
        $product_details = $this->model->details_product(Client::$uri[2]);
        res::ok($product_details);
    }
    
    // ACCION /shop/products/
    public function products_post($products) {
        /*products_post($generes, $platformCod, $search,  $offset)
        or
        shop/products/{filters:{},offset:1,search}*/
        $products = $this->model->select_products(
            $products->genres, 
            $products->platforms,
            $products->search, 
            $products->offset
        );
        
        res::ok($products);

    }

    public function multi_fav_get() {
        $user = Client::$jwt_session->userCod;
        $favorites = $this->model->favs_products($user);
        res::ok($favorites);
    }

    public function single_fav_get() {
        $user = Client::$jwt_session->userCod;
        $favorites = $this->model->fav_product(
            $user,
            Client::$uri[2]
        );
        res::ok($favorites);
    }
    
    public function fav_action_get() {
        $user = Client::$jwt_session->userCod;
        $favAction = $this->model->favs_action_product(
            Client::$uri[2],
            $user
        );
        res::ok($favAction);
    }
}

?>
