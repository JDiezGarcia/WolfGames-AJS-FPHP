<?php

namespace Middleware;

use Utils;
use Utils\JWT;
use BadReqException;
use Client;
use Exception;

function json() { // Deault middleware
    // Get JSON data from $_POST
    if ($_SERVER['REQUEST_METHOD'] != 'GET') {
        /*
        POST / HTTP/1.1
        Host: localhost
        User-Agent: WIndows xp

        Data: {'test':1}
        */
        $data = file_get_contents('php://input');
        if (!$data) { // If no data
            $data = '{}';
        }
        $data = json_decode($data, true); // Convert to json

        if (!is_array($data)) {
            throw new BadReqException("Invalid json data");
        }
    } else {
        $data = $_GET;
    }
    Client::$data = $data;
}

function user_expiration() {
    $token = Utils\get_cookie('sessionToken');
    try {
        Client::$jwt_session = JWT::decode($token);

        if (Client::$jwt_session->expires <= time()) {
            throw new BadReqException("The token is expire...");
        }
    } catch (Exception $e) {
        throw new BadReqException("Invalid token");
    }
}

function verify_expiration() {
    try {
        $token = Client::$data['token'];
        $decode = JWT::decode($token);
        if ($decode->expires <= time()) {
            throw new BadReqException("The token is expire...");
        }
    } catch (Exception $e) {
        Client::$status = "expired";
    }
}

/*function token_permision() {
    $token = Utils\get_cookie('permisionToken');
    try {
        Client::$jwt_permission = (object) JWT::decode($token);
        // Check expiration
        if (Client::$jwt_permission->type >= time()) {
            throw new BadReqException("The token is expire...");
        }
    } catch(Exception $e) {
        throw new BadReqException("Invalid token");
    }
}
*/
