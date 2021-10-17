<?php

$BASE = '../';

include "../src/reader.php";

function getRandomString($n) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $randomString = '';
  
    for ($i = 0; $i < $n; $i++) {
        $index = rand(0, strlen($characters) - 1);
        $randomString .= $characters[$index];
    }
  
    return $randomString;
}

$data = json_decode(read_file('../data'), true);
foreach($data as $username => $user) {

    foreach($user['guests'] as $id => $guest) {
    }
    
    $data[$username] = $user;
}

write_file('../data', json_encode($data));
