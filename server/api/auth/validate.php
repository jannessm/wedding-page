<?php

if (!validJWT()) {
    respondErrorMsg(401, "invalid JWT");
}

$user_pdo = new User($PDO);
$token = decodeToken(readToken());

$user = $user_pdo->get($token->user->name);

$user['isAdmin'] = $user['is_admin'] == 1;
unset($user['password']);
unset($user['first_password']);
unset($user['is_admin']);

// refresh jwt
respondJSON(201, generateJWT($user));