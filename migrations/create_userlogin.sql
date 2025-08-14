

-- CREATE TABLE IF NOT EXISTS Ph_Users (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   ims_id VARCHAR(255) NOT NULL UNIQUE,
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
--   FOREIGN KEY (user_id) REFERENCES Ph_Users(id)
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





-- CREATE TABLE axis_card_paid (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     agent_code VARCHAR(50),
--     agent_name VARCHAR(100),
--     amount_collected DECIMAL(10,2),
--     account_number VARCHAR(50),
--     am VARCHAR(100),
--     process VARCHAR(100),
--     teamleader VARCHAR(100),
--     createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     datewise DATE,
--     INDEX idx_datewise (datewise)
-- ) ENGINE=InnoDB;






-- CREATE TABLE axis_loan_paid (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     agent_code VARCHAR(50),
--     agent_name VARCHAR(100),
--     amount_collected DECIMAL(10,2),
--     account_number VARCHAR(50),
--     am VARCHAR(100),
--     process VARCHAR(100),
--     teamleader VARCHAR(100),
--      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     datewise DATE,
--     INDEX idx_datewise (datewise)
-- ) ENGINE=InnoDB;






-- CREATE TABLE axis_npa_paid (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     agent_code VARCHAR(50),
--     agent_name VARCHAR(100),
--     amount_collected DECIMAL(10,2),
--     account_number VARCHAR(50),
--     am VARCHAR(100),
--     process VARCHAR(100),
--     teamleader VARCHAR(100),
--      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     datewise DATE,
--     INDEX idx_datewise (datewise)
-- ) ENGINE=InnoDB;



-- CREATE TABLE city_paid (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     agent_code VARCHAR(50),
--     agent_name VARCHAR(100),
--     amount_collected DECIMAL(10,2),
--     account_number VARCHAR(50),
--     am VARCHAR(100),
--     process VARCHAR(100),
--     teamleader VARCHAR(100),
--      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     datewise DATE,
--     INDEX idx_datewise (datewise)
-- ) ENGINE=InnoDB;








-- CREATE TABLE encore_paid (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     agent_code VARCHAR(50),
--     agent_name VARCHAR(100),
--     amount_collected DECIMAL(10,2),
--     account_number VARCHAR(50),
--     am VARCHAR(100),
--     process VARCHAR(100),
--     teamleader VARCHAR(100),
--      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     datewise DATE,
--     INDEX idx_datewise (datewise)
-- ) ENGINE=InnoDB;





-- CREATE TABLE iifl_paid (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     agent_code VARCHAR(50),
--     agent_name VARCHAR(100),
--     amount_collected DECIMAL(10,2),
--     account_number VARCHAR(50),
--     am VARCHAR(100),
--     process VARCHAR(100),
--     teamleader VARCHAR(100),
--      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     datewise DATE,
--     INDEX idx_datewise (datewise)
-- ) ENGINE=InnoDB;



-- CREATE TABLE sbi_recovery_paid (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     agent_code VARCHAR(50),
--     agent_name VARCHAR(100),
--     amount_collected DECIMAL(10,2),
--     account_number VARCHAR(50),
--     am VARCHAR(100),
--     process VARCHAR(100),
--     teamleader VARCHAR(100),
--      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     datewise DATE,
--     INDEX idx_datewise (datewise)
-- ) ENGINE=InnoDB;









-- -- CREATE TABLE member (
-- --     id INT AUTO_INCREMENT PRIMARY KEY,
-- --     process_name VARCHAR(100),
-- --     agent VARCHAR(100),
-- --     target DECIMAL(10,2),
-- --     agent_code VARCHAR(50),
-- --     CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
-- --     datewise DATE
-- -- ) ENGINE=InnoDB;













-- CREATE TABLE milestonedata (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     client_name VARCHAR(255),
--     product VARCHAR(255),
--     bucket VARCHAR(255),
--     ph VARCHAR(255),
--     aph VARCHAR(255),
--     allocation_count INT,
--     allocation_value_cr DECIMAL(10, 2),


--     milestones_8th DECIMAL(10, 2),
--     milestones_14th DECIMAL(10, 2),
--     milestones_21st DECIMAL(10, 2),
--     milestones_28th DECIMAL(10, 2),
--     achievement_8th DECIMAL(10, 2),
--     achievement_14th DECIMAL(10, 2),
--     achievement_21st DECIMAL(10, 2),
--     achievement_28th DECIMAL(10, 2),
--     achievement_percent_8th DECIMAL(10, 2),
--     achievement_percent_14th DECIMAL(10, 2),
--     achievement_percent_21st DECIMAL(10, 2),
--     achievement_percent_28th DECIMAL(10, 2),
--     sdlm_8th DECIMAL(10, 2),
--     sdlm_14th DECIMAL(10, 2),
--     sdlm_21st DECIMAL(10, 2),
--     sdlm_28th DECIMAL(10, 2),
--     sdbm_8th DECIMAL(10, 2),
--     sdbm_14th DECIMAL(10, 2),
--     sdbm_21st DECIMAL(10, 2),
--     sdbm_28th DECIMAL(10, 2),
--     datewise DATE,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     KEY idx_datewise (datewise)
-- );




-- CREATE TABLE milestonedata (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     client_name VARCHAR(255),
--     product VARCHAR(255),
--     bucket VARCHAR(255),
--     ph VARCHAR(255),
--     aph VARCHAR(255),
--     allocation_count VARCHAR(255),
--     allocation_value_cr VARCHAR(255),

--     milestone_8th VARCHAR(255),
--     milestone_14th VARCHAR(255),
--     milestone_21st VARCHAR(255),
--     milestone_28th VARCHAR(255),

--     achievement_8th VARCHAR(255),
--     achievement_14th VARCHAR(255),
--     achievement_21st VARCHAR(255),
--     achievement_28th VARCHAR(255),

--     achievement_percent_8th VARCHAR(255),
--     achievement_percent_14th VARCHAR(255),
--     achievement_percent_21st VARCHAR(255),
--     achievement_percent_28th VARCHAR(255),

--     sdlm_8th VARCHAR(255),
--     sdlm_14th VARCHAR(255),
--     sdlm_21st VARCHAR(255),
--     sdlm_28th VARCHAR(255),

--     sdbm_8th VARCHAR(255),
--     sdbm_14th VARCHAR(255),
--     sdbm_21st VARCHAR(255),
--     sdbm_28th VARCHAR(255),

--     datewise DATE,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     KEY idx_datewise (datewise)
-- );





-- CREATE TABLE milestonedata (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     client_name VARCHAR(255),
--     product VARCHAR(255),
--     bucket VARCHAR(255),
--     ph VARCHAR(255),
--     aph VARCHAR(255),
--     allocation_count VARCHAR(255),
--     allocation_value_cr VARCHAR(255),

--     milestones_8th VARCHAR(255),    -- Corrected: Added 's'
--     milestones_14th VARCHAR(255),   -- Corrected: Added 's'
--     milestones_21st VARCHAR(255),   -- Corrected: Added 's'
--     milestones_28th VARCHAR(255),   -- Corrected: Added 's'

--     achievement_8th VARCHAR(255),
--     achievement_14th VARCHAR(255),
--     achievement_21st VARCHAR(255),
--     achievement_28th VARCHAR(255),

--     achievement_percent_8th VARCHAR(255),
--     achievement_percent_14th VARCHAR(255),
--     achievement_percent_21st VARCHAR(255),
--     achievement_percent_28th VARCHAR(255),

--     sdlm_8th VARCHAR(255),
--     sdlm_14th VARCHAR(255),
--     sdlm_21st VARCHAR(255),
--     sdlm_28th VARCHAR(255),

--     sdbm_8th VARCHAR(255),
--     sdbm_14th VARCHAR(255),
--     sdbm_21st VARCHAR(255),
--     sdbm_28th VARCHAR(255),

--     datewise DATE,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     KEY idx_datewise (datewise)
-- );




-- CREATE TABLE milestone2 (
--     _id INT PRIMARY KEY AUTO_INCREMENT,
--     ims_id VARCHAR(255) NOT NULL,
--     client_name VARCHAR(255) NOT NULL,
--     product VARCHAR(255) NOT NULL,
--     bucket VARCHAR(255),
--     ph VARCHAR(255),
--     aph VARCHAR(255),
--     count_value INT,
--     value_in_cr DECIMAL(10, 2),
--     `8th` DECIMAL(10, 2),
--     `14th` DECIMAL(10, 2),
--     `21th` DECIMAL(10, 2),
--     `28th` DECIMAL(10, 2),

--     `8th_Achievement` DECIMAL(10,2),
--     `14th_Achievement` DECIMAL(10,2),
--     `21th_Achievement` DECIMAL(10,2),
--     `28th_Achievement` DECIMAL(10,2),

--     datewise DATE NOT NULL,
--     Create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     Update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

--     INDEX idx_client_product (client_name, product),
--     INDEX idx_datewise (datewise),
--     INDEX idx_client_product_date (client_name, product, datewise)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;






