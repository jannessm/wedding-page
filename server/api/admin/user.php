<?php

function addUser() {
    global $PDO;
    $payload = json_decode(file_get_contents("php://input"), true);
    $USER = new User($PDO);

    $username = strtolower($payload['name']);

    $user_data = $USER->get($username);

    // if user already exists return error
    if (isset($username) && isset($user_data) && $user_data !== false) {
        respondErrorMsg(401, 'user already exists');
    
    } else if (isset($username)) {
        $newUser = array(
            'name' => $username,
            'is_admin' => $payload['isAdmin'],
            'first_password' => $payload['firstPassword'],
            'password' => md5($payload['firstPassword'])
        );

        $USER->add($newUser);

        $user = $USER->get($username);
    
        respondJSON(201, $USER->filter($user));
    } else {
        respondErrorMsg(401, 'invalid request');
    }
}

function updateAdminRights() {
    global $PDO;
    $USER = new User($PDO);
    $payload = json_decode(file_get_contents("php://input"), true);

    $USER->update_admin_rights(strtolower($payload['name']), $payload['is_admin']);

    respondJSON(201, "done");
}

function deleteUser() {
    global $PDO;
    $payload = json_decode(file_get_contents("php://input"), true);
    $USER = new User($PDO);
    
    $username = strtolower($payload['name']);

    $user = $USER->get($username);

    if ($user !== false) {
        $USER->delete($username);
        respondJSON(201, $USER->filter($user));
    }
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