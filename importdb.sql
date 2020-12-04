
CREATE ROLE id_scanner_user WITH LOGIN PASSWORD 'idscanner';
/* GRANT ACCESS TO THIS USER TO THIS DB */
GRANT ALL PRIVILEGES ON DATABASE id_scanner_db TO id_scanner_user;

/** GOING INTO POSTGRE CLI
psql -h localhost -p 5432 -U postgres id_scanner_db -W 
- type password
*/

/**POSTGRES CLEAR SCREEN
- \! cls
*/


/* COPY START */
/* FUNCTIONS */
CREATE OR REPLACE FUNCTION pseudo_encrypt(VALUE bigint) returns bigint AS $$
DECLARE
    l1 bigint;
    l2 bigint;
    r1 bigint;
    r2 bigint;
    i  int:=0;
BEGIN
    l1:= (VALUE >> 32) & 4294967295::bigint;
    r1:= VALUE & 4294967295;
    WHILE i < 3 LOOP
        l2 := r1;
        r2 := l1 # ((((1366.0 * r1 + 150889) % 714025) / 714025.0) * 32767*32767)::int;
        l1 := l2;
        r1 := r2;
        i := i + 1;
    END LOOP;
RETURN ((l1::bigint << 32) + r1);
END;
$$ LANGUAGE plpgsql strict immutable;

/* Feistel Network RETURNS a string with max of 11 characters */
CREATE OR REPLACE FUNCTION stringify_bigint(n bigint) RETURNS text LANGUAGE plpgsql IMMUTABLE STRICT AS $$
DECLARE
    alphabet    text    := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    base        int     := length(alphabet);
    _n          bigint  := abs(n);
    output      text    := '';
BEGIN
    LOOP
        output := output || substr(alphabet, 1 + (_n % base)::int, 1);
        _n := _n / base;
        EXIT WHEN _n = 0;
    END LOOP;
    RETURN output;
END $$;

/* a: admin; o: organizer, c: checker */
CREATE TYPE user_access_enum AS ENUM ('a', 'o', 'c');

CREATE TABLE users (
    user_id     SERIAL              PRIMARY KEY,
    username    VARCHAR(30)         NOT NULL UNIQUE,
    password    VARCHAR(60)         NOT NULL,
    access      user_access_enum    NOT NULL DEFAULT 'c'
);

CREATE TABLE checker_users (
    user_id                         SERIAL          PRIMARY KEY,
    FOREIGN KEY(user_id)            REFERENCES      users(user_id),
    organizer_assigned              SERIAL          NOT NULL,
    FOREIGN KEY(organizer_assigned) REFERENCES      users(user_id)         
);

CREATE TABLE students (
    serial_id   VARCHAR(8)      PRIMARY KEY, /* students serial id number */
    student_id   INT            NOT NULL UNIQUE, /* students id number */
    fname       VARCHAR(30)     NOT NULL,
    lname       VARCHAR(30)     NOT NULL
);

CREATE SEQUENCE event_id_seq;
CREATE OR REPLACE FUNCTION event_id() RETURNS text LANGUAGE plpgsql IMMUTABLE STRICT AS $$
BEGIN
    RETURN stringify_bigint(pseudo_encrypt(nextval('event_id_seq')));
END $$;
CREATE TABLE events (
    event_id                    VARCHAR(11)     PRIMARY KEY,
    event_name                  VARCHAR(30)     NOT NULL,
    start_date                  DATE            NOT NULL,
    end_date                    DATE            NOT NULL,
    event_org                   VARCHAR(10)     NOT NULL, /* organization */
    organizer_id                INT             NOT NULL,
    FOREIGN KEY(organizer_id)   REFERENCES      users(user_id)
);

CREATE TABLE attendances (
    id                          SERIAL          PRIMARY KEY,
    student_id                  VARCHAR(8)      NOT NULL,
    FOREIGN KEY(student_id)     REFERENCES      students(serial_id),
    event_id                    VARCHAR(11)     NOT NULL,
    FOREIGN KEY(event_id)       REFERENCES      events(event_id),
    UNIQUE(student_id, event_id),
    enter_timestamp             TIMESTAMP       NOT NULL DEFAULT now(),
    exit_timestamp              TIMESTAMP
);

CREATE TABLE assignments (
    id                      SERIAL          PRIMARY KEY,
    user_id                 INT             NOT NULL, /* organizer can also be a checker */
    FOREIGN KEY(user_id)    REFERENCES      users(user_id),
    event_id                VARCHAR(11)     NOT NULL,
    FOREIGN KEY(event_id)   REFERENCES      events(event_id),
    UNIQUE(user_id, event_id)
);


/* Adding data */
INSERT INTO users(username, password, access)
    VALUES('admin', '$2b$10$wg0EY2F9mFTKVvzfXS5Z6e35tEAoep/t5h2ospgOslyrkuIv5MPra', 'a'); /* admin_password */

INSERT INTO users(username, password, access)
    VALUES('organizer', '$2b$10$JCuk1atD3dvuft2d7SWzF.1EwfjDr68EZPNunwcF9U/pih98OIcA6', 'o'); /* password */

INSERT INTO users(username, password, access)
    VALUES('checker', '$2b$10$JCuk1atD3dvuft2d7SWzF.1EwfjDr68EZPNunwcF9U/pih98OIcA6', 'c'); /* password */

INSERT INTO events(event_id, event_name, start_date, end_date, event_org, organizer_id)
    VALUES(event_id(), 'Sample', now(), now(), 'LSCS', 2); /* change id to organizer */

INSERT INTO checker_users(user_id, organizer_assigned) VALUES
    (3, 2); /* change the event_id */

INSERT INTO students(serial_id, student_id, fname, lname)
    VALUES('f6709bcf', '11828366', 'Gerald', 'Dalan');
