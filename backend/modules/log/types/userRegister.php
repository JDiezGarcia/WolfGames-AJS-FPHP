<?php

class UserRegister {

    public $user;
    public $email;
    public $pass;
    public $name;
    public $lastName;
    public $dir;
    public $postCode;
    public $city;
    public $country;
    public $sex;
    public $birth;
    public $img = 'user-'. strval(rand ( 1 , 24 )).'.jpg';

    public function validate() {
        if (strlen($this->username) > 20) {
            throw new BadReqException('Username too Long');
        }
        if (strlen($this->password) != 32) {
            throw new BadReqException('Password Error');
        }
        if (strlen($this->username) < 3) {
            throw new BadReqException('Username too Short');
        }
        if (preg_match("/^[a-zA-Z]*$/", $this->user)) {
            throw new BadReqException('Invalid Username');
        }
        if (preg_match("/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/", $this->email)) {
            throw new BadReqException('Invalid Email');
        }
        if (preg_match("/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/", $this->pass)) {
            throw new BadReqException('Invalid Password');
        }
        if (preg_match("/^[a-zA-Z]*$/", $this->name)) {
            throw new BadReqException('Invalid Name');
        }

    }
}
