<?php

use Utils\res;

class App {

    public function __construct() {

        // uri = /api/cars/search -> ['cars','search_post']
        $uri = htmlentities(str_replace("/angularjs_fphp/api/", "", $_GET['uri'])); // Prevent xss with HTMLENTITIES
        $uri = explode('/', rtrim($uri, '/'));  // Split uri 

        Client::$uri = $uri;


        $controller_name = $uri[0] ?? '';
        $action_name = $uri[1] ?? '';
        
        //comprobar si hay middle antes y despues funcion
        try {
            //carga el controlador
            if ($controller = $this->load_controller($controller_name)) {
                //cargar la funcion
                if ($action_func = $this->load_action($controller, $action_name)) {
                    //Middleware
                    $this->call_middlewares($controller, $action_func);
                    //Function
                    $this->call_action($controller, $action_func);
                } else {
                    res::notfound($action_name);
                }
            } else {
                res::notfound($controller_name);
            }
        } catch(Exception $e) {
            $this->error_handler($e);
        }
    }

    private function error_handler($exception) {
        try {
            throw $exception;
        } catch(BadReqException $e) {
            res::error($e->getMessage());
        } catch(Exception $e) {
            res::error($e->getMessage() . '\n' . $e->getTraceAsString(), 500);
        }
    }

    private function load_controller($module_name) {
        $file_controller = 'modules/' . $module_name . '/controller.php';
        // si existe el controler le hace el require y hace new de la clase
        if (file_exists($file_controller)) { 
            require_once $file_controller;
            $class_cl_name = $module_name . 'Controller';
            $controller = new $class_cl_name;
            return $controller;
        } 
    }

    private function load_action($controller, $action_name) {
        // suma el action name (search) y el metodo y queda (search_post)
        $function_name = $action_name . '_' . strtolower(Utils\get_method());
        if (method_exists($controller, $function_name)) {
            return $function_name;
        } 
    }

    // LLama a la accion, pero antes de llamarla obtiene todos sus argumentos para transformar el Client::$data en todos sus argumentos
    private function call_action($controller, $func) {
        $reflection_method = new ReflectionMethod(get_class($controller), $func);
        $reflection_params = $reflection_method->getParameters();
        $params = array();
        $r_param_count = count($reflection_params);

        foreach ($reflection_params as $param) { // get parameters of action
            $param_name = $param->getName();
            $param_class = explode("_", $param_name)[0]; 

            if (class_exists($param_class)) {
                $obj = new $param_class(); 
                //if ternario si hay mas de uno sino uno
                Utils\array_to_obj($r_param_count > 1 ? Client::$data[$param_name] : Client::$data, $obj, true);
                
                $type_reflection = new ReflectionClass(get_class($obj));
                $props = $type_reflection->getProperties(ReflectionProperty::IS_PUBLIC);
                foreach($props as $prop) {
                    if (!isset($obj->{$prop->getName()})) {
                        throw new BadReqException("You need to specify " . $prop->getName() . " value");
                    }
                }

                //Si la clase tiene function validate la llama
                if (method_exists($obj, "validate")) {
                    $obj->validate();
                }
            } else {
                if (array_key_exists($param_name, Client::$data) && !is_null(Client::$data[$param_name])) {
                    $obj = Client::$data[$param_name];
                } else {
                    throw new BadReqException("You need to specify " . $param_name . " value");
                }
            }
            array_push($params, $obj);
        }
        $reflection_method->invokeArgs($controller, $params); // Call action
    }
    //Comprobar las funciones de cada controller
    private function call_middlewares($controller, $func) {
        $content = $controller->middlewares;
        if (count($content) > 0){
            foreach ($controller->middlewares[$func] as $middleware_function) {
                ("Middleware\\" . $middleware_function)();
            }
        }
    }
}
?>
