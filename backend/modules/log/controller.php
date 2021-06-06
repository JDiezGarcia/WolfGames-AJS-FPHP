<?php

use Utils\res;
use Utils\JWT;

class LogController extends Controller {

    public $middlewares = array(
        "userLog_post" => array('json'),
        "register_post" => array('json'),
        //"action" => array('middleware(jwt,json..)
    );

    private function give_token($user) {
        $expires = "+1 hour";
        $token = JWT::encode([
            'username' => $user,
            'expires' => strtotime($expires)
        ]);
        /* nombre: token, tiempo_exp: exprires, path_cookies: /(toda la pagina), dominio: localhost(http://192.168.100.8:8080/)
        si_https: false, http_only: true(js no accede al token)*/
        setcookie('sessionToken', $token, strtotime($expires), '/', '', false, false); 
    }

    // ACCION /shop/userLog/
    public function userLog_post($userLog) {
        $userLog = $this->model->select_user(
            $userLog->username, 
            $userLog->password
        );
        $this->give_token($userLog['user']);
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
