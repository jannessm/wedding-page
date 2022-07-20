<?php

class BudgetCategories {
    /**
     * PDO object
     * @var \PDO
     */
    private $pdo;

    /**
     * Initialize the object with a specified PDO object
     * @param \PDO $pdo
     */
    public function __construct($pdo) {
        $this->pdo = $pdo;
        $this->create_table();
    }

    public function create_table() {
        $sql = "CREATE TABLE IF NOT EXISTS `budget_categories` (
                `id` INTEGER PRIMARY KEY AUTOINCREMENT,
                `label` TINYTEXT NOT NULL,
                `budget` FLOAT NOT NULL
            );";
        $this->pdo->exec($sql);
    }

    public function add($category) {
        $sql = 'INSERT INTO budget_categories (label, budget) VALUES (:label, :budget);';
        $stmt = $this->pdo->prepare($sql);

        if (is_array($category)) {

            $stmt->bindValue(':label', $category['label']);
            $stmt->bindValue(':budget', $category['budget']);

        } else {
            $stmt->bindValue(':label', $category->label);
            $stmt->bindValue(':budget', $category->budget);
        }

        $stmt->execute();
    }

    public function get($id) {
        $sql = 'SELECT * from budget_categories where `id`=:id;';
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':id', $id);
        $stmt->execute();

        $guest = $stmt->fetch(\PDO::FETCH_ASSOC);

        return $this->filter($guest);
    }

    public function get_id($label) {
        $sql = 'SELECT * from budget_categories where `label`=:label;';
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':label', $label);
        $stmt->execute();

        $category = $stmt->fetch(\PDO::FETCH_ASSOC);

        return $category;
    }

    public function get_all() {
        $sql = 'SELECT * FROM budget_categories;';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        $categories = [];
        while ($category = $stmt->fetch(\PDO::FETCH_ASSOC)) {
            array_push($categories, $category);
        }

        return $categories;
    }

    public function update($category) {
        $sql = 'UPDATE budget_categories SET label=:label, budget=:budget where id=:id;';
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':label', $category['label']);
        $stmt->bindValue(':budget', $category['budget']);
        $stmt->bindValue(':id', $category['id']);

        $stmt->execute();
    }

    public function delete($id) {
        $sql = 'DELETE FROM budget_categories WHERE id=:id';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':id' => $id]);
    }
}