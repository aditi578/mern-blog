const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');

mongoose.set('strictQuery', false);

const User = require('./models/User');
const Post = require('./models/Post');

const app = express();
const salt = bcrypt.genSaltSync(10);
const secret = 'asdfe45we45w345wegw345werjktjwertkj';

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect('mongodb+srv://aditirathore1601:UnM0rIptknYm0kuP@cluster0.xbqbx1c.mongodb.net/?retryWrites=true&w=majority');

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
      // User not found
      return res.status(400).json('User not found');
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      // Password is correct, generate and send token
      jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
        if (err) throw err;
        res.cookie('token', token).json({
          id: userDoc._id,
          username,
        });
      });
    } else {
      // Incorrect password
      res.status(400).json('Wrong credentials');
    }
  } catch (e) {
    console.log(e);
    res.status(500).json('Internal server error');
  }
});

app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  try {
    const info = jwt.verify(token, secret);
    res.json(info);
  } catch (err) {
    console.log(err);
    res.status(401).json('Unauthorized');
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('token').json('Logged out');
});

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
  if (!req.file) {
    // No file uploaded
    return res.status(400).json('No file uploaded');
  }

  const { originalname, path } = req.file;
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = path + '.' + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  try {
    const info = jwt.verify(token, secret);
    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });
    res.json(postDoc);
  } catch (err) {
    console.log(err);
    res.status(500).json('Internal server error');
  }
});

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  try {
    const info = jwt.verify(token, secret);
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json('You are not the author');
    }
    await postDoc.update({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    });

    res.json(postDoc);
  } catch (err) {
    console.log(err);
    res.status(500).json('Internal server error');
  }
});

app.get('/post', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', ['username'])
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json('Internal server error');
  }
});

app.get('/post/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
  } catch (err) {
    console.log(err);
    res.status(500).json('Internal server error');
  }
});

app.listen(4000, () => {
  console.log('Server started on port 4000');
});

