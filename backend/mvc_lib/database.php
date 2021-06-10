<?php

use Utils;

class Database {
    public static $static_conn;
    public $conn;

    //Singleton
    public function connect() {
        if (!isset(Database::$static_conn)) {
            $conData = Utils\get_json_data("db");
            Database::$static_conn = new mysqli($conData["ip"], $conData['user'], $conData['pass'], $conData['name']);
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
        //BINDPARAMS
        $stmt = $this->conn->prepare($query_str);
        if (!$stmt) {
            throw new MysqlException('Error invalid prepared query ' . $query_str);
        }
        
        if (count($values) > 0) {
            $stmt->bind_param($types, ...$values);
        }

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

    public function transaction() {
        $this->conn->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
    }

    public function commit() {
        $this->conn->commit();
    }
    public function rollback() {
        $this->conn->rollback();
    }
    public function autocommit($bol) {
        $this->conn->autocommit($bol);
    }
}

?>
