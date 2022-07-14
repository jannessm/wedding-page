<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");

    $BASE = __DIR__ . '/../../';

    require_once($BASE . 'autoload.php');
    require_once('user.php');

    $USER = new User($PDO);

    include('budget.php');

    // check JWT
    if (!validJWT()) {
        respondErrorMsg(401, "Unauthorized");
        exit();
    }

    // check admin rights
    $user = decodeToken(readToken())->user->name;
    $user_db = $USER->get($user);

    if (!$user_db['is_admin']) {
        respondErrorMsg(401, "Unauthorized: Admin rights needed");
        exit();
    }

    // get user data
    if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['user'])) {
        respondJSON(200, $USER->get_all());
        exit();
    }

    // add user
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST) && isset($_GET['user'])) {
        addUser();
        exit();
    }
    
    // update admin rights
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST) && isset($_GET['update-admin-rights'])) {
        updateAdminRights();
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
