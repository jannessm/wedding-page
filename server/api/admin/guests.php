<?php

function addGuests() {
    global $PDO;
    $payload = json_decode(file_get_contents("php://input"), true);
    $GUESTS = new Guests($PDO);

    $username = strtolower($payload['name']);

    foreach($payload['guests'] as $guest) {
        try {
            $GUESTS->add($guest);
        } catch (PDOException $e) {
            respondErrorMsg(401, 'invalid request');
            break;
        }
    }

    respondJSON(201, "done");
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