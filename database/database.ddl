-- 创建表结构，包含主键、外键和自增列，保留字段注释
use test;


CREATE TABLE HXY_TOPIC (
    TOPICID INT NOT NULL AUTO_INCREMENT,
    TNAME VARCHAR(255) NOT NULL,
    PRIMARY KEY (TOPICID)
) ENGINE=InnoDB COMMENT='Topic Information';

CREATE TABLE HXY_AUTHOR (
    AUTHNO INT NOT NULL AUTO_INCREMENT,
    AFNAME VARCHAR(30) NOT NULL COMMENT 'Author First Name',
    ALNAME VARCHAR(30) NOT NULL COMMENT 'Author Last Name',
    STREET VARCHAR(30) NOT NULL COMMENT 'Street of Mailing Address',
    CITY VARCHAR(30) NOT NULL COMMENT 'City of Mailing Address',
    ZIPCODE VARCHAR(5) NOT NULL COMMENT 'Zipcode of Mailing Address',
    EMAIL VARCHAR(320) NOT NULL COMMENT 'Author Email Address',
    PRIMARY KEY (AUTHNO)
) ENGINE=InnoDB;

CREATE TABLE HXY_BOOK (
    BOOKNO INT NOT NULL AUTO_INCREMENT,
    BNAME VARCHAR(255) NOT NULL COMMENT 'Book Name',
    TOPICID INT NOT NULL,
    PRIMARY KEY (BOOKNO),
    FOREIGN KEY (TOPICID) REFERENCES HXY_TOPIC(TOPICID)
) ENGINE=InnoDB COMMENT='Book Information';

CREATE TABLE HXY_BOOK_AUTHOR (
    BOOKNO INT NOT NULL,
    AUTHNO INT NOT NULL,
    PRIMARY KEY (BOOKNO, AUTHNO),
    FOREIGN KEY (BOOKNO) REFERENCES HXY_BOOK(BOOKNO),
    FOREIGN KEY (AUTHNO) REFERENCES HXY_AUTHOR(AUTHNO)
) ENGINE=InnoDB;

CREATE TABLE HXY_COPY (
    COPYNO INT NOT NULL,
    STATUS VARCHAR(20) NOT NULL COMMENT 'Copy is Available or Not',
    BOOKNO INT NOT NULL,
    PRIMARY KEY (COPYNO, BOOKNO),
    FOREIGN KEY (BOOKNO) REFERENCES HXY_BOOK(BOOKNO)
) ENGINE=InnoDB;

CREATE TABLE HXY_CUSTOMER (
    CUSTNO INT NOT NULL AUTO_INCREMENT,
    CFNAME VARCHAR(30) NOT NULL COMMENT 'Customer First Name',
    CLNAME VARCHAR(30) NOT NULL COMMENT 'Customer Last Name',
    PHONE VARCHAR(20) NOT NULL COMMENT 'Customer Phone Number',
    EMAIL VARCHAR(320) NOT NULL COMMENT 'Customer Email Address',
    IDTYPE VARCHAR(20) NOT NULL COMMENT 'Customer Identification Type',
    IDNO VARCHAR(50) NOT NULL COMMENT 'Customer Identification Number',
    PRIMARY KEY (CUSTNO)
) ENGINE=InnoDB;

CREATE TABLE HXY_EVENT (
    ENVENTID INT NOT NULL AUTO_INCREMENT,
    ENAME VARCHAR(30) NOT NULL COMMENT 'Event Name',
    ETYPE VARCHAR(14) NOT NULL COMMENT 'Event Type',
    STARTDATE DATE NOT NULL COMMENT 'Event Start Datetime',
    ENDDATE DATE NOT NULL COMMENT 'Event End Datetime',
    TOPICID INT NOT NULL,
    PRIMARY KEY (ENVENTID),
    CHECK (ETYPE IN ('HXY_EXHIBITION', 'HXY_SEMINAR')),
    FOREIGN KEY (TOPICID) REFERENCES HXY_TOPIC(TOPICID)
) ENGINE=InnoDB;

CREATE TABLE HXY_SEMINAR (
    ENVENTID INT NOT NULL PRIMARY KEY COMMENT 'Event ID Number',
    FOREIGN KEY (ENVENTID) REFERENCES HXY_EVENT(ENVENTID)
) ENGINE=InnoDB;

CREATE TABLE HXY_EXHIBITION (
    ENVENTID INT NOT NULL PRIMARY KEY COMMENT 'Event ID Number',
    EXPENSE DECIMAL(12,2) NOT NULL COMMENT 'Exhibition Expense',
    FOREIGN KEY (ENVENTID) REFERENCES HXY_EVENT(ENVENTID)
) ENGINE=InnoDB;

CREATE TABLE HXY_AUTHOR_SEMINAR (
    INVID VARCHAR(20) NOT NULL,
    AUTHNO INT NOT NULL,
    ENVENTID INT NOT NULL,
    PRIMARY KEY (INVID),
    FOREIGN KEY (AUTHNO) REFERENCES HXY_AUTHOR(AUTHNO),
    FOREIGN KEY (ENVENTID) REFERENCES HXY_SEMINAR(ENVENTID)
) ENGINE=InnoDB;

CREATE TABLE HXY_SPONSOR (
    SPONSORNO INT NOT NULL AUTO_INCREMENT,
    STYPE VARCHAR(16) NOT NULL COMMENT 'Sponsor Type',
    PRIMARY KEY (SPONSORNO),
    CHECK (STYPE IN ('HXY_INDIVIDUAL', 'HXY_ORGANIZATION'))
) ENGINE=InnoDB;

CREATE TABLE HXY_INDIVIDUAL (
    SPONSORNO INT NOT NULL PRIMARY KEY,
    SFNAME VARCHAR(30) NOT NULL COMMENT 'Sponsor First Name',
    SLNAME VARCHAR(30) NOT NULL COMMENT 'Sponsor Last Name',
    FOREIGN KEY (SPONSORNO) REFERENCES HXY_SPONSOR(SPONSORNO)
) ENGINE=InnoDB;

CREATE TABLE HXY_ORGANIZATION (
    SPONSORNO INT NOT NULL PRIMARY KEY,
    ONAME VARCHAR(30) NOT NULL COMMENT 'Organization Name',
    FOREIGN KEY (SPONSORNO) REFERENCES HXY_SPONSOR(SPONSORNO)
) ENGINE=InnoDB;

CREATE TABLE HXY_EVENT_SPONSOR (
    AMOUNT DECIMAL(12,2) NOT NULL COMMENT 'Sponsorship Amount',
    ENVENTID INT NOT NULL,
    SPONSORNO INT NOT NULL,
    PRIMARY KEY (ENVENTID, SPONSORNO),
    FOREIGN KEY (ENVENTID) REFERENCES HXY_SEMINAR(ENVENTID),
    FOREIGN KEY (SPONSORNO) REFERENCES HXY_SPONSOR(SPONSORNO)
) ENGINE=InnoDB;

CREATE TABLE HXY_CUSTOMER_EXHIBITION (
    REGID VARCHAR(20) NOT NULL COMMENT 'Registration ID Number',
    ENVENTID INT NOT NULL,
    CUSTNO INT NOT NULL,
    PRIMARY KEY (REGID),
    FOREIGN KEY (CUSTNO) REFERENCES HXY_CUSTOMER(CUSTNO),
    FOREIGN KEY (ENVENTID) REFERENCES HXY_EXHIBITION(ENVENTID)
) ENGINE=InnoDB;

CREATE TABLE HXY_ROOM (
    ROOMNO INT NOT NULL PRIMARY KEY COMMENT 'Study Room ID Number',
    CAPACITY INT NOT NULL COMMENT 'Study Room Capacity'
) ENGINE=InnoDB;

CREATE TABLE HXY_RESERVATION (
    RESID INT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT 'Reservation ID Number',
    TOPIC VARCHAR(255) NOT NULL COMMENT 'Brief Description of the Study',
    RESDATE DATE NOT NULL COMMENT 'Reservation Date',
    STARTTIME DATETIME NOT NULL COMMENT 'Start Time',
    ENDTIME DATETIME NOT NULL COMMENT 'End Time',
    NOI INT NOT NULL COMMENT 'Number of Individuals in Group',
    CUSTNO INT NOT NULL,
    ROOMNO INT NOT NULL,
    FOREIGN KEY (CUSTNO) REFERENCES HXY_CUSTOMER(CUSTNO),
    FOREIGN KEY (ROOMNO) REFERENCES HXY_ROOM(ROOMNO)
) ENGINE=InnoDB;

CREATE TABLE HXY_RENTAL (
    RENTID INT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT 'Rental Service ID Number',
    RSTATUS VARCHAR(10) NOT NULL COMMENT 'Rental Status',
    BORROWDATE DATE NOT NULL COMMENT 'Borrow Date',
    ERETURNDATE DATE NOT NULL COMMENT 'Expected Return Date',
    ARETURNDATE DATE COMMENT 'Actual Return Date',
    COPYNO INT NOT NULL,
    BOOKNO INT NOT NULL,
    CUSTNO INT NOT NULL,
    FOREIGN KEY (COPYNO, BOOKNO) REFERENCES HXY_COPY(COPYNO, BOOKNO),
    FOREIGN KEY (CUSTNO) REFERENCES HXY_CUSTOMER(CUSTNO)
) ENGINE=InnoDB;

CREATE TABLE HXY_INVOICE (
    RENTID INT NOT NULL PRIMARY KEY,
    INVDATE DATE NOT NULL COMMENT 'Invoice Date',
    INVAMOUNT DECIMAL(8,2) NOT NULL COMMENT 'Invoice Amount',
    FOREIGN KEY (RENTID) REFERENCES HXY_RENTAL(RENTID)
) ENGINE=InnoDB;

CREATE TABLE HXY_PAYMENT (
    PAYID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    PAYDATE DATE NOT NULL COMMENT 'Payment Date',
    METHOD VARCHAR(10) NOT NULL COMMENT 'Payment Method',
    CFNAME VARCHAR(30) COMMENT 'Card Holder First Name',
    CLNAME VARCHAR(30) COMMENT 'Card Holder Last Name',
    PAYAMOUNT DECIMAL(8,2) NOT NULL COMMENT 'Payment Amount',
    RENTID INT NOT NULL,
    FOREIGN KEY (RENTID) REFERENCES HXY_INVOICE(RENTID)
) ENGINE=InnoDB;

-- 创建触发器实现Arc约束
DELIMITER //

-- HXY_SEMINAR触发器
CREATE TRIGGER ARC_FKArc_5_HXY_SEMINAR_INSERT BEFORE INSERT ON HXY_SEMINAR
FOR EACH ROW
BEGIN
    DECLARE d VARCHAR(14);
    SELECT ETYPE INTO d FROM HXY_EVENT WHERE ENVENTID = NEW.ENVENTID;
    IF (d IS NULL OR d <> 'HXY_SEMINAR') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Arc constraint violation: HXY_SEMINAR must reference HXY_EVENT with ETYPE=HXY_SEMINAR';
    END IF;
END//

CREATE TRIGGER ARC_FKArc_5_HXY_SEMINAR_UPDATE BEFORE UPDATE ON HXY_SEMINAR
FOR EACH ROW
BEGIN
    DECLARE d VARCHAR(14);
    SELECT ETYPE INTO d FROM HXY_EVENT WHERE ENVENTID = NEW.ENVENTID;
    IF (d IS NULL OR d <> 'HXY_SEMINAR') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Arc constraint violation: HXY_SEMINAR must reference HXY_EVENT with ETYPE=HXY_SEMINAR';
    END IF;
END//

-- HXY_EXHIBITION触发器
CREATE TRIGGER ARC_FKArc_5_HXY_EXHIBITION_INSERT BEFORE INSERT ON HXY_EXHIBITION
FOR EACH ROW
BEGIN
    DECLARE d VARCHAR(14);
    SELECT ETYPE INTO d FROM HXY_EVENT WHERE ENVENTID = NEW.ENVENTID;
    IF (d IS NULL OR d <> 'HXY_EXHIBITION') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Arc constraint violation: HXY_EXHIBITION must reference HXY_EVENT with ETYPE=HXY_EXHIBITION';
    END IF;
END//

CREATE TRIGGER ARC_FKArc_5_HXY_EXHIBITION_UPDATE BEFORE UPDATE ON HXY_EXHIBITION
FOR EACH ROW
BEGIN
    DECLARE d VARCHAR(14);
    SELECT ETYPE INTO d FROM HXY_EVENT WHERE ENVENTID = NEW.ENVENTID;
    IF (d IS NULL OR d <> 'HXY_EXHIBITION') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Arc constraint violation: HXY_EXHIBITION must reference HXY_EVENT with ETYPE=HXY_EXHIBITION';
    END IF;
END//

-- HXY_INDIVIDUAL触发器
CREATE TRIGGER ARC_FKArc_6_HXY_INDIVIDUAL_INSERT BEFORE INSERT ON HXY_INDIVIDUAL
FOR EACH ROW
BEGIN
    DECLARE d VARCHAR(16);
    SELECT STYPE INTO d FROM HXY_SPONSOR WHERE SPONSORNO = NEW.SPONSORNO;
    IF (d IS NULL OR d <> 'HXY_INDIVIDUAL') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Arc constraint violation: HXY_INDIVIDUAL must reference HXY_SPONSOR with STYPE=HXY_INDIVIDUAL';
    END IF;
END//

CREATE TRIGGER ARC_FKArc_6_HXY_INDIVIDUAL_UPDATE BEFORE UPDATE ON HXY_INDIVIDUAL
FOR EACH ROW
BEGIN
    DECLARE d VARCHAR(16);
    SELECT STYPE INTO d FROM HXY_SPONSOR WHERE SPONSORNO = NEW.SPONSORNO;
    IF (d IS NULL OR d <> 'HXY_INDIVIDUAL') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Arc constraint violation: HXY_INDIVIDUAL must reference HXY_SPONSOR with STYPE=HXY_INDIVIDUAL';
    END IF;
END//

-- HXY_ORGANIZATION触发器
CREATE TRIGGER ARC_FKArc_6_HXY_ORGANIZATION_INSERT BEFORE INSERT ON HXY_ORGANIZATION
FOR EACH ROW
BEGIN
    DECLARE d VARCHAR(16);
    SELECT STYPE INTO d FROM HXY_SPONSOR WHERE SPONSORNO = NEW.SPONSORNO;
    IF (d IS NULL OR d <> 'HXY_ORGANIZATION') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Arc constraint violation: HXY_ORGANIZATION must reference HXY_SPONSOR with STYPE=HXY_ORGANIZATION';
    END IF;
END//

CREATE TRIGGER ARC_FKArc_6_HXY_ORGANIZATION_UPDATE BEFORE UPDATE ON HXY_ORGANIZATION
FOR EACH ROW
BEGIN
    DECLARE d VARCHAR(16);
    SELECT STYPE INTO d FROM HXY_SPONSOR WHERE SPONSORNO = NEW.SPONSORNO;
    IF (d IS NULL OR d <> 'HXY_ORGANIZATION') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Arc constraint violation: HXY_ORGANIZATION must reference HXY_SPONSOR with STYPE=HXY_ORGANIZATION';
    END IF;
END//

DELIMITER ;