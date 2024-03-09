import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import cookieSession  from 'cookie-session';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

import { notFoundError, errorHandler } from './middlewares/error-handler.js';

import OrdersRoutes from './routes/order.js'; //importer le router du fichier routes/game.js
import ProductsRoutes from './routes/Product.js'; 
import AuthRoutes from './routes/auth.js';
import CommandesRoutes from './routes/commande.js';
import RoleRoutes from './routes/Role.js';
import CategoryRoutes from './routes/category.js';



const app = express(); // creer l'instance de express a utiliser
const hostname = '127.0.0.1'; //l'@ du serveur
const port = process.env.PORT || 9090; //le port du serveur
const databaseName = 'Market';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Configurer le moteur de modèle
app.set('view engine', 'pug');

// Spécifier le répertoire des vues
app.set('views', path.join(__dirname, 'views'));
mongoose.set('debug', true);
mongoose.Promise = global.Promise;

mongoose
  .connect(`mongodb://127.0.0.1:27017/${databaseName}`)
  .then(() => {
    console.log(`Connected to ${databaseName}`);
  })
  .catch(err => {
    console.log(err);
  });



  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/img', express.static('public/images'));

  app.use(
    cookieSession({
      name: "projectPi-session",
      secret: process.env.SESSION_SECRET, // should use as secret environment variable
      httpOnly: true
    })
  );
  app.use(session({
    secret: process.env.SESSION_SECRET, // Utilisez une clé secrète solide
    resave: false,
    saveUninitialized: true,
  }));
  

app.use('/product', ProductsRoutes);
app.use('/commande', CommandesRoutes);
app.use('/order', OrdersRoutes);
app.use('/role', RoleRoutes);
app.use('/api', AuthRoutes);
app.use('/category', CategoryRoutes);


// app.post('/user/api', (req,res) => {
//   console.log(req.body);
//   res.redirect('http://localhost:4200/userpages/dashboard')
//   });
// app.post('/user/confirm-user/:userId', (req,res) => {
//  console.log(req.body);
//  res.redirect('http://localhost:4200/auth/login')
// });

  app.use(notFoundError);
  app.use(errorHandler);


app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

