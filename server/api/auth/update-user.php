<?php

$payload = json_decode(file_get_contents("php://input"), true);
$user_data = json_decode(read_file($BASE . 'data'), true);


if ($payload['guests'] && $user_data[$payload['name']]) {
    $user = $user_data[$payload['name']];
    
    // update guests
    foreach ($user['guests'] as $key => $guest) {
        $user['guests'][$key]['isComing'] = $payload['guests'][$key]['isComing'];
        $user['guests'][$key]['diet'] = $payload['guests'][$key]['diet'];
        $user['guests'][$key]['allergies'] = $payload['guests'][$key]['allergies'];
        $user['guests'][$key]['otherAllergies'] = $payload['guests'][$key]['otherAllergies'];
        $user['guests'][$key]['song'] = $payload['guests'][$key]['song'];
    }

    $user_data[$payload['name']] = $user;
    write_file($BASE . 'data', json_encode($user_data));
    
    // return new user object
    respondJSON(201, $user_data[$payload['user']]);

} else {
    respondErrorMsg(401, "invalid payload");  
}