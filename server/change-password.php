<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");

    include 'reader.php';

    if (isset($_POST)) {
        $payload = json_decode(file_get_contents("php://input"), true);
        $user_data = json_decode(read_file('data'), true);
        var_dump($user_data);

        if ($user_data[$payload['user']] && $user_data[$payload['user']]['password'] == $payload['pwd']) {
            $user = $user_data[$payload['user']];
            
            // write password
            $user_data[$payload['user']]['password'] = $payload['newPwd'];
            $user_data[$payload['user']]['firstLogin'] = false;
            write_file('data', json_encode($user_data));
            
            // return new user object
            unset($user_data[$payload['user']]['password']);
            echo json_encode($user_data[$payload['user']]);
            exit;
        }

        echo json_encode(array("error" => "crendentials incorrect!"));
    }
?>