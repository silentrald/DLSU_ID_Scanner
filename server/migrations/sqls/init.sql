CREATE DATABASE id_scanner_db;
CREATE ROLE id_scanner_user WITH LOGIN PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE id_scanner_db TO id_scanner_user;

/* psql -h localhost -p 5432 -U id_scanner_user -W -d id_scanner_db */

/**POSTGRES CLEAR SCREEN
- \! cls
*/