require('dotenv').config()
const express = require('express');
PORT = process.env.PORT || 8000;
const path = require('path')
const app = express();




const session = require('express-session')
const flash = require('connect-flash')
const nocache = require("nocache");
const connectWithDB = require('./database/dbConnection');

const userRoutes = require('./routes/userRoutes')
const adminRoutes = require('./routes/adminRoutes')



// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static('public'))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(session({
    secret: 'secret',
    cookie: { maxAge: 60000 * 60 },
    resave: true,
    saveUninitialized: true
}))
app.use(express.json());
app.use(flash());
app.use(nocache());


// Routes   


app.use('/', userRoutes);
app.use('/admin', adminRoutes);

// app.all('*', (req, res, next) => {
//     // res.render('error404')
//     const err = new Error()
//     err.message = "No routes"
//     err.status = 404
//     next(err)

// })

// app.use((err, req, res, next) => {
//     // res.send(err)
//     const adminOrUser = req.originalUrl.split('/')[1]
//     if (adminOrUser == "admin") {
//         res.render('error', { admin: true })
//     } else {
//         res.render('error', { admin: false })
//     }
//     // console.log(adminOrUser);
//     // console.log(err);

// })





connectWithDB(process.env.MONGO_URI)
app.listen(PORT, () => { console.log(`Listening to port ${PORT}  http://localhost:${PORT}/`) })