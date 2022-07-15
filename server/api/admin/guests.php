<?php

function addGuests() {
    global $PDO;
    $payload = json_decode(file_get_contents("php://input"), true);
    $GUESTS = new Guests($PDO);

    $username = strtolower($payload['name']);

    foreach($payload['guests'] as $guest) {
        try {
            $GUESTS->add($guest);
        } catch (PDOException $e) {
            respondErrorMsg(401, 'invalid request');
            break;
        }
    }

    respondJSON(201, "done");
}

?>