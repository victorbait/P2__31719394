import express from 'express';
import path from 'path'; 
import contactRoutes from './routes/contact';
import adminRoutes from './routes/admin';
import paymentRoutes from './routes/payment';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import { configurePassport } from './config/passport';

dotenv.config();
const app = express(); 
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'unsecretofuerteyseguro123!',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000
  },
  name: 'sessionId',
  rolling: true
}));

configurePassport();
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs'); 
app.set('views', './views'); 
app.use(express.static('public'));

app.use((req, res, next) => {
    res.locals.meta = {
        title: 'Peluquería a Domicilio',
        description: 'Servicios de estílistica profesional en la comodidad de tu hogar.',
        image: `${req.protocol}://${req.get('host')}/img/peluqueria-domicilio.jpg`,
        url: `${req.protocol}://${req.get('host')}${req.originalUrl}`
    };
    next();
});

app.use(express.json());

app.get('/', (req, res) => {
    res.locals.meta.title = 'Inicio | Peluquería a Domicilio';
    res.locals.meta.description = 'Bienvenido a nuestros servicios de peluquería y estilismo profesional a domicilio. Calidad y comodidad sin salir de casa.';
    res.render('index', { meta: res.locals.meta });
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/admin/login?error=Error en autenticación con Google' }),
  (req, res) => {
    (req.session as any).isAdmin = true;
    (req.session as any).adminUsername = (req.user as any)?.display_name || (req.user as any)?.username;
    res.redirect('/admin/dashboard');
  }
);

app.use('/', contactRoutes);
app.use('/admin', adminRoutes);
app.use('/payment', paymentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
}); 