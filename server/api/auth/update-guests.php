<?php

$payload = json_decode(file_get_contents("php://input"), true);

if ($payload['guests']) {
    $GUESTS = new Guests($PDO);
    
    // update guests
    foreach ($payload['guests'] as $guest) {
        $GUESTS->update_guest($guest);
    }
    
    // return new user object
    respondJSON(201, array());

} else {
    respondErrorMsg(401, "invalid payload");  
}