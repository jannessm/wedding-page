<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");

    $BASE = __DIR__ . '/../../';

    require_once($BASE . 'autoload.php');

    // check JWT
    if (!validJWT()) {
        respondErrorMsg(401, "Unauthorized");
    }

    // check admin rights
    $user = decodeToken(readToken())->user;
    if (!$user->isAdmin) {
        respondErrorMsg(401, "Unauthorized: Admin rights needed");
    }

    // get user data
    if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['user'])) {
        $user_data = json_decode(read_file($BASE . 'data'), true);
        respondJSON(200, filterUser($user_data));
    }

    // add user
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST) && isset($_GET['user'])) {
        include($BASE . 'api/admin/user.php');
    }
    
    // update users
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST) && isset($_GET['update-user'])) {
        $payload = json_decode(file_get_contents("php://input"), true);

        write_file($BASE . 'data', json_encode($payload));
        respondJSON(201, "");
    }

    // delete user
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST) && isset($_GET['delete-user'])) {
        $payload = json_decode(file_get_contents("php://input"), true);
        $user_data = json_decode(read_file($BASE . 'data'), true);

        unset($user_data[$payload['name']]);

        write_file($BASE . 'data', json_encode($user_data));
        
        respondJSON(201, filterUser($user_data));
    }

    // reset passwort for user
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST) && isset($_GET['reset-pwd'])) {
        $payload = json_decode(file_get_contents("php://input"), true);
        $user_data = json_decode(read_file($BASE . 'data'), true);

        $user_data[$payload['name']]['password'] = md5($user_data[$payload['name']]['firstPassword']);
        $user_data[$payload['name']]['firstLogin'] = true;

        write_file($BASE . 'data', json_encode($user_data));
        
        respondJSON(201, "done");
    }