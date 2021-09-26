<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");

    include 'reader.php';

    // TODO: TOKEN for authetification

    // get all user data
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $user_data = json_decode(read_file('data'), true);
        echo json_encode(filterUser($user_data));
    }

    // add user
    else if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST) && isset($_GET['add'])) {
        $payload = json_decode(file_get_contents("php://input"), true);
        $user_data = json_decode(read_file('data'), true);

        // if user already exists return error
        if (isset($user_data[$payload['name']]) || !isset($payload['name'])) {
            echo json_encode(array("error" => "user already exists!"));
            exit;
        } else {
            $newUser = array(
                'isAdmin' => $payload['isAdmin'],
                'firstPassword' => $payload['firstPassword'],
                'firstLogin' => $payload['firstLogin'],
                'guests' => array(),
                'password' => md5($payload['firstPassword'])
            );

            foreach($payload['guests'] as $guest) {
                array_push($newUser['guests'], array(
                    'name' => $guest['name'],
                    'lastname' => $guest['lastname'],
                    'age' => $guest['age'],
                    'diet' => $guest['diet'],
                    'song' => $guest['song'],
                    'isRegistered' => $guest['isRegistered'],
                    'allergies' => $guest['allergies']
                ));
            }

            $user_data[$payload['name']] = $newUser;

            write_file('data', json_encode($user_data));

            echo json_encode(filterUser($user_data));
        }
    } else {
        echo json_encode(array("error" => "no valid request"));
    }
?>