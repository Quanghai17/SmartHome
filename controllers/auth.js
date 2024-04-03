const axios = require('axios');
const { parseError } = require('./error');
const { refeshtoken, callapi, callapiform } = require('./global');
const  LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');
const userobj = localStorage.getItem('userobj.json');
const tokename = Buffer.from("token").toString('base64').replace('=','');
const retokename = Buffer.from("refreshtoken").toString('base64').replace('=','');
const userobjname = Buffer.from("userobj").toString('base64').replace('=','');
const cookieOptions = {
    expires: new Date(
        Date.now() + 24 * 60 * 60 * 1000 //1day
    ),
    httpOnly: true,
}
const timetoken = {
    expires: new Date(
        Date.now() + 10 * 60 * 1000
    ),
    httpOnly: true,
}
exports.login = async(req, res) => {    
    let data = JSON.stringify({
        "username": req.body.Username,
        "password": req.body.Password
    });
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: process.env.URL_API + '/auth/login',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };
    axios.request(config)
        .then((response) => {
            var tokenObj = response.data.tokenObj
            var userdata = response.data.user
            var refreshToken = tokenObj.refreshToken;
            var token = tokenObj.token;
            var homes = '';
            if (response.data.homes) {
                homes = response.data.homes;
            }
            if (response.data.buildings) {
                homes = response.data.buildings;
            }
            res.cookie('lang', 'vi', { maxAge: 86400000 });
            const user = Buffer.from(JSON.stringify(userdata)).toString('base64');
            res.cookie(userobjname,JSON.stringify(userdata), cookieOptions);
            res.cookie(tokename, token, timetoken);;
           // res.cookie(tokename, token, timetoken);
           // res.cookie('refreshtoken', refreshToken, cookieOptions);
            res.cookie(retokename, refreshToken, cookieOptions);
            localStorage.setItem('userobj.json', JSON.stringify(userdata));
            localStorage.setItem('myhome.json', JSON.stringify(homes));
            res.status(200).redirect("/vmap");
        })
        .catch((error) => {
            const { code, message } = parseError(error)
            res.render("pages/login", {
                message: message
            });
        });
}
exports.register = (req, res, next) => {
    var mess = '';
    if (req.body.Password == req.body.cfPassword) {
        let data = JSON.stringify({
            "username": req.body.Username,
            "password": req.body.Password,
            "fullname": req.body.Name,
            "email": req.body.email,
            "phone": req.body.phone,
            "account_type": parseInt(req.body.type_account)
        });
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: process.env.URL_API + '/auth/register',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        axios.request(config)
            .then((response) => {
                res.status(200).redirect("/");
            })
            .catch((error) => {
                const { code, message } = parseError(error)
                res.render("pages/register", {
                    message: message
                });
            });
    } else {
        mess = 'Enter the same password';
        res.render("pages/register", {
            message: mess
        });
    }

}
exports.profile = async(req, res) => {
    const { Username, name, email, Phone, birthday, sex, oldpassword, password, cfpassword } = req.body
    console.log('Username-' + Username, 'name-' + name, 'email-' + email, 'Phone-' + Phone, 'birthday-' + birthday, 'sex-' + sex, 'oldpassword-' + oldpassword, 'password-' + password, 'cfpassword-' + cfpassword)

    if (req.cookies[tokename]) {
        var token = req.cookies[tokename]
    } else {
        var tokenrf = req.cookies[retokename];
        var token = await refeshtoken(tokenrf);
        res.cookie(tokename, token, timetoken);;
    }
    let data = JSON.stringify({
        "fullname": name,
        "email": email,
        "phone": Phone,
        "birthday": birthday,
        "sex": Boolean(parseInt(sex)),
    });
    console.log(Boolean(parseInt(sex)))

    let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: process.env.URL_API + '/auth/update_profile',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        data: data
    };

    axios.request(config)
        .then((response) => {
            const message = JSON.stringify(response.data.message);
            var userobja = JSON.parse(userobj);
            userobja.fullName = name;
            userobja.email = email;
            userobja.phoneNumber = Phone;
            userobja.birthday = birthday;
            userobja.sex = Boolean(sex);
            console.log(message);
            res.cookie('userobj', JSON.stringify(userobja), cookieOptions);
            let donedata = {
                "message": message,
                "status": 'success'
            };
            res.render("pages/profile", { userInfo: userobja, lang: req.cookies.lang, message: donedata });
        })
        .catch((error) => {
            const { code, message } = parseError(error)
            let donedata = {
                "message": message,
                "status": 'error'
            }
            res.render("pages/profile", { userInfo: JSON.parse(userobj), lang: req.cookies.lang, message: donedata });
        });
}
exports.logout = (req, res) => {
    res.cookie('refreshtoken', 'logout', {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.status(200).redirect("/");
}