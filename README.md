# Coaching Platform App

## Backend

### Server

Hono

### Database

Postgres 17 (See [docker-compose](./docker-compose.yml))

#### Configuration

Database connection is configured via Environment using `.env`.
See [CONFIG](./CONFIG.md) for environment variables.

#### Setup

Use `kysely-ctl` to run migrations. `kysely-ctl` configuration is in
`./server/.config/kysely.config.ts`. It too loads the database connection
parameters from the Environment.

```sh
# List migrations
pnpm kysely migrate:list

# Apply migrations
pnpm kysely migrate:up

# Undo migrations
pnpm kysely migrate:down
```

