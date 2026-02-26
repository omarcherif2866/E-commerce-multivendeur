// import express from 'express';
// import mongoose from 'mongoose';
// import morgan from 'morgan';
// import cors from 'cors';
// import cookieSession  from 'cookie-session';
// import session from 'express-session';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// import { config as dotenvConfig } from 'dotenv';
// dotenvConfig();

// import { notFoundError, errorHandler } from './middlewares/error-handler.js';

// import OrdersRoutes from './routes/order.js'; //importer le router du fichier routes/game.js
// import ProductsRoutes from './routes/Product.js'; 
// import AuthRoutes from './routes/auth.js';
// import CommandesRoutes from './routes/commande.js';
// import RoleRoutes from './routes/Role.js';
// import CategoryRoutes from './routes/category.js';



// const app = express(); // creer l'instance de express a utiliser
// const hostname = '127.0.0.1'; //l'@ du serveur
// const port = process.env.PORT || 9090; //le port du serveur
// const databaseName = 'Market';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// // Configurer le moteur de modèle
// app.set('view engine', 'pug');

// // Spécifier le répertoire des vues
// app.set('views', path.join(__dirname, 'views'));
// mongoose.set('debug', true);
// mongoose.Promise = global.Promise;

// mongoose
//   .connect(`mongodb://127.0.0.1:27017/${databaseName}`)
//   .then(() => {
//     console.log(`Connected to ${databaseName}`);
//   })
//   .catch(err => {
//     console.log(err);
//   });



//   app.use(cors());
//   app.use(morgan('dev'));
//   app.use(express.json());
//   app.use(express.urlencoded({ extended: true }));
//   app.use('/img', express.static('public/images'));

//   app.use(
//     cookieSession({
//       name: "projectPi-session",
//       secret: process.env.SESSION_SECRET, // should use as secret environment variable
//       httpOnly: true
//     })
//   );
//   app.use(session({
//     secret: process.env.SESSION_SECRET, // Utilisez une clé secrète solide
//     resave: false,
//     saveUninitialized: true,
//   }));
  

// app.use('/product', ProductsRoutes);
// app.use('/commande', CommandesRoutes);
// app.use('/order', OrdersRoutes);
// app.use('/role', RoleRoutes);
// app.use('/api', AuthRoutes);
// app.use('/category', CategoryRoutes);


// // app.post('/user/api', (req,res) => {
// //   console.log(req.body);
// //   res.redirect('http://localhost:4200/userpages/dashboard')
// //   });
// // app.post('/user/confirm-user/:userId', (req,res) => {
// //  console.log(req.body);
// //  res.redirect('http://localhost:4200/auth/login')
// // });

//   app.use(notFoundError);
//   app.use(errorHandler);


// app.listen(port, hostname, () => {
//     console.log(`Server running at http://${hostname}:${port}/`);
// });
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import cookieSession from 'cookie-session';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

import { notFoundError, errorHandler } from './Middelware/error-handler.js';
import AuthRoutes from './routes/auth.js';
import UsersRoutes from './routes/user.js';
import RoleRoutes from './routes/Role.js';
import reclamation_route from './routes/reclamation.js';
import reclamation_type_route from './routes/type_reclamation.js';
import PlatsRoutes from './routes/Plats.js';
import IngredientsRoutes from './routes/Ingredients.js';
import SpecialitesRoutes from './routes/Specialite.js';
import EventRoutes from './routes/evenement_route.js';
import ParticipantRoutes from './routes/participant_route.js';
import VoteRoutes from './routes/vote_route.js';
import ReducUserRoutes from './routes/reducUser_route.js';
import CommandeRoutes from './routes/Commande.js';

const app = express();
const port = process.env.PORT || 9090;
const FRONTEND_URL = 'ecommercemultivendeur.vercel.app';


// =======================
// ✅ MONGODB
// =======================

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI is not defined");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false,
    }).then((mongoose) => {
      console.log("✅ MongoDB Connected");
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

await connectDB();


// =======================
// ✅ CORS CONFIG (IMPORTANT)
// =======================
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", FRONTEND_URL);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});


// =======================
// ✅ MIDDLEWARES
// =======================
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/img', express.static('public/images'));


// =======================
// ✅ COOKIE SESSION (PRODUCTION READY)
// =======================
app.use(cookieSession({
  name: "projectPi-session",
  secret: process.env.COOKIE_SECRET || "fallback_secret",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",   // 🔥 obligatoire HTTPS
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
}));


// =======================
// ✅ ROUTES
// =======================
app.use('/product', ProductsRoutes);
app.use('/commande', CommandesRoutes);
app.use('/order', OrdersRoutes);
app.use('/role', RoleRoutes);
app.use('/api', AuthRoutes);
app.use('/category', CategoryRoutes);


// =======================
// ✅ REDIRECTS
// =======================
app.post('/user/api', (req, res) => {
  res.redirect(`${FRONTEND_URL}/userpages/dashboard`);
});

app.post('/user/confirm-user/:userId', (req, res) => {
  res.redirect(`${FRONTEND_URL}/auth/login`);
});


// =======================
// ✅ ERROR HANDLERS
// =======================
app.use(notFoundError);
app.use(errorHandler);


// =======================
// ✅ LOCAL LISTEN
// =======================
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
}

export default app;
