<?php

use Utils\res;

class CartModel extends Model {
    function insert_lines($games, $user){
        try{
            $order = $this->db->query("CALL selectOrder('$user')")->query->fetch_all(MYSQLI_ASSOC)[0];
            $sql = "SET AUTOCOMMIT = 0; START TRANSACTION; INSERT INTO order_lines (idOrder, gameCod, quantity) VALUES";
            foreach ($games as $i => $game) {
                if ($i != 0) {
                    $sql.= ",";
                }
                $sql.= "($order, '{$game['gameCod']}', {$game['qty']})";
            }
            $sql.=" ON DUPLICATE KEY UPDATE quantity = values(quantity)";
            $this->db->query($sql);
            $this->db->query("COMMIT");
        }catch(MysqlException $e) {
            $this->db->query("ROLLBACK");
            throw $e;
        } finally {
            $this->db->query("SET AUTOCOMMIT = 1");
        }
    }

    function select_order($user) {			
        $order = $this->db->query("CALL selectHeader('$user')")->query->fetch_all(MYSQLI_ASSOC)[0];
        $res = $this->db->query("CALL retrieveOrder('{$order['idOrder']}')")->query->fetch_all(MYSQLI_ASSOC);
        return $res;
    }

    function cart_checkout($user){
        $res = $this->db->query("CALL checkOut('$user')")->query->fetch_all(MYSQLI_ASSOC);
        return $res;
    }
}
