<?php

$payload = json_decode(file_get_contents("php://input"), true);

$GUESTS = new Guests($PDO);

if ($payload['name']) {
    $guests = $GUESTS->get_guests($payload['name']);
    respondJSON(200, $guests);
} else {
    respondErrorMsg(401, "invalid payload");  
}
