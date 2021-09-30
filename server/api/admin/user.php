<?php

    // add user
    $payload = json_decode(file_get_contents("php://input"), true);
    $user_data = json_decode(read_file($BASE . 'data'), true);

    // if user already exists return error
    if (!isset($user_data[$payload['name']]) || !isset($payload['name'])) {
        respondErrorMsg(401, 'user already exists');
    
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
                'uuid' => $guest['uuid'],
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

        write_file($BASE . 'data', json_encode($user_data));

        respondJSON(201, filterUser($user_data));
    }
?>