<?php

class Database {
    public static $static_conn;
    public $conn;

    //Singleton
    public function connect() {
        if (!isset(Database::$static_conn)) {
            Database::$static_conn = new mysqli("127.0.0.1", "javier", "la1la2la3la4", "wolf_games");
            if (Database::$static_conn->connect_errno) {
                throw new MysqlException("Error connecting to db");
            }
        }
        $this->conn = Database::$static_conn;
    }
    public function close() {
        $this->conn->close();
    }

    // Le pasamos query, types(para bindparams), valores del bindparams
    public function query($query_str, $types = '', ...$values) {
        //Si no hay conexion se conecta
        if (!isset($this->conn)) {
            $this->connect();
        }
        if (count($values) == 0 || $types == '') {
            $query = $this->conn->query($query_str);
            $result = (object) [];
            if ($query === false) {
                throw new MysqlException('Mysqli error: ' . mysqli_error($this->conn));
            } else {
                if (isset($query->insert_id)) {
                    $result->insert_id = $query->insert_id;
                }
                $result->query = $query;
                return $result;
            }
        } else {
            //BINDPARAMS
            $stmt = $this->conn->prepare($query_str);
            if (!$stmt) {
                throw new MysqlException('Error invalid prepared query ' . $query_str);
            }
            $stmt->bind_param($types, ...$values);
            if (!$stmt->execute()) {
                if ($stmt->sqlstate == 45000) {
                    throw new BadReqException($stmt->error);
                } else { 
                    throw new MysqlException('Error executing query: ' . $stmt->error);
                }
            }
            $result = (object) [];
            $result->insert_id = $stmt->insert_id;
            $result->query = $stmt->get_result();
            if ($result === false) {
                throw new MysqlException('Mysqli error: ' . mysqli_error($this->conn));
            }
            $stmt->close();
            return $result;
        }
        
    }
}

?>
