<?php

use Utils\res;

class LogModel extends Model {
    function select_user($user, $pass){
        $sql = "SELECT user, img FROM users WHERE user = '$user' OR email = '$user' AND pass = '$pass'";
        $res = $this->db->query($sql)->query->fetch_all(MYSQLI_ASSOC)[0];
        return $res;
    }
}
?>
