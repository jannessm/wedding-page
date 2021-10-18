<?php

function getBudgetData() {
    global $BASE;
    $payload = json_decode(read_file($BASE . 'budget-data'), true);

    // data file does not exists create default file
    if (!isset($payload['budget'])) {
        $payload = array(
            "budget" => 10000,
            "spent_total" => 0,
            "categories" => array(),
            "cost_centers" => array()
        );

        write_file($BASE . 'budget-data', json_encode($payload));
    }

    respondJSON(200, $payload);
}

function updateBudget() {
    global $BASE;
    $payload = json_decode(file_get_contents("php://input"), true);
    $data = json_decode(read_file($BASE . 'budget-data'), true);

    $data['budget'] = $payload['budget'];

    write_file($BASE . 'budget-data', json_encode($data));

    respondJSON(201, "updated Budget");
}

function updateCategories() {
    global $BASE;
    $payload = json_decode(file_get_contents("php://input"), true);
    $data = json_decode(read_file($BASE . 'budget-data'), true);

    $data['categories'] = $payload['categories'];

    write_file($BASE . 'budget-data', json_encode($data));

    respondJSON(201, "updated categories");
}

function deleteCategory() {
    global $BASE;
    $category_id = $_GET['id'];
    $data = json_decode(read_file($BASE . 'budget-data'), true);

    foreach($data['categories'] as $key => $category) {
        if ($category['id'] == $category_id) {
            array_splice($data['categories'], $key, 1);
            break;
        }
    }

    write_file($BASE . 'budget-data', json_encode($data));

    respondJSON(201, "deleted category");
}

function updateCostCenters() {
    global $BASE;
    $payload = json_decode(file_get_contents("php://input"), true);
    $data = json_decode(read_file($BASE . 'budget-data'), true);

    $data['categories'] = $payload['categories'];
    $data['cost_centers'] = $payload['costCenters'];

    write_file($BASE . 'budget-data', json_encode($data));

    respondJSON(201, "updated categories");
}

function deleteCostCenter() {
    global $BASE;
    $cost_center_id = $_GET['id'];
    $data = json_decode(read_file($BASE . 'budget-data'), true);

    $categories = $data['categories'];
    foreach($categories as $c) {
        $categories['cost_center_ids'] = array_filter(
            $categories['cost_center_ids'],
            function ($id) use ($cost_center_id) {
                return strcmp($id, $cost_center_id) >= 0;
            }
        );
    }
    
    $data['cost_centers'] = array_filter(
        $categories['cost_centers'],
        function ($cc) use ($cost_center_id) {
            return strcmp($cc['id'], $cost_center_id) < 0;
        }
    );

    write_file($BASE . 'budget-data', json_encode($data));

    respondJSON(201, "updated categories");
}
