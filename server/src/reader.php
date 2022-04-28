<?php
require_once($BASE . 'config/secrets.php');

$ALGO = 'AES-128-CBC';

function get_files($filename) {
    $files = [[0,$filename]];
    $base_file = explode(".", basename($filename))[0];
    foreach (scandir(dirname($filename)) as $f) {
        $splitted = explode(".", basename($f));

        if (count($splitted) < 2) {
            continue;
        }
        
        $file_without_date = $splitted[0];
        $date = strtotime($splitted[1]);
        if (strcmp($file_without_date, $base_file) === 0) {
            array_push($files, [$date, dirname($filename) . '/' . $f]);
        }
    }

    uasort($files, 'sort_files');

    if (count($files) > 10) {
        foreach (array_slice($files, 0, count($files) - 10) as $f) {
            if (file_exists($f[1])) {
                unlink($f[1]);
            }
        }
    }

    return $files;
}

function sort_files($a, $b) {
    return $a[0] - $b[0];
}

function read_file($filename) {
    global $ALGO, $fileKey;
    $result = "{}";

    $files = get_files($filename);
    $last_file = array_pop($files)[1];

    if (file_exists($last_file)) {
        $content = file_get_contents($last_file);
        return openssl_decrypt($content, $ALGO, md5('password'), 0, $fileKey);
    }

    return $result;
}

function write_file($filename, $content) {
    global $ALGO, $fileKey;
    $encrypted = openssl_encrypt($content, $ALGO, md5('password'), 0, $fileKey);
    $timestamp = new DateTime();
    get_files($filename);
    file_put_contents($filename . "." . $timestamp->format("c"), $encrypted);
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
