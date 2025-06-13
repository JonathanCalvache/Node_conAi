const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./sequelize');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Sincroniza el modelo con la base de datos
sequelize.sync();

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login', { 
    register: false, 
    error: null 
  });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username, password } });
    if (user) {
      res.redirect(`/profile/${user.id}`);
    } else {
      res.render('login', { register: false, error: 'Usuario o contraseña incorrectos' });
    }
  } catch (err) {
    res.render('login', { register: false, error: 'Error en la base de datos' });
  }
});

app.get('/register', (req, res) => {
  res.render('login', { 
    register: true, 
    error: null 
  });
});

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({ username, email, password });
    res.redirect(`/profile/${user.id}`);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.render('login', { register: true, error: 'El email ya está registrado' });
    }
    res.render('login', { register: true, error: 'Error en la base de datos' });
  }
});

app.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.render('profile', { user });
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    res.redirect('/login');
  }
});

app.get('/instituciones', (req, res) => {
  res.send('Página de Instituciones (por implementar)');
});
app.get('/historia', (req, res) => {
  res.send('Página de Historia (por implementar)');
});
app.get('/imagenes', (req, res) => {
  res.send('Página de Imágenes (por implementar)');
});
app.get('/quehacer', (req, res) => {
  res.send('Página de que hacer (por implementar)');
});
app.get('/ubicacion', (req, res) => {
  res.send('Página de Ubicación (por implementar)');
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});