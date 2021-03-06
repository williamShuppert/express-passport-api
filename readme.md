# Express/Passport API template 🔌
An API using Node, Express.js, Passport.js, and MySQL. Uses both local and google oauth2.0 for authentication.

## Setup
* ```npm i```
* add and fill out .env file in root dir from below template
* add required MySQL tables from below
* ```npm run start``` or ```npm run dev```

* manage google oauth at https://console.cloud.google.com/apis/credentials/consent

## .env template
```
NODE_ENV = 'dev'
PORT = 8000

DB_USER = ''
DB_PASSWORD = ''
DB_NAME = ''

SESSION_SECRET = ''

GOOGLE_CONSUMER_KEY = ''
GOOGLE_CONSUMER_SECRET = ''
```

## Required MySQL tables
```
CREATE TABLE users (
	id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(16) UNIQUE NOT NULL,
    nickname VARCHAR(16) NOT NULL,
    email VARCHAR(254) UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE security_descriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(100) NOT NULL
);

CREATE TABLE securities (
    user_id INT,
    security_id INT,
    PRIMARY KEY (user_id, security_id),
	FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (security_id) REFERENCES security_descriptions(id)
);

CREATE TABLE passwords (
    user_id INT PRIMARY KEY,
    password CHAR(60) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE oauth (
    user_id INT,
    id VARCHAR(100),
    provider VARCHAR(30),
    PRIMARY KEY (id, provider),
	FOREIGN KEY (user_id) REFERENCES users(id)
);
```
