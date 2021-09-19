<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");

    include 'reader.php';

    if (isset($_POST)) {
        $payload = json_decode(file_get_contents("php://input"), true);
        $user_data = json_decode(read_file('data'), true);

        foreach ($user_data as $user) {
            if ($user['name'] == $payload['user'] && $user['password'] == $payload['pwd']) {
                unset($user['password']);
                echo json_encode($user);
                exit;
            }
        }
        echo json_encode(array("error" => "crendentials incorrect!"));
    }
?>