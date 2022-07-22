<?php

$BASE = './';

if (!file_exists('config/secrets.php')) {
    $conf = '<?php
$serverName = localhost;
$sqliteFile = $BASE . "data.db";
    ';

    file_put_contents('config/secrets.php', $conf);
}

require_once('config/secrets.php');

if (!file_exists('data.db')) {
    require_once('./autoload.php');

    $u = new User($PDO);
    $g = new Guests($PDO);
    $cat = new BudgetCategories($PDO);
    $cc = new BudgetCostCenters($PDO);

    $user = $_GET['user'];
    $pwd = $_GET['pwd'];

    $new_user = [
        "name" => $user,
        "first_password" => $pwd,
        "is_admin" => True,
        "first_login" => False,
        "password" => md5($pwd)
    ];

    $u->add($new_user);

    echo "DONE!";

} else {
    echo "Setup was already done. Aborted setup.";
}
