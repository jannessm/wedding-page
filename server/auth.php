<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");

    include 'reader.php';

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