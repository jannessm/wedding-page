<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");

    $BASE = __DIR__ . '/../../';

    require_once($BASE . 'autoload.php');

    if (!validJWT() && !isset($POST) && !isset($_GET['login'])) {
        respondErrorMsg(401, "No valid credentials nor valid JWT.");
    }

    // TODO: only include username in jwt and get curr user obj if valid token

    // login
    if (isset($_POST) && isset($_GET['login'])) {
        include($BASE . "api/auth/login.php");
    }

    // validateJWT
    if (isset($_POST) && isset($_GET['validate'])) {

        if (!validJWT()) {
            respondErrorMsg(401, "invalid JWT");
        }
        respondJSON(201, "valid JWT");
    }

    // change Pwd
    if (isset($_POST) && isset($_GET['change-password'])) {
        include($BASE . "api/auth/change-password.php");
    }
