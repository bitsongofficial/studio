# `@bstudio/db`

A Nuxt module to connect to a database and provide a simple API for interacting with it.

## Features

- 📦 &nbsp;Prisma
- 📦 &nbsp;Postgresql

## Quick Setup

1. Add `@bstudio/db` dependency to your project

```bash
# Using pnpm
pnpm add -D @bstudio/db

# Using yarn
yarn add --dev @bstudio/db

# Using npm
npm install --save-dev @bstudio/db
```

2. Add `@bstudio/db` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: [
    '@bstudio/db'
  ]
})
```

3. Then create a `.env` file in the root of your project and add the following:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
DIRECT_URL="postgresql://user:password@localhost:5432/dbname"
```

4. Use it in your api

```ts
// index.get.ts example
export default defineEventHandler(async (event) => {
  const { database } = event.context
  return await database.user.findFirst()
})
```