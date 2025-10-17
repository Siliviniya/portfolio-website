CREATE TABLE users (
  username varchar(20) unique not null,
  email varchar(50) unique not null,
  password varchar(20) check (length(password) >= 8)
  refreshtoken varchar(255) 
);

create table refreshtoken (
  id uuid primary key default gen_random_uuid(),
  refreshtoken varchar(255) unique
  user_id uuid references users(id) on delete cascade
  expires_in timestamp not null
)

create table verification_code (
  id uuid primary key default gen_random_uuid(),
  code varchar(255) unique
  user_id uuid references users(id) on delete cascade
  expires_in timestamp not null
)