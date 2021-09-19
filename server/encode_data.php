<?php
    include 'reader.php';

    encrypt_file('data.json', 'data');
    echo read_file('data');
?>