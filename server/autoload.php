<?php

    require_once("src/jwt.php");
    require_once("src/messages.php");

    require_once("src/sqlite_conn.php");
    require_once("src/guests.php");
    require_once("src/user.php");
    require_once("src/budget_costcenters.php");
    require_once("src/budget_categories.php");

    $sqlconn = new SQLiteConnection();
    $PDO = $sqlconn->connect();