<?php

$BASE = '../';

require_once("../autoload.php");

$stmt = $PDO->query('Select * from ' . $_GET['table']);

echo "<pre>";

while ($user = $stmt->fetch(\PDO::FETCH_ASSOC)) {
    var_dump($user);
}

echo "</pre>";
