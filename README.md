# World Cup Album

Project to complete your album with your friends.

## Start project local
Create a `.env.local` with the same key of the `.env` file and use your supabase keys 🤙.
```
pnpm install
```

## TODO

[] Repeated mode
    [] socketData should have type
[] Missing mode ones
[] add alias routes
[] An admin so they can or not edit album from other person
[] clean the backend something hexagone arquitecture for fastify
[] Add logout button
[] cypress test 2e2
[] add vitest
[] add new node test to fastify
[] cloc remove dev-dist
[] On select album page, create case when other user already send an invite
  [x] adding the create album using the api `/api/album` post service and useSWRMutation
[] On select album page, create case when create a new album
  [x] add the id album to the creation of the album => album_type_id
  [x] create new column
  [] create table with album_type_id and names like one for the world cup album other for the fpc album
[] check most pages use the padding
[] Test on phone 
[] Test using two phones while changing the same album
[x] Fix scroll on all pages
[] Fix page to select an album
[] Deploy app
[] Add more pwa things (?)
  [] cache statics
  [] save album
  [] push notifications
[] Add more album options
[] WI add some indication visual that some sticker are more important
[] invite new user throw mail
    [] if the user hits the page throw the email do something
    [] if the user register with an invitation will show to create a new album or continue with join album

## learnings
- Doing the album as JSON type makes difficult to update if you make any changes to the album interface, because its not like update
a column and update all rows. It's to update a json for all registers that is harder.

## usefull links
- https://2brew.github.io/
- https://github.com/2brew/2brew.github.io
- to learn about the pwa use the pwa vite repo

