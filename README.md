# Wedding Page

## setup
1. generate ssh keys without a passphrase with the following commands:
```
$ ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
$ openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
```
2. put the keys in `server/config` dir
3. run `composer install` in the `server` dir
3. start php server with root of `/server`
4. follow installation instructions under `server/README.md`
6. run `npm install` in the `webpage` dir
5. run the angular app


## publish
1. build angular app `npm run build`
2. set correct host in `server/config/secrets.php`
3. copy files from server in final webpage directory:
```
- /
  - api/
    - ...
  - config/
    - ...
  - src/
  - vendor/
  - .htaccess
  - autoload.php
```
4. copy dist files for angular in same directory