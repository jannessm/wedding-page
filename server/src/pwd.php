<?php

function generatePwd($len = 12) {
    $pwd = '';

    $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890.,:;!()=?{[]}+#*-_<>';

    for ($i = 0; $i < $len; $i++) {
        $pwd .= $chars[rand(0, strlen($chars) - 1)];
    }

    return $pwd;
}