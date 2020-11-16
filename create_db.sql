DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS messages;

CREATE TABLE users(
  user_id int primary key generated always as identity,
  username varchar(20) not null UNIQUE,
  hash varchar(60) not null,
  email varchar(60) not null UNIQUE,
  first_name varchar(30) not null,
  last_name varchar(30),
  rating int not null default 0 check (0 <= rating),
  avatar varchar(150) default '/images/avatar_example.png',
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
  content text not null,
  rating int not null default 0 check (0 <= rating),
  create_date timestamp not null default current_timestamp,
  update_date timestamp not null default current_timestamp,
  foreign key(user_id) references users(user_id)
);

CREATE TABLE messages(
  message_id int primary key generated always as identity,
  sent_from int not null,
  sent_to int not null,
  content text not null,
  create_date timestamp not null default current_timestamp,
  foreign key(sent_from) references users(user_id),
  foreign key(sent_to) references users(user_id)
);

CREATE OR REPLACE FUNCTION add_user(
  username1 varchar(20),
  hash1 varchar(60),
  email1 varchar(60),
  first_name1 varchar(30),
  country1 varchar(30),
  last_name1 varchar(30) default null
) RETURNS SETOF users AS $$
INSERT INTO users(username, hash, email, first_name, last_name, country)
VALUES (username1, hash1, email1, first_name1, last_name1, country1)
RETURNING *;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION add_post(
  user_id1 int,
  title1 varchar(80),
  meta_title1 varchar(100),
  content1 text
) RETURNS SETOF posts AS $$
UPDATE users SET posts_count = posts_count+1 WHERE user_id = user_id1;
INSERT INTO posts(user_id, title, meta_title, content)
VALUES (user_id1, title1, meta_title1, content1)
RETURNING *;
$$ LANGUAGE SQL;

DROP FUNCTION get_chat(int);
CREATE OR REPLACE FUNCTION get_chat(user_id1 int)
RETURNS TABLE(
	from_me bool,
	"content" text,
	create_date timestamp,
	user_id int,
	username varchar(20),
	first_name varchar(30),
	avatar varchar(150)
) AS $$
SELECT user_id=sent_to, "content", messages.create_date, user_id, username, first_name, avatar FROM messages
LEFT JOIN users ON (user_id = sent_to OR user_id = sent_from) AND user_id <> user_id1
WHERE sent_from = user_id1 OR sent_to = user_id1
ORDER BY messages.create_date;
$$ LANGUAGE SQL;
