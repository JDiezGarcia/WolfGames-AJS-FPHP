<?php

class PassChange {

    public $user;
    public $pass;
    
    public function __construct(){
    }

    public function validate() {
        if (strlen($this->pass) != 32) {
            throw new BadReqException('Password error');
        }
        if (preg_match("/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/", $this->pass)) {
            throw new BadReqException('Invalid Password');
        }
    }
}
?>