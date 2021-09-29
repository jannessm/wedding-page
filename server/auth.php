<?php
    require __DIR__ . '/vendor/autoload.php';

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");

    include 'reader.php';

    function initSession($username) {
        $secretKey  = 'bGS6lzFqvvSQ8ALbOxatm7/Vk7mLQyzqaS34Q4oR1ew=';
        $issuedAt   = new DateTimeImmutable();
        $expire     = $issuedAt->modify('+24 hours')->getTimestamp();      // Add 60 seconds
        $serverName = "tina-jannes.magnusson.berlin";

        $data = [
            'iat'  => $issuedAt->getTimestamp(),         // Issued at: time when the token was generated
            'iss'  => $serverName,                       // Issuer
            'nbf'  => $issuedAt->getTimestamp(),         // Not before
            'exp'  => $expire,                           // Expire
            'userName' => $username,                     // User name
        ];

        return JWT::encode(
            $data,
            $secretKey,
            'HS512'
        );
    }

    if (isset($_POST)) {
        $payload = json_decode(file_get_contents("php://input"), true);
        $user_data = json_decode(read_file('data'), true);

        if (isset($user_data[$payload['user']]) && !isset($user_data[$payload['user']]['password'])) {
            $user_data[$payload['user']]['password'] = md5($user_data[$payload['user']]['firstPassword']);
        }

        if ($user_data[$payload['user']] && $user_data[$payload['user']]['password'] == $payload['pwd']) {
            unset($user_data[$payload['user']]['password']);
            echo json_encode($user_data[$payload['user']]);
            exit;
        }
        echo json_encode(array("error" => "crendentials incorrect!"));
    }
?>