<?php

use Utils\res;
use Utils\JWT;
use Utils\MailJet;

class LogController extends Controller {

    public $middlewares = array(
        "verify_user_post" => array('json','verify_expiration'),
        "userLog_post" => array('json'),
        "register_post" => array('json'),
        //"action" => array('middleware(jwt,json..)
    );

    private function generate_session_token($user) {
        $expires = "+1 hour";
        $token = JWT::encode([
            'userCod' => $user,
            'expires' => strtotime($expires)
        ]);
        /* nombre: token, tiempo_exp: exprires, path_cookies: /(toda la pagina), dominio: localhost(http://192.168.100.8:8080/)
        si_https: false, http_only: true(js no accede al token)*/
        setcookie('sessionToken', $token, strtotime($expires), '/', '', false, false); 
    }

    private function generate_verify_token($user) {
        $expires = "+30 minutes";
        $randN = rand(0000001, 99999999);
        $token = JWT::encode([
            'user' => $user,
            'number' => $randN,
            'type' => "verify",
            'expires' => strtotime($expires)
        ]);
        return $token;
    }

    // ACCION /shop/userLog/
    public function userLog_post($userLog) {
        $userLog = $this->model->select_user(
            $userLog->username, 
            $userLog->password
        );

        if($userLog['verify'] != 0 ){
            $this->generate_session_token($userLog['userCod']);
            res::ok($userLog);
        }else{
            $token = $this->generate_verify_token($userLog['user']);
            $send = [
                'user' => $userLog['user'],
                'token' => $token
            ];
            MailJet::verify_account($send,$userLog['email']);
            res::ok(2);
        }
    }

    public function verify_user_post($userVerify) {
        $status = Client::$status;
        if($status != "expired"){
            $userVerify = $this->model->verify_user(
                $userVerify->user
            );
            res::ok($userVerify);
        }else{
            res::ok(2);
        }
    }
    
    public function register_post($userRegister) {
        $register = $this->model->insert_user(
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
        if($register['result'] == 0){
            $token = $this->generate_verify_token($userRegister->user);
            $send = [
                'user' => $userRegister->user,
                'token' => $token
            ];
            MailJet::verify_account($send,$userRegister->email);
        }
        res::ok($register);
    }
}

?>
