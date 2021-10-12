<?php

$ALGO = 'AES-128-CBC';

function read_file($filename) {
    global $ALGO, $fileKey;
    if (file_exists($filename)) {
        $content = file_get_contents($filename);
        return openssl_decrypt($content, $ALGO, md5('password'), 0, $fileKey);
    } else {
        return "{}"; // empty json
    } 
}

function write_file($filename, $content) {
    global $ALGO, $fileKey;
    $encrypted = openssl_encrypt($content, $ALGO, md5('password'), 0, $fileKey);
    file_put_contents($filename, $encrypted);
}

if (!file_exists('data')) {
    require_once('src/pwd.php');


    if (!isset($_GET['user'])) {
        echo "No username specified. Please read the documentation how to install this server.";
        exit();
    }
    if (!isset($_GET['pwd'])) {
        echo "No admin password specified. Please read the documentation how to install this server.";
    }


    // generate data encryption pwd
    $dataPwd = generatePwd();
    $host = parse_url($_SERVER['HTTP_HOST'])['host'];
    $secrets = "<?php
\$servername = \"$host\";


\$jwtPrivateKey = file_get_contents(\$BASE . \"config/jwtRS256.key\");
\$jwtPublicKey = file_get_contents(\$BASE . \"config/jwtRS256.key.pub\");

\$fileKey = \"$dataPwd\";
";
    file_put_contents('config/secrets.php', $secrets);


// create admin
    $user = $_GET['user'];
    $pwd = $_GET['pwd'];

    $data = array(
        'isAdmin' => true,
        'firstPassword' => $pwd,
        'firstLogin' => false,
        'guests' => array(),
        'password' => md5($pwd)
    );

    write_file('data', json_encode($data));

    echo "DONE!";

} else {
    echo "Setup was already done. Aborted setup.";
}
