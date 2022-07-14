<?php

$payload = json_decode(file_get_contents("php://input"), true);
$user_pdo = new User($PDO);
$username = strtolower($payload['user']);
$user = $user_pdo->get($username);

// workaround for user without password
if (isset($user) && !isset($user['password'])) {
    $user['password'] = md5($user['first_password']);
}

// check credentials and generate jwt on success
if ($user && str_replace('"', '', $user['password']) == $payload['pwd']) {
    $user['isAdmin'] = $user['is_admin'] == 1;
    $user['firstLogin'] = $user['first_login'] == 1;
    unset($user['password']);
    unset($user['first_password']);
    unset($user['is_admin']);
    unset($user['first_login']);
    $jwtData = $user;
    $jwt_and_expire_date = generateJWT($jwtData);

    respondJSON(201, $jwt_and_expire_date);

// credentials are wrong
} else {
    respondErrorMsg(401, "invalid credentials");
}