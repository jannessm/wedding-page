<?php

if (!validJWT()) {
    respondErrorMsg(401, "invalid JWT");
}

$user_pdo = new User($PDO);
$token = decodeToken(readToken());

$user = $user_pdo->get($token->user->name);

unset($user->password);
unset($user->first_password);

// refresh jwt
respondJSON(201, generateJWT($user));