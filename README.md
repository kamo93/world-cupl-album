# World Cup Album

Project to complete your album with your friends.

## Start project local
Create a `.env.local` with the same key of the `.env` file and use your supabase keys 🤙.
```
pnpm install
```

### Run locally
Can use `pnpn run dev` will run api and app on dev on the same proccess terminal, api will run on localhost:3000 and app on 5137
Also can run each one on indepent so is easy to see logs for each app
frontend app `pnpm run app:dev`
backend app `pnpm run api:dev`

## Dev decisions (know there a offcial name for this decisions)
- Eslint using throw pnpm run not eslint server fix on every save, on the other hand typescript do run while working

## TODO

- [x] Repeated mode
- [x] BUG: socketData should have type
    - [x] socketData APP
    - [x] socketData api
    > Solve using supabase types generators
- [x] BUG: scroll desapear when goes all down on album page
    - [x] Refactor menu bar fix album page broke the rest of the pages
- [x] Add prettier to the eslint config
- [X] BUG: Url without path not redirect to login page, just show the "splash screen"
- [ ] BUG: Check undefined when starting the backend
- [ ] Check why have different user on the config and from github how to sync
- [ ] BUG: effect about the album that hides on the header
- [ ] IMPROVE: Try removing the React.Context -> supabase client since you have
  layer for the supabase database using the api, right now the supabase client
  its being used only for the login probably there is better patter to do that
  without creating a whole context
- [ ] Add logout button
- [ ] Missing mode ones
- [ ] Use a best practices to create small routes and divide in resposibilities the files has all
routes big mess
- [ ] add alias routes
- [ ] An admin so they can or not edit album from other person
- [ ] clean the backend something hexagone arquitecture for fastify
- [ ] cypress test 2e2
- [ ] add vitest
- [ ] add new node test to fastify
- [ ] cloc remove dev-dist
- [ ] On select album page, create case when other user already send an invite
    - [x] adding the create album using the api `/api/album` post service and useSWRMutation
- [ ] On select album page, create case when create a new album
    - [x] add the id album to the creation of the album => album_type_id
    - [x] create new column
    - [ ] create table with album_type_id and names like one for the world cup album other for the fpc album
-[ ] check most pages use the padding
-[ ] Test on phone 
-[ ] Test using two phones while changing the same album
[x] Fix scroll on all pages
- [ ] Fix page to select an album
- [ ] Deploy app
- [ ] Add more pwa things (?)
    - [ ] cache statics
    - [ ] save album
    - [ ] push notifications
- [ ] Add more album options
- [ ] WI add some indication visual that some sticker are more important
- [ ] invite new user throw mail
    - [ ] if the user hits the page throw the email do something
    - [ ] if the user register with an invitation will show to create a new album or continue with join album
- [ ] move styles to tailwind use other library for the components

## learnings
- Doing the album as JSON type makes difficult to update if you make any changes to the album interface, because its not like update
a column and update all rows. It's to update a json for all registers that is harder.

## usefull links
- https://2brew.github.io/
- https://github.com/2brew/2brew.github.io
- to learn about the pwa use the pwa vite repo

