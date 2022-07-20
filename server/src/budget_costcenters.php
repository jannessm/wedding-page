<?php

class BudgetCostCenters {
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
        $sql = "CREATE TABLE IF NOT EXISTS `budget_cost_centers` (
            `id` INTEGER PRIMARY KEY AUTOINCREMENT,
            `title` TINYTEXT NOT NULL,
            `category` INT,
            `amount` FLOAT NOT NULL,
            `paid` BOOLEAN NOT NULL,
            `per_person` BOOLEAN NOT NULL,
            FOREIGN KEY (`category`) REFERENCES budget_categories(`id`)
        );";
        $this->pdo->exec($sql);
    }

    public function add($cost_center) {
        $sql = 'INSERT INTO budget_cost_centers VALUES (NULL, :title, :category, :amount, :paid, :per_person);';
        $stmt = $this->pdo->prepare($sql);

        if (is_array($cost_center)) {

            $stmt->bindValue(':title', $cost_center['title']);
            $stmt->bindValue(':category', $cost_center['category']);
            $stmt->bindValue(':amount', $cost_center['amount']);
            $stmt->bindValue(':paid', $cost_center['paid']);
            $stmt->bindValue(':per_person', $cost_center['per_person']);

        } else {
            $stmt->bindValue(':title', $cost_center->title);
            if (property_exists($cost_center, 'category')) {
                $stmt->bindValue(':category', $cost_center->category);
            } else {
                $stmt->bindValue(':category', NULL);
            }
            $stmt->bindValue(':amount', $cost_center->amount);
            $stmt->bindValue(':paid', $cost_center->paid);
            $stmt->bindValue(':per_person', $cost_center->per_person);
        }

        $stmt->execute();
    }

    public function get($id) {
        $sql = 'SELECT * from budget_cost_centers where `id`=:id;';
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':id', $id);
        $stmt->execute();

        $cost_center = $stmt->fetch(\PDO::FETCH_ASSOC);

        return $this->filter($cost_center);
    }

    public function get_all() {
        $sql = 'SELECT * FROM budget_cost_centers;';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        $cost_centers = [];
        while ($cost_center = $stmt->fetch(\PDO::FETCH_ASSOC)) {
            array_push($cost_centers, $this->filter($cost_center));
        }

        return $cost_centers;
    }

    public function update($cost_center) {
        $sql = 'UPDATE budget_cost_centers SET title=:title, category=:category, amount=:amount, paid=:paid, per_person=:per_person where id=:id;';
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':title', $cost_center['title']);
        $stmt->bindValue(':category', $cost_center['category']);
        $stmt->bindValue(':amount', $cost_center['amount']);
        $stmt->bindValue(':paid', $cost_center['paid']);
        $stmt->bindValue(':per_person', $cost_center['per_person']);

        $stmt->execute();
    }

    public function delete($cost_center_id) {
        $sql = 'DELETE FROM budget_cost_centers WHERE id=:id';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':id' => $cost_center_id]);
    }

    public function filter($cost_center) {

        $cost_center['per_person'] = $cost_center['per_person'] == 1;
        $cost_center['paid'] = $cost_center['paid'] == 1;

        return $cost_center;
    }
}