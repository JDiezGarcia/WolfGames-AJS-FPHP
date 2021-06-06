<?php

namespace Utils;

require_once 'libs/firebase-jwt/src/BeforeValidException.php';
require_once 'libs/firebase-jwt/src/ExpiredException.php';
require_once 'libs/firebase-jwt/src/SignatureInvalidException.php';
require_once 'libs/firebase-jwt/src/JWT.php';

use \Firebase\JWT\JWT as _JWT;

class JWT {
    public static $secret;
    public static function encode($arr) {
        return _JWT::encode($arr, self::$secret);
    }
    public static function decode($token) {
        return _JWT::decode($token, self::$secret, array('HS256'));
    }
    public static function set_password($secret) {
        self::$secret = $secret;
        
    }
}

JWT::set_password(get_json_data("jwt")['secret']);

?>