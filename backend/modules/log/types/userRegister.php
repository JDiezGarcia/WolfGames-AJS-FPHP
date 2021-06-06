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
    public $img;

    public function __construct(){
        $this->img = 'user-' . strval(rand(1, 24)) . '.jpg';
    }

    public function validate() {

        //---------[REGULAR EXPRESSIONS]----------\\
        if (!preg_match("/^[a-zA-Z]*$/", $this->user)) {
            throw new BadReqException('Invalid User');
        }

        if (!preg_match("/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/", $this->email)) {
            throw new BadReqException('Invalid Email');
        }

        if (!preg_match("/[A-Za-z0-9'\.\-\s\,]/", $this->dir)) {
            throw new BadReqException('Invalid Address');
        }
        foreach ([$this->name, $this->lastName, $this->city, $this->country] as $i) {
            if (!preg_match("/^([A-Za-zÀ-ÖØ-öø-ÿ'.]+(?: [A-Za-zÀ-ÖØ-öø-ÿ'.]+){0,2})$/", $i)) {
                throw new BadReqException($i. ' is Invalid');
            }
        }

        //---------[VALID LENGTH]----------\\
        if (strlen($this->pass) != 32) {
            throw new BadReqException('Invalid Password');
        }
        if ((strlen($this->lastName) < 3) || (strlen($this->name) < 3)) {
            throw new BadReqException('Name to Short');
        }
        foreach ([$this->dir, $this->email] as $i) {
            if (strlen($i) > 50) {
                throw new BadReqException($i . ' is too Long');
            }
        }
        foreach ([$this->email, $this->postCode] as $i) {
            if (strlen($i) < 5) {
                throw new BadReqException($i . ' is too Short');
            }
        }
        if (strlen($this->dir) < 10) {
            throw new BadReqException('Address too Short');
        }
        foreach ([$this->city, $this->country, $this->user] as $i) {
            if (strlen($i) < 4) {
                throw new BadReqException($i . ' is too Short');
            }
        }
        foreach ([$this->city, $this->postCode, $this->country, $this->name, $this->lastName] as $i) {
            if (strlen($i) > 20) {
                throw new BadReqException($i . ' is too Long');
            }
        }

        //----------[ARRAY VALIDATION]----------\\
        $gen = in_array($this->sex, ["Male", "Female", "Other"]);
        if (!$gen) {
            throw new BadReqException('Invalid Gender');
        }

        //----------[DATE VALIDATION]----------\\
        $arr = explode("/", $this->birth);
        $yy = $arr[0];
        $mm = $arr[1];
        $dd = $arr[2];
        if (!checkdate($dd, $mm, $yy)) {
            throw new BadReqException($this->birth.'Invalid Date Format');
        }
    }
}
