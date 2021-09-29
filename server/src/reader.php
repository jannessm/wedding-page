<?php
require_once($BASE . 'config/secrets.php');

$ALGO = 'AES-128-CBC';

function read_file($filename) {
    global $ALGO, $fileKey;
    $content = file_get_contents($filename);
    return openssl_decrypt($content, $ALGO, md5('password'), 0, $fileKey);
}

function write_file($filename, $content) {
    global $ALGO, $fileKey;
    $encrypted = openssl_encrypt($content, $ALGO, md5('password'), 0, $fileKey);
    file_put_contents($filename, $encrypted);
}

function filterUser($data) {
    foreach($data as $key => $value) {
        unset($value['password']);
        $data[$key] = $value;
    }
    return $data;
}

function encrypt_file($in, $out) {
    $content = file_get_contents($in);
    write_file($out, $content);
}
