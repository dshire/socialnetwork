DROP TABLE IF EXISTS friends;

CREATE TABLE friends(
    id SERIAL PRIMARY KEY,
    send_id INTEGER NOT NULL,
    rec_id INTEGER NOT NULL,
    status INTEGER NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


const ACCEPTED = 1, PENDING = 2, CANCELED = 3, TERMINATED = 4, REJECTED = 5;
