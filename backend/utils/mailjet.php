<?php
namespace Utils;

class MailJet {
    public static $from_email;
    public static $from_name;
    public static $url;
    public static $key;
    public static function set_config($config) {
        self::$from_email = $config['email'];
        self::$from_name = $config['name'];
        self::$key = $config['key'];
        self::$url = $config['url_api'];
    }
    public static function send_message($to, $subj, $text_content){
        $url = self::$url;
        $key = self::$key;
        $curl = curl_init($url);
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        $headers = array(
           "Content-Type: application/json",
           "Authorization: Basic $key",
        );
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
        
        $data = json_encode([
            'Messages' => [
                0 => [
                    'From' => [
                        'Email' => self::$from_email,
                        'Name' => self::$from_name,
                    ],
                    'To' => [
                        0 => [
                            'Email' => $to,
                        ],
                    ],
                    'Subject' => $subj,
                    'TextPart' => $text_content,
                ],
            ],
        ]);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);        
        $resp = curl_exec($curl);
        curl_close($curl);
        return $resp;
    }

    public static function verify_accout($data){				
        $message = preg_replace('/^\s*/g', '', <<<EOM
        Hello!
                            
        You have requested to verify your email address on JJCars for {$data['user']['user']}.
        Click on the following link to verify your account:
        http://localhost:8080/api/auth/verify?uid={$data['user']['uid']}&token={$data['token']}

        If you didn't request the verification you may safely ingore this email, the token expires in 6 hours.
                            
        -- JJCars
        EOM);
				$mailer->send_mail($data['user']['email'], 'Mail verification', $message);
    }
}

MailJet::set_config(get_json_data("mailjet"));

?>