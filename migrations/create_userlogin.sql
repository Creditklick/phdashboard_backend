


-- CREATE TABLE IF NOT EXISTS Users (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   email VARCHAR(255) NOT NULL UNIQUE,
--   password VARCHAR(255) NOT NULL,
--   role VARCHAR(255) NOT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );




-- CREATE TABLE IF NOT EXISTS Sessions (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   user_id INT,   
--   session_token VARCHAR(255) NOT NULL,
--   user_agent TEXT,
--   ip_address VARCHAR(255),
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   is_active BOOLEAN DEFAULT TRUE,
--   FOREIGN KEY (user_id) REFERENCES Users(id)
-- );








-- CREATE TABLE attendance (
--   `id` int(11) NOT NULL AUTO_INCREMENT,
--   `emp_code` varchar(50) NOT NULL,
--   `emp_name` varchar(100) NOT NULL,
--   `attendance_records` varchar(100) NOT NULL COMMENT 'Comma-separated P/A values for 31 days',
--   `team_leader` varchar(50) NOT NULL,
--   `process` varchar(100) NOT NULL,
--   `am` varchar(100) NOT NULL,
--   `upload_date` datetime NOT NULL,
--   PRIMARY KEY (`id`),
--   UNIQUE KEY `unique_emp_code` (`emp_code`),
--   KEY `idx_team_leader` (`team_leader`),
--   KEY `idx_upload_date` (`upload_date`)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



-- CREATE TABLE agent_recovery (
--   `id` int(11) NOT NULL AUTO_INCREMENT,
--   `emp_code` varchar(255) NOT NULL UNIQUE,
--   `emp_name` varchar(255) DEFAULT NULL,
--   `attendance_records` text COMMENT 'Comma-separated P/A values for 31 days',
--   `team_leader` varchar(255) DEFAULT NULL,
--   `upload_date` date DEFAULT NULL,
--   `Process` varchar(255) DEFAULT NULL,
--   `AM` varchar(255) DEFAULT NULL,
--   PRIMARY KEY (`id`),
--   UNIQUE KEY `unique_emp_code` (`emp_code`),
--   KEY `idx_team_leader` (`team_leader`),
--   KEY `idx_upload_date` (`upload_date`)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;





-- CREATE TABLE axis_card_paid (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     agent_code VARCHAR(50),
--     agent_name VARCHAR(100),
--     amount_collected DECIMAL(10,2),
--     account_number VARCHAR(50),
--     AM VARCHAR(100),
--     Process VARCHAR(100),
--     TeamLeader VARCHAR(100),
--      CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     datewise DATE,
--     INDEX idx_datewise (datewise)
-- ) ENGINE=InnoDB;






-- CREATE TABLE axis_loan_paid (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     agent_code VARCHAR(50),
--     agent_name VARCHAR(100),
--     amount_collected DECIMAL(10,2),
--     account_number VARCHAR(50),
--     AM VARCHAR(100),
--     Process VARCHAR(100),
--     TeamLeader VARCHAR(100),
--      CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     datewise DATE,
--     INDEX idx_datewise (datewise)
-- ) ENGINE=InnoDB;






-- CREATE TABLE axis_npa_paid (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     agent_code VARCHAR(50),
--     agent_name VARCHAR(100),
--     amount_collected DECIMAL(10,2),
--     account_number VARCHAR(50),
--     AM VARCHAR(100),
--     Process VARCHAR(100),
--     TeamLeader VARCHAR(100),
--      CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     datewise DATE,
--     INDEX idx_datewise (datewise)
-- ) ENGINE=InnoDB;



-- CREATE TABLE city_paid (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     agent_code VARCHAR(50),
--     agent_name VARCHAR(100),
--     amount_collected DECIMAL(10,2),
--     account_number VARCHAR(50),
--     AM VARCHAR(100),
--     Process VARCHAR(100),
--     TeamLeader VARCHAR(100),
--      CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     datewise DATE,
--     INDEX idx_datewise (datewise)
-- ) ENGINE=InnoDB;








-- CREATE TABLE encore_paid (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     agent_code VARCHAR(50),
--     agent_name VARCHAR(100),
--     amount_collected DECIMAL(10,2),
--     account_number VARCHAR(50),
--     AM VARCHAR(100),
--     Process VARCHAR(100),
--     TeamLeader VARCHAR(100),
--      CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     datewise DATE,
--     INDEX idx_datewise (datewise)
-- ) ENGINE=InnoDB;





-- CREATE TABLE iifl_paid (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     agent_code VARCHAR(50),
--     agent_name VARCHAR(100),
--     amount_collected DECIMAL(10,2),
--     account_number VARCHAR(50),
--     AM VARCHAR(100),
--     Process VARCHAR(100),
--     TeamLeader VARCHAR(100),
--      CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     datewise DATE,
--     INDEX idx_datewise (datewise)
-- ) ENGINE=InnoDB;



-- CREATE TABLE sbi_recovery_paid (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     agent_code VARCHAR(50),
--     agent_name VARCHAR(100),
--     amount_collected DECIMAL(10,2),
--     account_number VARCHAR(50),
--     AM VARCHAR(100),
--     Process VARCHAR(100),
--     TeamLeader VARCHAR(100),
--      CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     datewise DATE,
--     INDEX idx_datewise (datewise)
-- ) ENGINE=InnoDB;









CREATE TABLE member (
    id INT AUTO_INCREMENT PRIMARY KEY,
    process_name VARCHAR(100),
    agent VARCHAR(100),
    target DECIMAL(10,2),
    agent_code VARCHAR(50),
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    datewise DATE
) ENGINE=InnoDB;
