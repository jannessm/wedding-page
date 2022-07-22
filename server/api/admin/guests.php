<?php

function addGuests() {
    global $GUESTS;
    $payload = json_decode(file_get_contents("php://input"), true);

    $username = strtolower($payload['user']);

    foreach($payload['guests'] as $guest) {
        try {
            $GUESTS->add($guest, $username);
        } catch (PDOException $e) {
            respondErrorMsg(401, 'invalid request');
            break;
        }
    }

    respondJSON(201, "done");
}

function deleteGuest() {
    global $GUESTS;
    $payload = json_decode(file_get_contents("php://input"), true);

    $old_guest = $GUESTS->get($payload['guest_id']);

    $GUESTS->delete($payload['guest_id']);

    respondJSON(201, $old_guest);
}

?>