<?php

use Utils\res;

class LogController extends Controller {

    public $middlewares = array(
        "userLog_post" => array('json'),
        "register" => array('json'),
        //"action" => array('middleware(jwt,json..)
    );

    // ACCION /shop/userLog/
    public function userLog_post($userLog) {
        $userLog = $this->model->select_user(
            $userLog->username, 
            $userLog->password
        );
        res::ok($userLog);
    }  
}

?>
