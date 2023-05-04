const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const expressSanitizer = require('express-sanitizer');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(expressSanitizer());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    next();
});

const port = process.env.PORT || 3001;

// create a connection pool to the database
const db = mysql.createConnection({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

function getUserIdFromToken(req) {
    console.log("Log check token: ", req.headers.authorization);

    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return decoded.userId;
}

// Connect to the database
db.connect((error) => {
    if (error) {
        console.error('Error connecting to database: ' + error.stack);
        return;
    }
    console.log('Connected to database.');
});

app.get('/entries', (req, res) => {
    const sql = 'SELECT * FROM entries';
    db.query(sql, (err, results) => {
        if (err) {
            console.log('Error getting entries:', err);
            res.status(500).send('Error getting entries from database');
            return;
        }
        res.json(results);
    });
});

app.get('/entries/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM entries WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.log(`Error getting entry with id ${id}:`, err);
            res.status(500).send(`Error getting entry with id ${id} from database`);
            return;
        }
        if (results.length === 0) {
            res.status(404).send(`Entry with id ${id} not found`);
            return;
        }
        res.json(results[0]);
    });
});

app.post('/entries', (req, res) => {
    const { description, isExpense, value } = req.body;
    const id = uuid.v4();
    const sql = 'INSERT INTO entries (id, description, isExpense, value) VALUES (?, ?, ?, ?)';
    connection.query(sql, [id, description, isExpense, value], (err, results) => {
        if (err) {
            console.log('Error creating entry:', err);
            res.status(500).send('Error creating entry in database');
            return;
        }
        res.status(201).send('Entry created successfully');
    });
});

app.put('/entries/:id', (req, res) => {
    const id = req.params.id;
    const { description, isExpense, value } = req.body;
    const sql = 'UPDATE entries SET description = ?, isExpense = ?, value = ? WHERE id = ?';
    db.query(sql, [description, isExpense, value, id], (err, results) => {
        if (err) {
            console.log(`Error updating entry with id ${id}:`, err);
            res.status(500).send(`Error updating entry with id ${id} in database`);
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).send(`Entry with id ${id} not found`);
            return;
        }
        res.send('Entry updated successfully');
    });
});

app.delete('/entries/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM entries WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.log(`Error deleting entry with id ${id}:`, err);
            res.status(500).send(`Error deleting entry with id ${id} from database`);
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).send(`Entry with id ${id} not found`);
            return;
        }
        res.send('Entry deleted successfully');
    });
});

app.get('/values', (req, res) => {
    db.query('SELECT * FROM entries', (err, results) => {
        if (err) {
            console.log('Error retrieving values:', err);
            res.status(500).send('Error retrieving values');
        } else {
            res.send(results);
        }
    });
});

app.post('/values', (req, res) => {
    const { isExpense, value } = req.body;
    const id = uuidv4();
    const query = `INSERT INTO entries (id, isExpense, value) VALUES ("${id}", ${isExpense}, ${value})`;
    db.query(query, (err, result) => {
        if (err) {
            console.log('Error creating value:', err);
            res.status(500).send('Error creating value');
        } else {
            res.send({ id, isExpense, value });
        }
    });
});

app.put('/values/:id', (req, res) => {
    const { id } = req.params;
    const { isExpense, value } = req.body;
    const query = `UPDATE entries SET isExpense=${isExpense}, value=${value} WHERE id="${id}"`;
    db.query(query, (err, result) => {
        if (err) {
            console.log('Error updating value:', err);
            res.status(500).send('Error updating value');
        } else {
            res.send({ id, isExpense, value });
        }
    });
});

app.delete('/values/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM entries WHERE id="${id}"`;
    db.query(query, (err, result) => {
        if (err) throw err;
        res.send({ id });
    });
});

app.delete('/values/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM entries WHERE id="${id}"`;
    db.query(query, (err, result) => {
        if (err) {
            console.log('Error deleting value:', err);
            res.status(500).send('Error deleting value');
        } else {
            res.send(`Value with id ${id} deleted`);
        }
    });
});

// start the server
app.listen(port, () => {
    console.log('Server listening on port 3001');
});
