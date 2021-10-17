<?php

function addUser() {
    global $BASE;
    $payload = json_decode(file_get_contents("php://input"), true);
    $user_data = json_decode(read_file($BASE . 'data'), true);
    
    // if user already exists return error
    if (isset($payload['name']) && isset($user_data[$payload['name']])) {
        respondErrorMsg(401, 'user already exists');
    
    } else if (isset($payload['name'])) {
        $newUser = array(
            'name' => $payload['name'],
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
                'allergies' => $guest['allergies'],
                'otherAllergies' => $guest['otherAllergies'],
            ));
        }
    
        $user_data[$payload['name']] = $newUser;
    
        write_file($BASE . 'data', json_encode($user_data));
    
        respondJSON(201, filterUser($user_data));
    } else {
        respondErrorMsg(401, 'invalid request');
    }
}

function updateUser() {
    global $BASE;
    $payload = json_decode(file_get_contents("php://input"), true);
    $user_data = json_decode(read_file($BASE . 'data'), true);

    foreach ($payload as $user => $userObj) {
        $payload[$user]['password'] = $user_data[$user]['password'];
    }

    write_file($BASE . 'data', json_encode($payload));
    respondJSON(201, "");
}

function deleteUser() {
    global $BASE;
    $payload = json_decode(file_get_contents("php://input"), true);
    $user_data = json_decode(read_file($BASE . 'data'), true);

    unset($user_data[$payload['name']]);

    write_file($BASE . 'data', json_encode($user_data));
    
    respondJSON(201, filterUser($user_data));
}

function resetPwd() {
    global $BASE;
    $payload = json_decode(file_get_contents("php://input"), true);
    $user_data = json_decode(read_file($BASE . 'data'), true);

    $user_data[$payload['name']]['password'] = md5($user_data[$payload['name']]['firstPassword']);
    $user_data[$payload['name']]['firstLogin'] = true;

    write_file($BASE . 'data', json_encode($user_data));
    
    respondJSON(201, "done");
}

?>