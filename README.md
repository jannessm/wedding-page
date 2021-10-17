# wedding-page

rsa keygen:
```
ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
# Don't add passphrase
openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
```

## setup
1. generate ssh keys without a passphrase with the following commands:
```
$ ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
$ openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
```
2. put the keys in `server/config` dir
3. start php server with root of `/server`
4. follow installation instructions under server
5. run the angular 


## publish
1. build angular app `npm run build`
2. set correct host in `server/config/secrets.php`
3. copy files to server in one directory:
```
- /
  - api/
    - ...
  - config/
    - ...
  - src/
  - vendor/
  - .htaccess
```