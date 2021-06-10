<?php

use Utils\res;

class CartModel extends Model {
    function insert_lines($games, $user){
        try{
            $order = $this->db->query("CALL selectHeader('$user')")->query->fetch_all(MYSQLI_ASSOC)[0];
            $this->db->autocommit(FALSE);
            $this->db->transaction();
            $this->db->query("DELETE FROM order_lines WHERE idOrder = {$order['idOrder']} ");
            $sql = "INSERT INTO order_lines (idOrder, gameCod, quantity) VALUES";
            foreach ($games as $i => $game) {
                if ($i != 0) {
                    $sql.= ",";
                }
                $sql.= "({$order['idOrder']}, '{$game['gameCod']}', {$game['quantity']})";
            }
            $this->db->query($sql);
            $this->db->commit();
        }catch(MysqlException $e) {
            $this->db->rollback();
            throw $e;
        } finally {
            $this->db->autocommit(TRUE);
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
