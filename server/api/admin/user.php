<?php

function addUser() {
    global $BASE;
    $payload = json_decode(file_get_contents("php://input"), true);
    $user_data = json_decode(read_file($BASE . 'data'), true);
    $username = strtolower($payload['name']);
    
    // if user already exists return error
    if (isset($username) && isset($user_data[$username])) {
        respondErrorMsg(401, 'user already exists');
    
    } else if (isset($username)) {
        $newUser = array(
            'name' => $username,
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
    
        $user_data[$username] = $newUser;
    
        write_file($BASE . 'data', json_encode($user_data));
    
        respondJSON(201, filterUser($user_data));
    } else {
        respondErrorMsg(401, 'invalid request');
    }
}

function updateAdminRights() {
    global $PDO;
    $USER = new User($PDO);
    $payload = json_decode(file_get_contents("php://input"), true);

    $USER->update_admin_rights($payload['name'], $payload['is_admin']);

    respondJSON(201, "done");
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
    $username = strtolower($payload['name']);

    unset($user_data[$username]);

    write_file($BASE . 'data', json_encode($user_data));
    
    respondJSON(201, filterUser($user_data));
}

function resetPwd() {
    global $BASE, $PDO;
    $payload = json_decode(file_get_contents("php://input"), true);

    $USER = new User($PDO);
    $username = strtolower($payload['name']);
    $user_data = $USER->get($username);

    $USER->update_password($username, md5($user_data['first_password']), TRUE);
    
    respondJSON(201, $user_data['first_password']);
}

?>