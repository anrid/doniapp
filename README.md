# Ether

An app of sorts.

## Setup (Hipster)

```
docker-compose up
```

## Setup (Old School)

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

## Development URL

http://localhost:8889

## Release to production

```
yarn release
```
