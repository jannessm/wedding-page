<?php

$payload = json_decode(file_get_contents("php://input"), true);
$user_data = json_decode(read_file($BASE . 'data'), true);

// workaround for user without password
if (isset($user_data[$payload['user']]) && !isset($user_data[$payload['user']]['password'])) {
    $user_data[$payload['user']]['password'] = md5($user_data[$payload['user']]['firstPassword']);
}

// check credentials and generate jwt on success
if ($user_data[$payload['user']] && $user_data[$payload['user']]['password'] == $payload['pwd']) {
    
    unset($user_data[$payload['user']]['password']);
    $jwtData = $user_data[$payload['user']];
    $jwt_and_expire_date = generateJWT($jwtData);

    respondJSON(201, $jwt_and_expire_date);

// credentials are wrong
} else {
    respondErrorMsg(401, "invalid credentials");
}