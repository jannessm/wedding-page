<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");

    $BASE = __DIR__ . '/../../';

    require_once($BASE . 'autoload.php');

    

    if (!validJWT() && !isset($POST) && !isset($_GET['login'])) {
        respondErrorMsg(401, "No valid credentials nor valid JWT.");
    }

    // login
    if (isset($_POST) && isset($_GET['login'])) {
        include($BASE . "api/auth/login.php");
    }

    // validateJWT
    if (isset($_POST) && isset($_GET['validate'])) {
        include($BASE . "api/auth/validate.php");
    }

    // change Pwd
    if (isset($_POST) && isset($_GET['change-password'])) {
        include($BASE . "api/auth/change-password.php");
    }

    // update User
    if (isset($_POST) && isset($_GET['update-user'])) {
        include($BASE . "api/auth/update-user.php");
    }
