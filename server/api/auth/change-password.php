<?php

$payload = json_decode(file_get_contents("php://input"), true);
$user_data = json_decode(read_file($BASE . 'data'), true);


if (isset($user_data[$payload['user']]) && !isset($user_data[$payload['user']]['password'])) {
    $user_data[$payload['user']]['password'] = md5($user_data[$payload['user']]['firstPassword']);
}

if ($user_data[$payload['user']] && $user_data[$payload['user']]['password'] == $payload['pwd']) {
    $user = $user_data[$payload['user']];
    
    // write password
    $user_data[$payload['user']]['password'] = $payload['newPwd'];
    $user_data[$payload['user']]['firstLogin'] = false;
    write_file($BASE . 'data', json_encode($user_data));
    
    // return new user object
    respondJSON(201, "password changed");

} else {
    respondErrorMsg(401, "invalid credentials");  
}