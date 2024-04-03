const express = require("express");
const router = express.Router();
var i18n = require("i18n");
const authController = require("../controllers/auth.js");
const  LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');
const userobj = localStorage.getItem('userobj.json');
router.get("/register", function(req, res) {
    i18n.setLocale(req, 'vi');
    res.cookie('lang', 'vi', { maxAge: 900000 });
    res.render("pages/register", {
        message: '',
    });
    console.log('i18n module initialized. Default locale: ' + i18n.getLocale());
});
router.post("/register", authController.register);

router.get("/", function(req, res) {
    var lang = 'vi';
    res.cookie('lang', lang, { maxAge: 900000 });
    i18n.setLocale(req, lang);
    res.render("pages/login", {
        message: ''
    });
});
router.post("/", authController.login);
module.exports = router;