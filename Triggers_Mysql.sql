-- 1. Customer ID Type must be one of defined types (Use ENUM)
ALTER TABLE HXY_CUSTOMER 
MODIFY IDTYPE ENUM('Passport', 'SSN', 'Driver License') NOT NULL;

-- 2. Copy status must be either Available or Not Available (Use ENUM)
ALTER TABLE HXY_COPY 
MODIFY STATUS ENUM('Available', 'Not Available') NOT NULL;

-- 3. Author Zipcode must be exactly 5 digits (Use TRIGGER)
DELIMITER //
CREATE TRIGGER trg_chk_author_zipcode
BEFORE INSERT ON HXY_AUTHOR
FOR EACH ROW
BEGIN
    IF NEW.ZIPCODE NOT REGEXP '^[0-9]{5}$' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Zipcode must be exactly 5 digits';
    END IF;
END;
//
DELIMITER ;

-- 4. Rental Status must be one of Borrowed, Returned, or Late (Use ENUM)
ALTER TABLE HXY_RENTAL 
MODIFY RSTATUS ENUM('Borrowed', 'Returned', 'Late') NOT NULL;

-- 5. Borrow date must be earlier than return dates (Use TRIGGER)
DELIMITER //
CREATE TRIGGER trg_chk_rental_dates
BEFORE INSERT ON HXY_RENTAL
FOR EACH ROW
BEGIN
    IF NEW.ERETURNDATE < NEW.BORROWDATE OR NEW.ARETURNDATE < NEW.BORROWDATE THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Return date must be later than borrow date';
    END IF;
END;
//
DELIMITER ;

DELIMITER //

CREATE TRIGGER trg_generate_invoice
AFTER UPDATE ON HXY_RENTAL
FOR EACH ROW
BEGIN
    DECLARE v_invoice_amount DECIMAL(10,2);

    -- 只有当 RSTATUS 被更新为 'Returned' 时才执行
    IF NEW.RSTATUS = 'Returned' THEN
        IF NEW.ARETURNDATE <= NEW.ERETURNDATE THEN
            SET v_invoice_amount = (DATEDIFF(NEW.ARETURNDATE, NEW.BORROWDATE) * 0.2);
        ELSE
            SET v_invoice_amount = (DATEDIFF(NEW.ERETURNDATE, NEW.BORROWDATE) * 0.2) +
                                   (DATEDIFF(NEW.ARETURNDATE, NEW.ERETURNDATE) * 0.4);
        END IF;

        -- 插入发票数据
        INSERT INTO HXY_INVOICE (INVDATE, INVAMOUNT, RENTID)
        VALUES (NOW(), v_invoice_amount, NEW.RENTID);
    END IF;
END;
//

DELIMITER ;
