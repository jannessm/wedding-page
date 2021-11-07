<?php

$payload = json_decode(file_get_contents("php://input"), true);
$user_data = json_decode(read_file($BASE . 'data'), true);
$username = strtolower($payload['user']);

// workaround for user without password
if (isset($user_data[$username]) && !isset($user_data[$username]['password'])) {
    $user_data[$username]['password'] = md5($user_data[$username]['firstPassword']);
}

// check credentials and generate jwt on success
if ($user_data[$username] && $user_data[$username]['password'] == $payload['pwd']) {
    
    unset($user_data[$username]['password']);
    $jwtData = $user_data[$username];
    $jwtData['name'] = $username;
    $jwt_and_expire_date = generateJWT($jwtData);

    respondJSON(201, $jwt_and_expire_date);

// credentials are wrong
} else {
    respondErrorMsg(401, "invalid credentials");
}