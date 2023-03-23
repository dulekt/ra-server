/*
database.sql
password: postgres
username: postgres
(psql -h hostname -d databasename -U username -f filepath.sql)
psql -U postgres  -d ra -f C:\VSC_projects\ra-server\database.sql
\c ra => to connect to database
\dt => to list all tables
\d table_name => to list table structure
testtest
*/

CREATE DATABASE ra;

/* POST/GET/DELETE done*/
CREATE TABLE  ra_users (
    "userID" SERIAL PRIMARY KEY,
    "username" VARCHAR(10) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "surname" VARCHAR(50) NOT NULL
);

/* POST/GET done*/
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
    "content" text [],
    "workcenter" text

);


/* POST/GET/DELETE done*/
CREATE TABLE   ra_labels (

    "labelID" SERIAL PRIMARY KEY,
    "label" VARCHAR(25) NOT NULL,
    "label_width" float NOT NULL,
    "label_height" float NOT NULL,
    "ribbon_width" float NOT NULL,
    "label_x0" float NOT NULL,
    "font_size" INTEGER NOT NULL,
    "labels_in_row" INTEGER NOT NULL,
    "print_cell_printer" VARCHAR(50) NOT NULL,
    "lines_of_text" INTEGER DEFAULT 1 NOT NULL

);
/* POST/GET/DELETE done*/
CREATE TABLE  ra_plastic_marks (
    "markID" SERIAL PRIMARY KEY,
    "mark" VARCHAR(25) NOT NULL,
    "mark_description" VARCHAR(100),
    "max_length" INTEGER NOT NULL
);

/* POST/GET/DELETE done*/
CREATE TABLE printers (
    "printerID" SERIAL PRIMARY KEY,
    "printerName" VARCHAR(50) NOT NULL,
    "printerIP" VARCHAR(50) NOT NULL,
    "printerPort" VARCHAR(50) NOT NULL,
    "printerDPI" INTEGER NOT NULL,
    "workcenter" VARCHAR(50) NOT NULL

);
/* POST/GET/DELETE done*/
CREATE TABLE  ra_workcenters (
    "workcenterID" SERIAL PRIMARY KEY,
    "workcenter" VARCHAR(25) NOT NULL,
    "printableLabels" text[]
);
