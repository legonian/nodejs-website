DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;

CREATE TABLE users(
  user_id int primary key generated always as identity,
  username varchar(20) not null UNIQUE,
  hash varchar(60) not null,
  email varchar(60) not null,
  first_name varchar(30) not null,
  last_name varchar(30),
  rating int not null default 0 check (0 <= rating),
  avatar bytea,
  user_info varchar(420),
  posts_count int not null default 0 check (0 <= posts_count),
  create_date timestamp not null default current_timestamp,
  country varchar(30) not null
);

CREATE TABLE posts(
  post_id int primary key generated always as identity,
  user_id int not null,
  title varchar(80) not null UNIQUE,
  meta_title varchar(100) not null,
  rating int not null default 0 check (0 <= rating),
  create_date timestamp not null default current_timestamp,
  update_date timestamp not null default current_timestamp,
  content text not null,
  foreign key(user_id) references users(user_id)
);
