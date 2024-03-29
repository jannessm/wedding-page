<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");

    $BASE = __DIR__ . '/../../';

    require_once($BASE . 'autoload.php');

    if (!validJWT() && !isset($POST) && !isset($_GET['login'])) {
        respondErrorMsg(401, "No valid credentials nor valid JWT.");
        exit();
    }

    // login
    if (isset($_POST) && isset($_GET['login'])) {
        include($BASE . "api/auth/login.php");
        exit();
    }

    // validateJWT
    if (isset($_POST) && isset($_GET['validate'])) {
        include($BASE . "api/auth/validate.php");
        exit();
    }

    // change Pwd
    if (isset($_POST) && isset($_GET['change-password'])) {
        include($BASE . "api/auth/change-password.php");
        $sqlconn->backup();
        exit();
    }

    // get guests
    if (isset($_POST) && isset($_GET['guests'])) {
        include($BASE . "api/auth/get-guests.php");
        exit();
    }

    // update User
    if (isset($_POST) && isset($_GET['update-guests'])) {
        include($BASE . "api/auth/update-guests.php");
        $sqlconn->backup();
        exit();
    }
