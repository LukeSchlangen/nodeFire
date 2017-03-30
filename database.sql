CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(200) UNIQUE NOT NULL,
  clearance_level INT NOT NULL DEFAULT 0
);

INSERT INTO users (email, clearance_level)
VALUES ('lukeschlangen@gmail.com', 5),
('youremail@example.com', 4), --Your Google Email added here
('youremail@example.com', 2), --Your Other Google Email added here
('luke@primeacademy.io', 3);

CREATE TABLE secret_information (
  id SERIAL PRIMARY KEY,
  secrecy_level INT NOT NULL DEFAULT 5,
  secret_text VARCHAR(2000)
);

INSERT INTO secret_information (secrecy_level, secret_text)
VALUES (1, 'Not that secret'),
(4, 'A good secret'),
(3, 'A secret'),
(2, 'Kind of a secret'),
(5, 'A super duper secret!');
