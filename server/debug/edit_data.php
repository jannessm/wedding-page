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

// header('Content-Type: application/json');
$data = json_decode(read_file('../data'), true);
// var_dump($data);
foreach($data as $username => $user) {
    // $user['firstPassword'] = getRandomString(8);
    // $user['firstLogin'] = true;

    foreach($user['guests'] as $id => $guest) {
        // $user['guests'][$id]['isRegistered'] = null;
        $user['guests'][$id]['allergies'] = [];
        $user['guests'][$id]['otherAllergies'] = '';
    }
    
    $data[$username] = $user;
}

write_file('../data', json_encode($data));
