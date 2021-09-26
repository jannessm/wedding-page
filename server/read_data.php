<?php
include "reader.php";

header('Content-Type: application/json');
echo read_file('data');
