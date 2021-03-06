<?php

require_once($BASE . 'config/secrets.php');

/**
 * SQLite connnection
 */
class SQLiteConnection {
    /**
     * PDO instance
     * @var type 
     */
    private $pdo;

    /**
     * return in instance of the PDO object that connects to the SQLite database
     * @return \PDO
     */
    public function connect() {
        global $sqliteFile;
        if ($this->pdo == null) {
            try {
                $this->pdo = new \PDO("sqlite:" . $sqliteFile);
            } catch (\PDOException $e) {
                respondErrorMsg("Database not available.");
            }
        }
        return $this->pdo;
    }

}