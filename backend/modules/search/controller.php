<?php

use Utils\res;

class SearchController extends Controller {

    public $middlewares = array(
        "search_bar_get" => array('json'),
        //"action" => array('middleware(jwt,json..)
    );

    // /search/search_bar/query
    public function search_bar_get() {
        $search_bar = $this->model->search_bar(Client::$uri[2]);
        res::ok($search_bar);
    }
    
}

?>
