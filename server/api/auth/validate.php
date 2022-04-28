<?php

if (!validJWT()) {
    respondErrorMsg(401, "invalid JWT");
}

$user_data = json_decode(read_file($BASE . 'data'), true);
$token = decodeToken(readToken());

$user = $user_data[$token->user->name];

// refresh jwt
respondJSON(201, generateJWT($user));