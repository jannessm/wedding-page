<?php
    use Firebase\JWT\JWT;
    require_once($BASE . 'vendor/autoload.php');
    require_once($BASE . 'config/secrets.php');

    function generateJWT($user) {
        global $jwtPrivateKey, $serverName;
        
        $issuedAt   = new DateTimeImmutable();
        $expire     = $issuedAt->modify('+7 day')->getTimestamp();      // Add 60 seconds

        $data = [
            'iat'  => $issuedAt->getTimestamp(),         // Issued at: time when the token was generated
            'iss'  => $serverName,                       // Issuer
            'nbf'  => $issuedAt->getTimestamp(),         // Not before
            'exp'  => $expire,                           // Expire
            'user' => $user,                     // User name
        ];

        return JWT::encode(
            $data,
            $jwtPrivateKey,
            'RS256'
        );
    }

    function hasJWT() {
        return preg_match('/Bearer\s"(\S+)"/', $_SERVER['HTTP_AUTHORIZATION'], $matches);
    }

    function validJWT() {
        global $serverName;
        $token = decodeToken(readToken());
        
        $now = new DateTimeImmutable();

        return ($token->iss === $serverName && // issuer is the same
            $token->nbf <= $now->getTimestamp() && // create time is in past
            $token->exp >= $now->getTimestamp()); // expire time is in future
    }

    function readToken() {
        if (!isset($_SERVER['HTTP_AUTHORIZATION'])) {
            return;
        }
        
        preg_match('/Bearer\s\"(\S+)\"/', $_SERVER['HTTP_AUTHORIZATION'], $matches);

        // check if token is in header
        if (!hasJWT()) {
            return;
        }
        
        $jwt = $matches[1];

        // if no jwt could be found by regex
        if (!$jwt) {
            return;
        }

        return $jwt;
    }

    function decodeToken($jwt) {
        if (!$jwt) {
            return;
        }
        global $jwtPublicKey, $serverName;

        $token = JWT::decode($jwt, $jwtPublicKey, ['RS256']);

        return $token;
    }