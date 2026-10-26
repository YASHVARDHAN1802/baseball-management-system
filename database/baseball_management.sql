-- =====================================================================
-- 1. DATABASE SETUP
-- =====================================================================
SET FOREIGN_KEY_CHECKS = 0; -- Temporarily disable checks to safely rebuild
DROP DATABASE IF EXISTS baseball_management;
CREATE DATABASE baseball_management;
USE baseball_management;
SET FOREIGN_KEY_CHECKS = 1; -- Re-enable checks

-- =====================================================================
-- 2. CORE SYSTEM TABLES
-- =====================================================================

-- STADIUMS Table
CREATE TABLE stadiums (
    stadium_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    capacity INT DEFAULT NULL,
    surface_type VARCHAR(50) DEFAULT 'Natural Grass'
);

-- TEAMS Table
CREATE TABLE teams (
    team_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    abbreviation VARCHAR(10) NOT NULL UNIQUE,
    city VARCHAR(100) NOT NULL,
    league ENUM('AL', 'NL') NOT NULL,
    division ENUM('East', 'Central', 'West') NOT NULL,
    stadium_id INT DEFAULT NULL,
    manager_name VARCHAR(100) DEFAULT NULL,
    founded_year INT DEFAULT NULL,
    world_series_wins INT DEFAULT 0,
    FOREIGN KEY (stadium_id) REFERENCES stadiums(stadium_id) ON DELETE SET NULL
);

-- PLAYERS Table
CREATE TABLE players (
    player_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE DEFAULT NULL,
    nationality VARCHAR(50) DEFAULT 'American',
    position ENUM('P','C','1B','2B','3B','SS','LF','CF','RF','DH') NOT NULL,
    jersey_number INT DEFAULT NULL,
    team_id INT DEFAULT NULL,
    bats ENUM('R', 'L', 'S') DEFAULT 'R',
    throws ENUM('R', 'L') DEFAULT 'R',
    height_cm INT DEFAULT NULL,
    weight_kg INT DEFAULT NULL,
    status ENUM('active', 'injured', 'inactive', 'retired') DEFAULT 'active',
    debut_date DATE DEFAULT NULL,
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE SET NULL
);

-- GAMES Table
CREATE TABLE games (
    game_id INT AUTO_INCREMENT PRIMARY KEY,
    home_team_id INT NOT NULL,
    away_team_id INT NOT NULL,
    game_date DATETIME NOT NULL,
    home_score INT DEFAULT 0,
    away_score INT DEFAULT 0,
    attendance INT DEFAULT NULL,
    status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
    FOREIGN KEY (home_team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
    FOREIGN KEY (away_team_id) REFERENCES teams(team_id) ON DELETE CASCADE
);

-- =====================================================================
-- 3. SECONDARY TABLES (REQUIRED BY YOUR CONTROLLERS)
-- =====================================================================

-- USERS Table (Needed for AuthController login authentication)
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'viewer') DEFAULT 'viewer',
    is_active TINYINT(1) DEFAULT 1,
    last_login DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PLAYER STATISTICS Table (Required by getPlayerById)
CREATE TABLE player_statistics (
    stat_id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT NOT NULL,
    season_year INT NOT NULL,
    games_played INT DEFAULT 0,
    batting_average DECIMAL(4,3) DEFAULT 0.000,
    home_runs INT DEFAULT 0,
    runs_batted_in INT DEFAULT 0,
    earned_run_average DECIMAL(4,2) DEFAULT 0.00,
    strikeouts INT DEFAULT 0,
    FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE
);

-- INJURIES Table (Required by getPlayerById)
CREATE TABLE injuries (
    injury_id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT NOT NULL,
    injury_type VARCHAR(100) NOT NULL,
    injury_date DATE NOT NULL,
    expected_recovery_date DATE DEFAULT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE
);

-- CONTRACTS Table (Required by getPlayerById)
CREATE TABLE contracts (
    contract_id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT NOT NULL,
    team_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    salary DECIMAL(15,2) NOT NULL,
    FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE
);

-- =====================================================================
-- 4. VIEWS
-- =====================================================================
CREATE OR REPLACE VIEW vw_game_schedule AS
SELECT 
    g.game_id, 
    g.game_date, 
    g.home_score,
    g.away_score,
    g.attendance,
    ht.name AS home_team, 
    at.name AS away_team, 
    g.status
FROM games g
JOIN teams ht ON g.home_team_id = ht.team_id
JOIN teams at ON g.away_team_id = at.team_id;

-- =====================================================================
-- 5. STORED PROCEDURES (REQUIRED BY CONTROLLER LOGIC)
-- =====================================================================
DELIMITER $$

-- Procedure to safely update game results
CREATE PROCEDURE sp_record_game_result(
    IN p_game_id INT,
    IN p_home_score INT,
    IN p_away_score INT,
    IN p_attendance INT
)
BEGIN
    UPDATE games 
    SET home_score = p_home_score,
        away_score = p_away_score,
        attendance = p_attendance,
        status = 'completed'
    WHERE game_id = p_game_id;
END$$

-- Procedure to handle direct player transfers
CREATE PROCEDURE sp_transfer_player(
    IN p_player_id INT,
    IN p_from_team_id INT,
    IN p_to_team_id INT,
    IN p_transfer_type VARCHAR(50),
    IN p_transfer_fee DECIMAL(15,2),
    IN p_notes TEXT
)
BEGIN
    UPDATE players 
    SET team_id = p_to_team_id 
    WHERE player_id = p_player_id;
END$$

-- Procedure to calculate career statistics metrics
CREATE PROCEDURE sp_get_player_career_stats(
    IN p_player_id INT
)
BEGIN
    SELECT 
        player_id,
        SUM(games_played) AS total_games,
        AVG(batting_average) AS career_batting_avg,
        SUM(home_runs) AS total_home_runs,
        SUM(runs_batted_in) AS total_rbi,
        AVG(earned_run_average) AS career_era,
        SUM(strikeouts) AS total_strikeouts
    FROM player_statistics
    WHERE player_id = p_player_id
    GROUP BY player_id;
END$$

DELIMITER ;

-- =====================================================================
-- 6. DATA INITIALIZATION (SEED VALUES)
-- =====================================================================

-- Seed Stadiums
INSERT INTO stadiums (stadium_id, name, city, capacity, surface_type) VALUES 
(1, 'Yankee Stadium', 'New York', 54251, 'Natural Grass'),
(2, 'Fenway Park', 'Boston', 37755, 'Natural Grass');

-- Seed Teams
INSERT INTO teams (team_id, name, abbreviation, city, league, division, stadium_id, manager_name, founded_year, world_series_wins) VALUES 
(1, 'Yankees', 'NYY', 'New York', 'AL', 'East', 1, 'Aaron Boone', 1903, 27),
(2, 'Red Sox', 'BOS', 'Boston', 'AL', 'East', 2, 'Alex Cora', 1901, 9);

-- Seed Players
INSERT INTO players (player_id, first_name, last_name, date_of_birth, nationality, position, jersey_number, team_id, bats, throws, height_cm, weight_kg, status, debut_date) VALUES 
(1, 'Aaron', 'Judge', '1992-04-26', 'American', 'CF', 99, 1, 'R', 'R', 201, 128, 'active', '2016-08-13'),
(2, 'Rafael', 'Devers', '1996-10-24', 'Dominican', '3B', 11, 2, 'L', 'R', 183, 108, 'active', '2017-07-25');

-- Seed Users (Password hash below corresponds plain text: admin123)
INSERT INTO users (username, email, password_hash, role) VALUES 
('admin', 'admin@baseball.com', '$2a$10$wE0Kj7O2K.W4XN2.8A7vqu7rR3g3wHmWb6b6P2eN1v6.YV6E2qL92', 'admin');

-- Seed Player Statistics
INSERT INTO player_statistics (player_id, season_year, games_played, batting_average, home_runs, runs_batted_in) VALUES 
(1, 2024, 158, 0.322, 58, 144),
(2, 2024, 138, 0.272, 28, 83);

-- Seed Games
INSERT INTO games (home_team_id, away_team_id, game_date, status) VALUES 
(1, 2, '2026-06-01 19:05:00', 'scheduled');


