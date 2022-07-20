<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");

    $BASE = __DIR__ . '/../';

    require_once($BASE . 'autoload.php');
    require_once($BASE . 'src/guests.php');
    require_once($BASE . 'src/user.php');
    require_once($BASE . 'src/budget_categories.php');
    require_once($BASE . 'src/budget_costcenters.php');

    $users = json_decode(read_file('../data'));

    $GUESTS = new Guests($PDO);
    $USER = new User($PDO);
    $CATEGORIES = new BudgetCategories($PDO);
    $COSTCENTERS = new BudgetCostCenters($PDO);

    foreach ($users as $key => $value) {
        echo $key . '<br>';

        foreach($value->guests as $guest) {
            try {
                $GUESTS->add($guest, $key);
            } catch (PDOException $e) {
                if ($e->errorInfo[1] == 19) {
                    echo "- " . $guest->name . " exists<br>";
                } else {
                    throw $e;
                }
            }
        }

        try {
            $USER->add($value);
        } catch (PDOException $e) {
            if ($e->errorInfo[1] == 19) {
                echo $key . " exists<br>";
            } else {
                throw $e;
            }
        }
    }

    $budget_data = json_decode(read_file('../budget-data'));

    $categories = [];

    foreach($budget_data->categories as $key => $category) {
        try {
            $CATEGORIES->add($category, $key + 1);
            $categories[$category->id] = $key + 1;
        } catch (PDOException $e) {
            if ($e->errorInfo[1] == 19) {
                echo $category->label . " exists<br>";
            } else {
                throw $e;
            }
        }
    }

    var_dump($categories);

    foreach($budget_data->cost_centers as $key => $cost_center) {
        try {
            if (property_exists($cost_center, 'category') && $cost_center->category !== '') {
                $cost_center->category = $categories[$cost_center->category];
            }
            $COSTCENTERS->add($cost_center, $key);
        } catch (PDOException $e) {
            if ($e->errorInfo[1] == 19) {
                echo $cost_center->title . " exists<br>";
            } else {
                throw $e;
            }
        }
    }