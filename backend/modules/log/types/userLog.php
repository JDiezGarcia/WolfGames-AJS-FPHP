<?php

class UserLog {

    public $username;
    public $password;
    
    public function validate() {
        if (strlen($this->username) > 20) {
            throw new BadReqException('Username too Long');
        }
        if (strlen($this->password) > 20) {
            throw new BadReqException('Password too Long');
        }
        if (strlen($this->username) < 3) {
            throw new BadReqException('Username too Short');
        }
        if (strlen($this->password) < 3) {
            throw new BadReqException('Password too Short');
        }
        if (preg_match("/^([a-zA-Z]+|[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3}))$/)/", $this->username)) {
            throw new BadReqException('Invalid Username');
        }
        if (preg_match("/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/", $this->username)) {
            throw new BadReqException('Invalid Password');
        }
    }
}
?>