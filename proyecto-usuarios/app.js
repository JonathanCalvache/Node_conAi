const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database');

const app = express();

// Configuración
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Por esta:
app.get('/login', (req, res) => {
  res.render('login', { 
    register: false, 
    error: null 
  });
});



app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  db.query(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, results) => {
      if (err) throw err;
      
      if (results.length > 0) {
        res.redirect(`/profile/${results[0].id}`);
      } else {
        res.render('login', { error: 'Usuario o contraseña incorrectos' });
      }
    }
  );
});

// Por esta (más completa):
app.get('/register', (req, res) => {
  res.render('login', { 
    register: true, 
    error: null 
  });
});

app.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  
  db.query(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, password],
    (err, results) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.render('login', { 
            register: true, 
            error: 'El email ya está registrado' 
          });
        }
        throw err;
      }
      
      res.redirect(`/profile/${results.insertId}`);
    }
  );
});

app.get('/profile/:id', (req, res) => {
  const userId = req.params.id;
  
  db.query(
    'SELECT * FROM users WHERE id = ?',
    [userId],
    (err, results) => {
      if (err) throw err;
      
      if (results.length > 0) {
        res.render('profile', { user: results[0] });
      } else {
        res.redirect('/login');
      }
    }
  );
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});