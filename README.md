# NC Games Backend

This is the backend part of my Northcoders website. It connects with a database and gets data to and from the database to be served to the front-end.

[Hosted version can be found here.](https://be-nc-games-jnf9.onrender.com)

## Dependencies
* Node (>= 20.8)
* PostgreSQL (>= 15)

## Setting Up
First, clone the repository.
```sh
git clone https://github.com/iy2k22/be-nc-games
```
Then, you'll want to change directory to the root of the project and install its dependencies.
```sh
npm i # Install dependencies
```
Next, you'll need to the setup the database and put all the necessary data into it.
```sh
npm run setup-dbs # Set up database
npm run seed # Seed relevant data
```

## Environment Variables
This project uses `env` to determine which database to run on. There are two values:
* `production` (`nc_games`)
* `development` (`nc_games_test`)

You'll need to create corresponding `.env` files.

`.env.development`
```
PGDATABASE=nc_games_test
```

`.env.production`
```
PGDATABASE=nc_games
```

Make sure your `.env` files are in the root of the project.

## Running Tests
If you want to run tests on a particular database:
```sh
NODE_ENV=<your_env_value> npm run test
```
where `<your_env_value>` is either `production` or `development` (depending on which database you want to test).