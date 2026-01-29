CREATE TABLE school (
  school_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  school_name TEXT NOT NULL,
  school_admin_id BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (school_id)
);
CREATE TABLE school_admin (
  school_admin_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  school_id BIGINT UNSIGNED NOT NULL,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  PRIMARY KEY (school_admin_id),
  FOREIGN KEY (school_id) REFERENCES school(school_id)
);
-- users because user is a reserved keyword in SQL
CREATE TABLE users (
  user_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  school_id BIGINT UNSIGNED NOT NULL,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  PRIMARY KEY (user_id),
  FOREIGN KEY (school_id) REFERENCES school(school_id)
);
-- Add foreign key constraint to school table
ALTER TABLE school
ADD CONSTRAINT fk_school_admin
FOREIGN KEY (school_admin_id)
REFERENCES school_admin(school_admin_id);
