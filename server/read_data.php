<?php
include "src/reader.php";

header('Content-Type: application/json');
echo read_file('data');
