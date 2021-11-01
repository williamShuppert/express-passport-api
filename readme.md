## Setup
* ```npm i```
* add and fill out .env file in root dir from below template
* add required MySQL tables from below
* ```npm run start``` or ```npm run dev```

## .env template
```
NODE_ENV = 'dev'
PORT = 8000

DB_USER = ''
DB_PASSWORD = ''
DB_NAME = ''

SESSION_SECRET = ''
```

## Required MySQL tables
```
CREATE TABLE users (
	id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(16) UNIQUE NOT NULL,
    nickname VARCHAR(16) NOT NULL,
    email VARCHAR(254) UNIQUE NOT NULL,
    password CHAR(60) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```