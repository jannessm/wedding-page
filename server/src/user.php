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
        if (!is_array($user)) {
            $stmt->bindValue(':name', $user->name);
            $stmt->bindValue(':is_admin', $user->isAdmin);
            $stmt->bindValue(':first_login', $user->firstLogin);
            $stmt->bindValue(':first_password', $user->firstPassword);
            $stmt->bindValue(':password', json_encode($user->password));
    
            if (property_exists($user, 'isAdmin'))
                $stmt->bindValue(':is_admin', $user->isAdmin);
            else
                $stmt->bindValue(':is_admin', 0);
        } else {
            $stmt->bindValue(':name', $user['name']);
            $stmt->bindValue(':is_admin', $user['is_admin']);
            $stmt->bindValue(':first_login', TRUE);
            $stmt->bindValue(':first_password', $user['first_password']);
            $stmt->bindValue(':password', json_encode($user['password']));
        }

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

    public function get_all() {
        $sql = 'SELECT name, is_admin, first_login, first_password, guests FROM user LEFT JOIN (
            SELECT user_id, group_concat(guests, ", ") as guests FROM (
                SELECT user_id, name || " " || last_name as guests FROM guests
            ) GROUP BY user_id
        ) ON user_id = user.name;';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        $users = [];
        while ($user = $stmt->fetch(\PDO::FETCH_ASSOC)) {
            array_push($users, $this->filter($user));
        }

        return $users;
    }

    public function update_password($name, $new_password, $first_login = 0) {
        $sql = 'UPDATE user SET password=:new_password, first_login=:first_login where name=:name;';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':new_password' => $new_password, ':name' => $name, ':first_login' => $first_login]);
    }

    public function update_admin_rights($name, $is_admin) {
        $sql = 'UPDATE user SET is_admin=:is_admin where name=:name;';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':name' => $name, ':is_admin' => $is_admin]);
    }

    public function delete($name) {
        $sql = 'DELETE FROM user WHERE name=:name;';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':name' => $name]);
    }

    public function filter($user) {
        $user['isAdmin'] = $user['is_admin'] == 1;
        $user['firstLogin'] = $user['first_login'] == 1;
        $user['firstPassword'] = $user['first_password'];
        unset($user['password']);
        unset($user['first_password']);
        unset($user['is_admin']);
        unset($user['first_login']);

        return $user;
    }
}