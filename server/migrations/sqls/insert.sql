INSERT INTO users(username, password, access)
    VALUES('admin', '$2b$10$wg0EY2F9mFTKVvzfXS5Z6e35tEAoep/t5h2ospgOslyrkuIv5MPra', 'a'); /* admin_password */

INSERT INTO users(username, password, access)
    VALUES('organizer', '$2b$10$JCuk1atD3dvuft2d7SWzF.1EwfjDr68EZPNunwcF9U/pih98OIcA6', 'o'); /* password */

INSERT INTO users(username, password, access)
    VALUES('checker', '$2b$10$JCuk1atD3dvuft2d7SWzF.1EwfjDr68EZPNunwcF9U/pih98OIcA6', 'c'); /* password */

INSERT INTO users(username, password, access)
    VALUES('checker2', '$2b$10$JCuk1atD3dvuft2d7SWzF.1EwfjDr68EZPNunwcF9U/pih98OIcA6', 'c'); /* password */

INSERT INTO events(event_id, event_name, start_date, end_date, event_org, organizer_id)
    VALUES(event_id(), 'Sample', now(), now(), 'LSCS', 2); /* change id to organizer */

INSERT INTO assignments(user_id, event_id) VALUES
    (2, 'PC8ywoFF9Ne'),
    (3, 'PC8ywoFF9Ne'); /* change the event_id */

INSERT INTO students(serial_id, student_id, fname, lname)
    VALUES('f6709bcf', 11827211, 'Gerald', 'Dalan');

INSERT INTO attendances(student_id, event_id) VALUES
    ('f6709bcf', 'PC8ywoFF9Ne');

INSERT INTO checker_users(user_id, organizer_assigned)
    VALUES(3,2);



