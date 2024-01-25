const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});

async function connect_to_database () {
    try {
        await client.connect();
        console.log("Connected to database.");
    }
    catch (error) {
        console.error("Error connecting to database.");
        console.error(error);
    }
}

async function insert_thread (thread_id, author_id, model) {
    try {
        const query = {
            text: 'INSERT INTO threads(thread_id, author_id, model) VALUES($1, $2, $3)',
            values: [thread_id, author_id, model],
        }
        await client.query(query);
    } catch (error) {
        console.error("Error inserting thread into database.")
        console.error(error);
    }
}

async function fetch_thread (thread_id) {
    try {
        const query = {
            text: 'SELECT * FROM threads WHERE thread_id = $1',
            values: [thread_id],
        }
        const result = await client.query(query);
        if (result.rowCount == 0) return null;
        return result.rows[0];
    } catch (error) {
        console.error("Error fetching thread from database.")
        console.error(error);
    }
}

async function insert_message (thread_message_id, thread_id, author, content, role, tokens_used, created_at) {
    try {
        const query = {
            text: 'INSERT INTO messages(thread_message_id, thread_id, author, content, role, tokens_used, created_at) VALUES($1, $2, $3, $4, $5, $6, $7)',
            values: [thread_message_id, thread_id, author, content, role, tokens_used, created_at],
        }
        await client.query(query);
    } catch (error) {
        console.error("Error inserting message into database.")
        console.error(error);
    }
}

async function fetch_messages (thread_id) {
    try {
        const query = {
            text: 'SELECT * FROM messages WHERE thread_id = $1',
            values: [thread_id],
        }
        const result = await client.query(query);
        if (result.rowCount == 0) return null;
        return result.rows;
    } catch (error) {
        console.error("Error fetching messages from database.")
        console.error(error);
    }
}

async function fetch_consumption (thread_id) {
    try {
        const query = {
            text: 'SELECT SUM(tokens_used) FROM messages WHERE thread_id = $1',
            values: [thread_id],
        }
        const result = await client.query(query);
        if (result.rowCount == 0) return null;
        return result.rows[0];
    } catch (error) {
        console.error("Error fetching consumption from database.")
        console.error(error);
    }

}

module.exports = {
    connect_to_database,
    insert_thread,
    fetch_thread,
    insert_message,
    fetch_messages,
    fetch_consumption
}