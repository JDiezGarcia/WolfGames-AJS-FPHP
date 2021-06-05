<?php

use Utils\res;

class LogController extends Controller {

    public $middlewares = array(
        "userLog_post" => array('json'),
        "register_post" => array('json'),
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
    
    public function register_post($userRegister) {
        $userRegister = $this->model->insert_user(
            $userRegister->user, 
            $userRegister->email,
            $userRegister->pass, 
            $userRegister->name,
            $userRegister->lastName,
            $userRegister->dir, 
            $userRegister->postCode,
            $userRegister->city, 
            $userRegister->country,
            $userRegister->sex,
            $userRegister->birth, 
            $userRegister->img
        );
        res::ok($userRegister);
    }
}

?>
