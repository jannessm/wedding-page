<?php

class User {
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
        $sql = "CREATE TABLE IF NOT EXISTS `user` (
            `name` TINYTEXT NOT NULL,
            `is_admin` BOOLEAN NOT NULL DEFAULT 0,
            `first_login` BOOLEAN NOT NULL DEFAULT 0,
            `first_password` TINYTEXT NOT NULL,
            `password` TINYINT,
            PRIMARY KEY (`name`)
        );";
        $this->pdo->exec($sql);
    }

    public function add($user) {
        $sql = 'INSERT INTO user VALUES (:name, :is_admin, :first_login, :first_password, :password);';
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':name', $user->name);
        $stmt->bindValue(':is_admin', $user->isAdmin);
        $stmt->bindValue(':first_login', $user->firstLogin);
        $stmt->bindValue(':first_password', $user->firstPassword);
        $stmt->bindValue(':password', json_encode($user->password));

        if (property_exists($user, 'isAdmin'))
            $stmt->bindValue(':is_admin', $user->isAdmin);
        else
            $stmt->bindValue(':is_admin', 0);

        $stmt->execute();
    }

    public function get($name) {
        $sql = 'SELECT * from user where `name`=:name;';
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':name', $name);
        $stmt->execute();

        $user = $stmt->fetch(\PDO::FETCH_ASSOC);

        return $user;
    }

    public function update_password($name, $new_password) {
        $sql = 'UPDATE user SET password=:new_password, first_login=0 where name=:name;';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':new_password' => $new_password, ':name' => $name]);
    }
}