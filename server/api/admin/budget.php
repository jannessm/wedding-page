<?php

function getBudgetCategories() {
    global $CATEGORIES;

    $categories = $CATEGORIES->get_all();

    respondJSON(200, $categories);
}

function getBudgetCostCenters() {
    global $COSTCENTERS;

    $cost_centers = $COSTCENTERS->get_all();

    respondJSON(200, $cost_centers);
}

function getBudgetData() {
    global $BASE;
    $payload = json_decode(read_file($BASE . 'budget-data'), true);

    // data file does not exists create default file
    if (!isset($payload['budget'])) {
        $payload = array(
            "budget" => 10000,
            "categories" => array(),
            "cost_centers" => array()
        );

        write_file($BASE . 'budget-data', json_encode($payload));
    }

    respondJSON(200, $payload);
}

function updateBudget() {
    global $CATEGORIES;
    $payload = json_decode(file_get_contents("php://input"), true);

    $CATEGORIES->update_budget($payload['budget']);

    respondJSON(201, "updated Budget");
}

function addCategory() {
    global $CATEGORIES;
    $payload = json_decode(file_get_contents("php://input"), true);

    $new_category = $CATEGORIES->add($payload['category']);

    respondJSON(201, $new_category);
}

function updateCategory() {
    global $CATEGORIES;
    $payload = json_decode(file_get_contents("php://input"), true);

    $CATEGORIES->update($payload['category']);

    respondJSON(201, "updated categories");
}

function deleteCategory() {
    global $CATEGORIES;
    $category_id = $_GET['id'];

    $CATEGORIES->delete($category_id);

    respondJSON(201, "deleted category");
}

function addCostCenter() {
    global $COSTCENTERS;
    $payload = json_decode(file_get_contents("php://input"), true);

    $newCostCenter = $COSTCENTERS->add($payload['cost_center']);

    respondJSON(201, $newCostCenter);
}

function updateCostCenter() {
    global $COSTCENTERS;
    $payload = json_decode(file_get_contents("php://input"), true);

    $COSTCENTERS->update($payload['cost_center']);

    respondJSON(201, "updated cost centers");
}

function deleteCostCenter() {
    global $COSTCENTERS;
    $cost_center_id = $_GET['id'];

    $COSTCENTERS->delete($cost_center_id);

    respondJSON(201, "deleted cost center");
}
