<?php

namespace Middleware;

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
            throw new \BadReqException("Invalid json data");
        }
    } else {
        $data = $_GET;
    }
    \Client::$data = $data;
}

function jwt() {

}

?>
