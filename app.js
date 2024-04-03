const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT;
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false, limit: '25mb' }))
app.use(bodyParser.json())
const cookieParser = require("cookie-parser");
app.use(cookieParser())
    // tranlator
var i18n = require("i18n");
i18n.configure({
    locales: ['en', 'vi'],
    directory: __dirname + '/locales',
    cookie: 'lang',
    defaultLocale: 'vi',
});

app.use(i18n.init);
app.use('/change-lang/:lang', (req, res) => {
    res.cookie('lang', req.params.lang, { maxAge: 900000 });
    res.redirect('back');
});
// template view engine
app.set("view engine", "ejs");

// Serve Static Files
app.use(express.static("public"));
app.use(express.json({ limit: '25mb' }));

//routes
const indexRouter = require('./routes/index');
const authen = require("./routes/authen");
app.use("/", authen);
app.use('/', indexRouter);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});