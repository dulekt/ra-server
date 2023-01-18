/*
database.sql
(psql -h hostname -d databasename -U username -f filepath.sql)
psql -U postgres  -d ra -f C:\Visual_code_projects\ra-server\database.sql
\c ra => to connect to database
\dt => to list all tables 
\d table_name => to list table structure
testtest
*/

CREATE DATABASE ra;

CREATE TABLE  ra_users (
    "userID" SERIAL PRIMARY KEY,
    "username" VARCHAR(10) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "surname" VARCHAR(50) NOT NULL
);

CREATE TABLE orders (
    "id" SERIAL PRIMARY KEY,
    "isPrinted" boolean NOT NULL DEFAULT false, 
    "datetime" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" text,
    "description" text,
    "labelType" text,
    "order_number" text,
    "order_type" text,
    "user" text,
    "content" text []

);

CREATE TABLE printers (
    "printerID" SERIAL PRIMARY KEY,
    "printerName" VARCHAR(50) NOT NULL,
    "printerIP" VARCHAR(50) NOT NULL,
    "printerPort" VARCHAR(50) NOT NULL,
    "printerDPI" INTEGER NOT NULL
);

CREATE TABLE   ra_labels (
/*      examples:
labelID | label   | label_description |font_size|max_length
1 |  800006-26-04 |  podstawowa       |    10   |      10
2 |  T9957-012    |  devices          |    10   |      10
3 |  T9957-018    |  smaller          |    10   |      10
*/
    "labelID" SERIAL PRIMARY KEY,
    "label" VARCHAR(25) NOT NULL,
    "label_description" VARCHAR(100),
    "font_size" INTEGER NOT NULL,
    "max_length" INTEGER NOT NULL,
    "labels_in_row" INTEGER NOT NULL
);

CREATE TABLE  ra_plastic_marks (
/*      examples:
1 |  1 |  sleeve tag      | 10
2 | 30 | terminals MCC    | 10
3 | 34 | terminals P6000  | 10
*/
    "markID" SERIAL PRIMARY KEY,
    "mark" VARCHAR(25) NOT NULL,
    "mark_description" VARCHAR(100),
    "max_length" INTEGER NOT NULL
);