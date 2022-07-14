<?php

if (!validJWT()) {
    respondErrorMsg(401, "invalid JWT");
}

$user_pdo = new User($PDO);
$token = decodeToken(readToken());

$user = $user_pdo->get($token->user->name);

// refresh jwt
respondJSON(201, generateJWT($user_pdo->filter($user)));