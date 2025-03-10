CREATE DATABASE IF NOT EXISTS finance_db;
USE finance_db;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

CREATE TABLE transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    action VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO roles (name) VALUES ('ROLE_USER'), ('ROLE_ADMIN');

INSERT INTO users (username, email, password, created_at) VALUES
('testuser', 'testuser@example.com', '$2a$10$zJvQhLXYPqKxqv/QgE/nYOSNMQ1Yp5k6aEmHcGIVXBnPfD9EZ4pZ6', NOW()),
('admin', 'admin@example.com', '$2a$10$jhiChWei0P8QH18hUY2tO.VNrvMgIwYAEkPiHEPqyxlu75kaJo65y', NOW());

INSERT INTO user_roles (user_id, role_id)  
VALUES 
((SELECT id FROM users WHERE username = 'testuser'), (SELECT id FROM roles WHERE name = 'ROLE_USER')),
((SELECT id FROM users WHERE username = 'admin'), (SELECT id FROM roles WHERE name = 'ROLE_ADMIN'));


INSERT INTO transactions (user_id, amount, category) VALUES
((SELECT id FROM users WHERE username = 'testuser'), 100.50, 'Food'),
((SELECT id FROM users WHERE username = 'testuser'), 50.00, 'Transport'),
((SELECT id FROM users WHERE username = 'admin'), 200.00, 'Shopping');
