# Natours Application

Built using modern technologies: node.js, express, mongoDB, mongoose

## Requirements

- node.js > v14

## How to run the project

- Install node.js

- Create file with name config.env and these content:

NODE_ENV=development
PORT=3000
USER=ducanh
DATABASE=YOUR_CLOUD_MONGODB_CONNECTION_STRING
DATABASE_PASSWORD=YOUR_DB_PASSWORD

JWT_SECRET=this-is-the-dumpest-secret-code-in-the-world
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

EMAIL_USERNAME=e3313087a82e6c
EMAIL_PASSWORD=3945a60a199870
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525

EMAIL_FROM=YOUR_EMAIL

GMAIL_USERNAME=YOUR_EMAIL
GMAIL_PASSWORD=YOUR_EMAIL_PASSWORD

STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET=YOUR_STRIPE_WEBHOOK_SECRET

- Run these script:

1. npm install
2. npm i -g nodemon (If you haven't had nodemon installed on your computer)
3. npm run dev
4. Now, open http://127.0.0.1:3000 to see the result

## Import data

- Open terminal and run these script if your database doesn't have data yet

* node dev-data/data/import-dev-data.js --import

- If you need to delete all the data:

* node dev-data/data/import-dev-data.js --delete
