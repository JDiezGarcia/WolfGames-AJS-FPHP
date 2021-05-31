<?php

//Para llamar encapsular todas las funciones en use Utils\[function] o directamente Utils\[funcion]
namespace Utils;

//Se le pasa los datos($array) y el objetoclase ($obj) $prevent_xss ejem:<> &gt;&lt; ANTI ATAQUES
function array_to_obj($array, $obj, $prevent_xss = false) { // Simple array to object
    foreach ($array as $key => $value) {
        //Comprueba la propiedad de la clase si existe
        if (property_exists($obj, $key)) {
            if ($prevent_xss && is_string($value)) {
                $value = htmlentities($value);
            }
            try {
                $obj->{$key} = $value;
            } catch(\TypeError $e) {
                throw new \BadReqException("Invalid " . $key . " value");
            }
        }
    }
}

function remove_file($location) {
    return unlink($location);
}
//Si es post
function is_post(){
    return !empty($_POST);
}

//tipo de metodo
function get_method(){
    return $_SERVER['REQUEST_METHOD'];
}

//Da la respuesta al cliente
class res {
    static function redirect($location) {
        header('HTTP/1.1 302 Moved Temporarily');
        header('Location: ' . $location);
    }
    static function notfound($str) {
        http_response_code(404);
        echo json_encode(array(
            "success" => false,
            "error" => $str . " not found"
        ));
    }
    static function error($str, $code = 400) {
        http_response_code($code);
        echo json_encode(array(
            'success' => false,
            'error' => $str
        ));
    }
    static function sys_error($exception) {
        http_response_code(500);
        error_log(json_encode($exception), 0);
        echo json_encode(array(
            'success' => false,
            'error' => 'An error ocurred'
        ));
    }
    static function ok($val = null) {
        if ($val) {
            echo json_encode(array(
                'success' => true,
                'content' => $val
            ));
        } else {
            echo json_encode(array(
                'success' => true
            ));
        }
    }
}
/*
Para la carga de imagenes por post
function save_image(string $img_name, string $file_path) {
    $imageFileType = strtolower(pathinfo($file_path,PATHINFO_EXTENSION));
    if ($imageFileType == 'jpg') {
        if (!move_uploaded_file($_FILES[$img_name]['tmp_name'], $file_path)) {
            throw new \Exception('Error saving file');
        }
    }
}
function is_image($filename) {
    if (array_key_exists($filename, $_FILES)) {
        if ($_FILES[$filename]['size'] > 0) {
            return true;
        }
    } 
    return false;
}*/
?>
