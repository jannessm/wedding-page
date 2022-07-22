<?php

$payload = json_decode(file_get_contents("php://input"), true);
$USER = new User($PDO);

$user = $USER->get($payload['user']);
$user['password'] = str_replace('"', '', $user['password']);

if (isset($user) && !isset($user['password'])) {
    $user['password'] = md5($user['firstPassword']);
}

// var_dump($user['password'], $payload['pwd'], $user['password'] == $payload['pwd']);

if (!!$user && $user['password'] === $payload['pwd']) {
    // write password
    $USER->update_password($payload['user'], $payload['newPwd']);
    
    // return new user object
    respondJSON(201, "password changed");

} else {
    respondErrorMsg(401, "invalid credentials");  
}