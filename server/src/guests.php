<?php

class Guests {
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
        $sql = "CREATE TABLE IF NOT EXISTS `guests` ( `uuid` tinytext not null, `name` tinytext not null default '', `last_name` tinytext not null default '', `diet` tinytext not null default '', `song` text, `allergies` text, `other_allergies` text, `is_coming` boolean not null default '0', `user_id` tinytext not null, foreign key (`user_id`) references user(name), primary key (`uuid`));";
        $this->pdo->exec($sql);
    }

    public function add($guest, $user_id) {
        $sql = 'INSERT INTO guests VALUES (:uuid, :name, :last_name, :diet, :song, :allergies, :other_allergies, :is_coming, :user_id);';
        $stmt = $this->pdo->prepare($sql);

        if (is_array($guest)) {

            $stmt->bindValue(':uuid', $guest['uuid']);
            $stmt->bindValue(':name', $guest['name']);
            $stmt->bindValue(':last_name', $guest['lastname']);
            $stmt->bindValue(':diet', $guest['diet']);
            $stmt->bindValue(':song', $guest['song']);
            $stmt->bindValue(':allergies', json_encode($guest['allergies']));
            $stmt->bindValue(':other_allergies', $guest['otherAllergies']);
            $stmt->bindValue(':user_id', $user_id);
            $stmt->bindValue(':is_coming', $guest['is_coming']);

        } else {
            $stmt->bindValue(':uuid', $guest->uuid);
            $stmt->bindValue(':name', $guest->name);
            $stmt->bindValue(':last_name', $guest->lastname);
            $stmt->bindValue(':diet', $guest->diet);
            $stmt->bindValue(':song', $guest->song);
            $stmt->bindValue(':allergies', json_encode($guest->allergies));
            $stmt->bindValue(':other_allergies', $guest->otherAllergies);
            $stmt->bindValue(':user_id', $user_id);
    
            if (property_exists($guest, 'is_coming'))
                $stmt->bindValue(':is_coming', $guest->is_coming);
            else if (property_exists($guest, 'isComing'))
                $stmt->bindValue(':is_coming', $guest->isComing);
            else
                $stmt->bindValue(':is_coming', FALSE);
        }

        $stmt->execute();
    }

    public function get($uuid) {
        $sql = 'SELECT * from guests where `uuid`=:uuid;';
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':uuid', $uuid);
        $stmt->execute();

        $guest = $stmt->fetch(\PDO::FETCH_ASSOC);

        $guest['allergies'] = json_decode($guest['allergies']);
        $guest['isComing'] = $guest['is_coming'] == 1;
        $guest['lastname'] = $guest['last_name'];
        $guest['otherAllergies'] = $guest['other_allergies'];
        unset($guest['is_coming']);
        unset($guest['last_name']);
        unset($guest['other_allergies']);

        return $guest;
    }

    public function get_guests($user) {
        $sql = 'SELECT * from guests where `user_id`=:user;';
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':user', $user);
        $stmt->execute();

        $guests = [];

        while ($guest = $stmt->fetch(\PDO::FETCH_ASSOC)) {
            $guest['allergies'] = json_decode($guest['allergies']);
            $guest['isComing'] = $guest['is_coming'] == 1;
            $guest['lastname'] = $guest['last_name'];
            $guest['otherAllergies'] = $guest['other_allergies'];
            unset($guest['is_coming']);
            unset($guest['last_name']);
            unset($guest['other_allergies']);
            
            array_push($guests, $guest);
        }


        return $guests;
    }

    public function update_guest($guest) {
        $sql = 'UPDATE guests SET name=:name, last_name=:last_name, diet=:diet, song=:song, allergies=:allergies, other_allergies=:other_allergies, is_coming=:is_coming where uuid=:uuid;';
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':uuid', $guest['uuid']);
        $stmt->bindValue(':name', $guest['name']);
        $stmt->bindValue(':last_name', $guest['lastname']);
        $stmt->bindValue(':diet', $guest['diet']);
        $stmt->bindValue(':song', $guest['song']);
        $stmt->bindValue(':allergies', json_encode($guest['allergies']));
        $stmt->bindValue(':other_allergies', $guest['otherAllergies']);
        $stmt->bindValue(':is_coming', $guest['isComing']);

        $stmt->execute();
    }
}