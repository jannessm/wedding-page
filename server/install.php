<?php

$BASE = './';

function randomPassword() {
    $alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    $pass = array(); //remember to declare $pass as an array
    $alphaLength = strlen($alphabet) - 1; //put the length -1 in cache
    for ($i = 0; $i < 8; $i++) {
        $n = rand(0, $alphaLength);
        $pass[] = $alphabet[$n];
    }
    return implode($pass); //turn the array into a string
}

if (!file_exists('config/secrets.php')) {
    $conf = '<?php
$serverName = "'.$_GET['host'].'";
$sqliteFile = $BASE . "data.db";

$jwtPrivateKey = file_get_contents($BASE . "config/jwtRS256.key");
$jwtPublicKey = file_get_contents($BASE . "config/jwtRS256.key.pub");

$fileKey = "'.randomPassword().'";
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
