const { refeshtoken, callapi, callapiform } = require('./global');
const { parseError } = require('./error');
const axios = require('axios');
const  LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');
const userobj = localStorage.getItem('userobj.json');
const timetoken = {
    expires: new Date(
        Date.now() + 10 * 60 * 1000
    ),
    httpOnly: true
}
exports.listnoti = async(req, res) => {
    if (req.cookies.token) {
        var token = req.cookies.token
    } else {
        var tokenrf = req.cookies.refreshtoken;
        var token = await refeshtoken(tokenrf);
        res.cookie('token', token, timetoken);
    }
    const paged = (req.query.paged) ? req.query.paged : 1;
    const test = req.body.paged
    console.log(paged);
    pathurl = '/notification/list?page=' + paged;

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: process.env.URL_API + pathurl,
        headers: {
            'Authorization': 'Bearer ' + token
        }
    };
    axios.request(config)
        .then((response) => {
            results = response.data.results;
            console.log(response.data)
            res.render('pages/noti', { userInfo: JSON.parse(userobj), lang: req.cookies.lang, results: results });
        })
        .catch((error) => {
            const { code, message } = parseError(error)
            res.json({ code, message });
        });

}