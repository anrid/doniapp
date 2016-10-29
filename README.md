# Ether

An app of sorts.

### Setup (For Rad Hipsters)

```
docker-compose up
```

### Run tests inside docker

```
docker-compose run app yarn test
```

### Development URL

**http://localhost:8889**

### Setup (For Old School Has-Beens**)

***i.e. everyone in the web development community every 6 months or so.*

```
# yarn > npm, so ..
brew update
brew install yarn
# or ..
curl -o- -L https://yarnpkg.com/install.sh | bash

cd doniapp
yarn install

# Run the app in development mode.
yarn start
```
