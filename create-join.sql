drop table if exists users;
drop table if exists albums;
drop table if exists album_members;

create table 
  users (
    email text primary key,
    created_at timestamp default current_date,
    avatar text
  );

create table 
  albums (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp default current_date,
    delete boolean,
    stickers json,
    name text,
    owner text
  );

create table 
  album_members (
    user_email text not null references users,
    album_id uuid not null references albums,
    selected bool default false
  );
