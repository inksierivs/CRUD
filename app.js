const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// sql connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    database: 'lianne_crud',
    password: '',
});


// Get all users
app.get('/', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err; 
        console.log(`connected as id ${connection.threadId}`);

        // sql all user
        connection.query('SELECT * FROM users', (err, rows) => {
            connection.release(); 
            if (!err) {
                res.send(rows);
            } else {
                console.log(err);
            }
        });
    });
});


// Get user by id
app.get('/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log(`connected as id ${connection.threadId}`);

        // sql get specific user
        connection.query('SELECT * FROM users WHERE id = ?',[req.params.id], (err, rows) => {
            connection.release();

            if (!err) {
                res.send(rows);
            } else {
                console.log(err);
            }
        });
    });
});


// Insert
app.post('/', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log(`connected as id ${connection.threadId}`);

        // sql insert user
        const params = req.body; 

        connection.query('INSERT INTO users SET ?', params, (err, rows) => {
            connection.release();

            if (!err) {
                res.send(`User with name: ${params.firstname} has been added.`);
            } else {
                console.log(err);
                res.status(500).send('Failed to insert user.');
            }
        });
    });
});



// Update
app.put('/', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err; 
        console.log(`connected as id ${connection.threadId}`);

        // sql update user
        const { id, firstname, lastname, is_admin } = req.body; 

        connection.query(
            'UPDATE users SET firstname = ?, lastname = ?, is_admin = ? WHERE id = ?', 
            [firstname, lastname, is_admin, id], 
            (err, rows) => {
                connection.release(); 

                if (!err) {
                    res.send(`User with id: ${id} has been updated. Firstname: ${firstname}, Lastname: ${lastname}, is_admin: ${is_admin}`);
                } else {
                    console.log(err);
                    res.status(500).send('Failed to update user.');
                }
            }
        );
    });
});


// Delete by id
app.delete('/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err; 
        console.log(`connected as id ${connection.threadId}`);

        // sql delete user
        connection.query('DELETE FROM users WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release(); 

            if (!err) {
                res.send(`User with id: ${req.params.id} has been deleted.`);
            } else {
                console.log(err);
                res.status(500).send('Failed to delete user.');
            }
        });
    });
});


// Server start
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

