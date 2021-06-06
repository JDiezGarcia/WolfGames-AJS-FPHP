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

function check_jwt() {
    $token = Utils\get_cookie('token');
    try {
        Client::$jwt_data = (object) JWT::decode($token);
        // Check expiration
        if (Client::$jwt_data->expires >= time()) {
            throw new BadReqException("Invalid token");
        }
    } catch(Exception $e) {
        throw new BadReqException("Invalid token");
    }
}

?>
