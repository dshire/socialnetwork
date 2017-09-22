DROP TABLE IF EXISTS chats;

CREATE TABLE chats(
    id SERIAL PRIMARY KEY,
    chat_id VARCHAR(100),
    send_id INTEGER NOT NULL,
    rec_id INTEGER,
    chat_name VARCHAR(50),
    message VARCHAR(500),
    date VARCHAR(30)
);
