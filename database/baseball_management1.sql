USE baseball_management;

-- ==========================================
-- 1. POPULATE COMPLETED AND HISTORICAL GAMES
-- ==========================================
INSERT INTO games (home_team_id, away_team_id, game_date, home_score, away_score, attendance, status) VALUES 
(1, 2, '2026-05-10 13:05:00', 5, 3, 47312, 'completed'),
(2, 1, '2026-05-12 19:10:00', 2, 6, 36104, 'completed');


-- ==========================================
-- 2. SEED EXTRA PLAYERS WITH MIXED STATUSES
-- ==========================================
INSERT INTO players (player_id, first_name, last_name, date_of_birth, nationality, position, jersey_number, team_id, bats, throws, height_cm, weight_kg, status, debut_date) VALUES 
(3, 'Gerrit', 'Cole', '1990-09-08', 'American', 'P', 45, 1, 'R', 'R', 193, 100, 'injured', '2013-06-11'),
(4, 'Juan', 'Soto', '1998-10-25', 'Dominican', 'RF', 22, 1, 'L', 'L', 188, 101, 'active', '2018-05-20');


-- ==========================================
-- 3. EXPAND PLAYER STATISTICS FOR GRID VIEWS
-- ==========================================
INSERT INTO player_statistics (player_id, season_year, games_played, batting_average, home_runs, runs_batted_in, earned_run_average, strikeouts) VALUES 
(3, 2024, 17, 0.000, 0, 0, 3.41, 99),
(4, 2024, 157, 0.288, 41, 109, 0.00, 0);


-- ==========================================
-- 4. ATTACH THE MISSING SYSTEM CONTRACT DETAILS
-- ==========================================
INSERT INTO contracts (player_id, team_id, start_date, end_date, salary) VALUES 
(1, 1, '2023-01-01', '2031-12-31', 40000000.00),
(2, 2, '2024-01-01', '2034-12-31', 31350000.00),
(3, 1, '2020-01-01', '2028-12-31', 36000000.00),
(4, 1, '2024-01-01', '2024-12-31', 31000000.00);


-- ==========================================
-- 5. ATTACH EXPLICIT TRACKED MEDICAL INJURIES
-- ==========================================
INSERT INTO injuries (player_id, injury_type, injury_date, expected_recovery_date, status) VALUES 
(3, 'Right Elbow Inflammation', '2026-03-15', '2026-06-01', 'Active');