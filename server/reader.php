<?php
$ALGO = 'AES-128-CBC';
$IV = 'p&shzVZhr=5{L^Yt';

function read_file($filename) {
    global $ALGO, $IV;
    $content = file_get_contents($filename);
    return openssl_decrypt($content, $ALGO, md5('password'), 0, $IV);
}

function write_file($filename, $content) {
    global $ALGO, $IV;
    $encrypted = openssl_encrypt($content, $ALGO, md5('password'), 0, $IV);
    file_put_contents($filename, $encrypted);
}

function encrypt_file($in, $out) {
    $content = file_get_contents($in);
    write_file($out, $content);
}
?>