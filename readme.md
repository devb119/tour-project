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
DATABASE=<YOUR CLOUD MONGODB CONNECTION STRING>
DATABASE_PASSWORD=<YOUR DB PASSWORD>

JWT_SECRET=this-is-the-dumpest-secret-code-in-the-world
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

EMAIL_USERNAME=e3313087a82e6c
EMAIL_PASSWORD=3945a60a199870
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525

EMAIL_FROM=<YOUR EMAIL>

GMAIL_USERNAME=<YOUR EMAIL>
GMAIL_PASSWORD=<YOUR EMAIL PASSWORD>

STRIPE_SECRET_KEY=sk_test_51JwHK7LJ438FhWmEoFyq4jxa2y8nHPjmxDz9ecTy5PxDbPuDUwZaeaClmq1V6sFaV5ZoAgw8NDw6bQRAzXa2F9Yx00w9fpT762
STRIPE_WEBHOOK_SECRET=whsec_dq7SCpvD7Nx4X5nby69KkyVgkJKcPnUn

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
