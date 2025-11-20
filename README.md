# Coaching Platform App

## Frontend

```sh
bun dev
```

## Backend 


### Server 

Hono

```sh
cd server
bun dev
```

### Database

Postgres 17 (See [docker-compose](./docker-compose.yml))

#### Running the Database

```sh
docker-compose up -d 
```

#### Configuration

Database connection is configured via Environment using `.env`.
See [CONFIG](./CONFIG.md) for environment variables.

#### Setup Schema

Use `kysely-ctl` to run migrations. The migrations will create the tables.
`kysely-ctl` configuration is in `./server/.config/kysely.config.ts`. It too
loads the database connection parameters from the Environment.

```sh
# List migrations
pnpm kysely migrate:list

# Apply migrations
pnpm kysely migrate:up

# Undo migrations
pnpm kysely migrate:down
```
#### Initialise Data

Use `kysely-ctl`'s seed feature to load fake data. The seed data is located at `server/src/db/seed` 

```sh
# list seed files
pnpm kysely seed list

# run
pnpm kysely seed run

# create new seed file
pnpm kysely seed make
```

## Testing

### Server Endpoints

Endpoints can be tested simply using `httpie`.

```sh
# Sending a FormData request
http post -f localhost:3001/auth/login email=coach@example.com password=123456 
```
