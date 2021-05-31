<?php

use Utils\res;

class ShopController extends Controller {

    public $middlewares = array(
        "products_post" => array('json'),
        "details_product_get" => array('json'),
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
            $products->platformCod,
            $products->search, 
            $products->offset
        );
        res::ok($products);

    }  
}

?>
