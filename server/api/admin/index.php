<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");

    $BASE = __DIR__ . '/../../';

    require_once($BASE . 'autoload.php');
    include('user.php');
    include('budget.php');

    // check JWT
    if (!validJWT()) {
        respondErrorMsg(401, "Unauthorized");
        exit();
    }

    // check admin rights
    $user = decodeToken(readToken())->user;
    $user_data = json_decode(read_file($BASE . 'data'), true);
    if (!$user_data[$user->name]['isAdmin']) {
        respondErrorMsg(401, "Unauthorized: Admin rights needed");
        exit();
    }

    // get user data
    if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['user'])) {
        $user_data = json_decode(read_file($BASE . 'data'), true);
        respondJSON(200, filterUser($user_data));
        exit();
    }

    // add user
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST) && isset($_GET['user'])) {
        addUser();
        exit();
    }
    
    // update users
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST) && isset($_GET['update-user'])) {
        updateUser();
        exit();
    }

    // delete user
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST) && isset($_GET['delete-user'])) {
        deleteUser();
        exit();
    }

    // reset passwort for user
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST) && isset($_GET['reset-pwd'])) {
        resetPwd();
        exit();
    }

    // get budget data
    if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['get-budget-data'])) {
        getBudgetData();
        exit();
    }

    // update budget
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST) && isset($_GET['update-budget'])) {
        updateBudget();
        exit();
    }

    // update categories (also add some)
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST) && isset($_GET['update-categories'])) {
        updateCategories();
        exit();
    }

    // delete a category
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['delete-category']) && isset($_GET['id'])) {
        deleteCategory();
        exit();
    }

    // update cost centers
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST) && isset($_GET['update-cost-centers'])) {
        updateCostCenters();
        exit();
    }

    // delete a cost center
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['delete-cost-center']) && isset($_GET['id'])) {
        deleteCostCenter();
        exit();
    }

    respondErrorMsg(401, "endpoint not found.");
