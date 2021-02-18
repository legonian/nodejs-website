DROP TABLE IF EXISTS users, posts, messages CASCADE;

-- Table that contain site users and info about them
CREATE TABLE users(
  user_id int primary key generated always as identity,
  username varchar(20) not null UNIQUE,
  hash varchar(60) not null,
  email varchar(100) not null UNIQUE,
  first_name varchar(30) not null,
  last_name varchar(30),
  rating int not null default 0 check (0 <= rating),
  avatar varchar(150) default '/images/avatar_example.png',
  user_info varchar(420),
  posts_count int not null default 0 check (0 <= posts_count),
  create_date timestamp not null default current_timestamp,
  country varchar(30) not null
);

-- Table that contain posts created by users
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

-- Table that contain messages created by users
CREATE TABLE messages(
  message_id int primary key generated always as identity,
  sent_from int not null,
  sent_to int not null,
  content text not null,
  create_date timestamp not null default current_timestamp,
  foreign key(sent_from) references users(user_id),
  foreign key(sent_to) references users(user_id)
);

-- Shortcut function to insert new user with optional fields
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

-- Shortcut function to insert new post and also to increment 'posts_count' for
-- user that create post
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

-- Get all messages related to selected user with data from both 'messages' and
-- 'users' tables
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
SELECT user_id=sent_to, "content", messages.create_date, user_id, username, first_name, avatar
FROM messages
LEFT JOIN users ON (user_id = sent_to OR user_id = sent_from) AND user_id <> user_id1
WHERE sent_from = user_id1 OR sent_to = user_id1
ORDER BY messages.create_date;
$$ LANGUAGE SQL;

-- Update 'update_date' field in post when post updated
CREATE OR REPLACE FUNCTION track_post_changes() RETURNS trigger AS $$
BEGIN
  NEW.update_date = now();
  RETURN NEW;
END
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS post_update_timestamp ON posts;
CREATE TRIGGER post_update_timestamp BEFORE UPDATE on posts
FOR EACH ROW EXECUTE PROCEDURE track_post_changes();

-- Table that contain logs on any 'users' table changes
DROP TABLE IF EXISTS users_changes CASCADE;
CREATE TABLE users_changes(
  operationc char(1) not null,
  by_user text not null,
  time_stamp timestamp not null,

  user_id int not null,
  username varchar(20) not null,
  hash varchar(60) not null,
  email varchar(100) not null,
  first_name varchar(30) not null,
  last_name varchar(30),
  rating int not null,
  avatar varchar(150) not null,
  user_info varchar(420),
  posts_count int not null,
  create_date timestamp not null,
  country varchar(30) not null
);

-- Function to log data into 'users_changes' table
CREATE OR REPLACE FUNCTION log_users_changes() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO users_changes
    SELECT 'I', session_user, now(), new_table.* FROM new_table;
  ELSEIF TG_OP = 'UPDATE' THEN
    INSERT INTO users_changes
    SELECT 'U', session_user, now(), new_table.* FROM new_table;
  ELSEIF TG_OP = 'DELETE' THEN
    INSERT INTO users_changes
    SELECT 'D', session_user, now(), old_table.* FROM old_table;
  END IF;
  RETURN NULL;
END
$$ LANGUAGE plpgsql;

-- Triggers to catch actions on 'users' table
DROP TRIGGER IF EXISTS logs_users_insert ON users;
CREATE TRIGGER logs_users_insert AFTER INSERT ON users
REFERENCING NEW TABLE AS new_table
FOR EACH STATEMENT EXECUTE PROCEDURE log_users_changes();

DROP TRIGGER IF EXISTS logs_users_update ON users;
CREATE TRIGGER logs_users_update AFTER UPDATE ON users
REFERENCING NEW TABLE AS new_table
FOR EACH STATEMENT EXECUTE PROCEDURE log_users_changes();

DROP TRIGGER IF EXISTS logs_users_delete ON users;
CREATE TRIGGER logs_users_delete AFTER DELETE ON users
REFERENCING OLD TABLE AS old_table
FOR EACH STATEMENT EXECUTE PROCEDURE log_users_changes();
