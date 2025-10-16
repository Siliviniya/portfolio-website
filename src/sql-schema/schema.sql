CREATE TABLE users (
  username varchar(20) unique not null,
  email varchar(50) unique not null,
  password varchar(20) check (length(password) >= 8)
);
