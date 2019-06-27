DROP DATABASE IF EXISTS `database`;
CREATE DATABASE `database`;
USE `database`;

CREATE TABLE `availability` (
	id INT AUTO_INCREMENT NOT NULL UNIQUE,
	datetime DATETIME NOT NULL UNIQUE,
    busy BOOL NOT NULL DEFAULT false,
    PRIMARY KEY (datetime)
);

CREATE TABLE `appointments` (
	id INT AUTO_INCREMENT NOT NULL UNIQUE,
    code VARCHAR(11) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone INT(11) NOT NULL,
    datetime DATETIME NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (datetime) REFERENCES availability(datetime)
);

INSERT INTO availability (datetime) VALUES 	("2018-5-11");
INSERT INTO availability (datetime) VALUES 	("2018-5-12");
INSERT INTO availability (datetime) VALUES 	("2018-5-13");
INSERT INTO availability (datetime) VALUES 	("2018-5-14");

SELECT * FROM availability;