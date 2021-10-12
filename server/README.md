# Wedding Page Server Docs

## Install

1. start your server
1. call `http://<your-api-domain>/install.php?user=<preferred admin username>&pwd=<default admin pwd>`
    1. it checks if data is already present:
        1. if yes, it cancels the operation
        1. if no, all data files are created and encrypt them with a random password saved in a config file
1. add rs256 keys in `config` named as `jwtRS256.key` and `jwtRS256.key.pub`
1. done