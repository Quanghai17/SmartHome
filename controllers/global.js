const { parseError } = require('./error');
const axios = require('axios');
async function refeshtoken(refeshtoken) {
    try {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: process.env.URL_API + '/auth/refresh_token',
            headers: {
                'Authorization': 'Bearer ' + refeshtoken
            }
        };
        return await axios.request(config)
            .then((response) => {
                return response.data.tokenObj.token
            })
            .catch((error) => {
                const { code, message } = parseError(error)
                return { code, message };
            });
    } catch (err) {
        const { code, message } = parseError(error)
        return { code, message };
    }
}
async function list_notification(token,paged) {
    try {
        pathurl = '/notification/list?page=' + paged;
    
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: process.env.URL_API + pathurl,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };
        return await axios.request(config)
            .then((response) => {
                return response.data.results;
               // res.render('pages/noti', { userInfo: JSON.parse(userobj), rooms: response.data, lang: req.cookies.lang, results: results });
            })
            .catch((error) => {
                const { code, message } = parseError(error)
                return { code, message };
            });
    } catch (err) {
        const { code, message } = parseError(error)
        return { code, message };
    }
}
async function homelistdata(token){
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: process.env.URL_API + '/home/list',
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    };
    return axios.request(config)
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            const { code, message } = parseError(error)
            return { code, message };
        });
}
module.exports = {
    refeshtoken,
    list_notification,
    homelistdata
};