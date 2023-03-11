# World Cup Album

Project to complete your album with your friends.

## Start project local
Create a `.env.local` with the same key of the `.env` file and use your supabase keys 🤙.
```
pnpm install
pnpm dev
```

## New features
- add fetch wrapper for the new endpoints
- check if its better to add vite in the backend instead of tsc

## fix
- fix reload always go to first page

## Labs
- test DB
  - Use the album-members this table will have a new row for each member of an album, so if a album
    with Id 1 has 3 members will have 3 columns
  - Make a copy of the albums table and add two columns owner and members, members will be an array 
    of all members
  - **TEST** check which way its better to have an extra table or just to have an array column
