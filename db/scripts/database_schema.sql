CREATE DATABASE IF NOT EXISTS packages;

USE packages;

CREATE TABLE IF NOT EXISTS offer (
  Id int(11) NOT NULL AUTO_INCREMENT,
  Text varchar(255) NOT NULL UNIQUE,
  CreateDate timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (Id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;

