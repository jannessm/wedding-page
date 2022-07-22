<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");

    $BASE = __DIR__ . '/../../';

    require_once($BASE . 'autoload.php');
    require_once('user.php');
    require_once('guests.php');
    require_once('budget.php');

    $USER = new User($PDO);
    $GUESTS = new Guests($PDO);
    $CATEGORIES = new BudgetCategories($PDO);
    $COSTCENTERS = new BudgetCostCenters($PDO);

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

    // get guest data
    if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['guests'])) {
        respondJSON(200, $GUESTS->get_all());
        exit();
    }

    // add user
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST) && isset($_GET['user'])) {
        addUser();
        exit();
    }

    // add guests
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST) && isset($_GET['guests'])) {
        addGuests();
        exit();
    }
    
    // update admin rights
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST) && isset($_GET['update-admin-rights'])) {
        updateAdminRights();
        exit();
    }

    // delete user
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST) && isset($_GET['delete-user'])) {
        deleteUser();
        exit();
    }

    // delete guest
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST) && isset($_GET['delete-guest'])) {
        deleteGuest();
        exit();
    }

    // reset passwort for user
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST) && isset($_GET['reset-pwd'])) {
        resetPwd();
        exit();
    }

    // get budget categories
    if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['categories'])) {
        getBudgetCategories();
        exit();
    }

    // get budget cost_centers
    if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['cost_centers'])) {
        getBudgetCostCenters();
        exit();
    }

    // update budget (id = 0 of budget_categories table)
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST) && isset($_GET['update-budget'])) {
        updateBudget();
        exit();
    }

    // add category
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST) && isset($_GET['add-category'])) {
        addCategory();
        exit();
    }

    // update category
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST) && isset($_GET['update-category'])) {
        updateCategory();
        exit();
    }

    // delete a category
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['delete-category']) && isset($_GET['id'])) {
        deleteCategory();
        exit();
    }

    // update cost center
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST) && isset($_GET['update-cost-center'])) {
        updateCostCenter();
        exit();
    }

    // delete a cost center
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['delete-cost-center']) && isset($_GET['id'])) {
        deleteCostCenter();
        exit();
    }

    respondErrorMsg(401, "endpoint not found.");
