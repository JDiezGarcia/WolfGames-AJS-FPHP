<?php

use Utils\res;

class LogModel extends Model {
    function select_user($user, $pass) {
        $sql = "SELECT userCod, user, email, img, verify FROM users WHERE user = '$user' OR email = '$user' AND pass = '$pass'";
        $res = $this->db->query($sql)->query->fetch_all(MYSQLI_ASSOC)[0];
        return $res;
    }
    function insert_user($user, $email, $pass, $name, $lastName, $dir, $postCode, $city, $country, $sex, $birth, $img) {
        $sql = "SELECT insertUser(
                    '$user',
                    '$email',
                    '$pass',
                    '$name',
                    '$lastName',
                    '$dir',
                   '$postCode',
                    '$city',
                    '$country',
                    '$sex',
                    '$birth',
                    '$img'
            ) AS result";
        $res = $this->db->query($sql)->query->fetch_all(MYSQLI_ASSOC)[0];
        return $res;
    }

    function verify_user($user) {
        $sql = "SELECT verify('$user') AS result";
        $res = $this->db->query($sql)->query->fetch_all(MYSQLI_ASSOC)[0];
        return $res;
    }

    function recover_pass($user) {
        $res = $this->db->query("CALL recover('$user')")->query->fetch_all(MYSQLI_ASSOC)[0];
        return $res;
    }

    function change_pass($user, $pass) {
        $sql = "SELECT changePass('$user', '$pass') AS result";
        $res = $this->db->query($sql)->query->fetch_all(MYSQLI_ASSOC)[0];
        return $res;
    }

    function select_social_user($userCod,$user,$email,$pass,$img){
        $res = $this->db->query("CALL insertSocialUser('$userCod','$user','$email', '$pass', '$img')")->query->fetch_all(MYSQLI_ASSOC)[0];
        return $res;
    }
}
