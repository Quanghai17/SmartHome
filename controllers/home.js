const { refeshtoken,list_notification,homelistdata} = require('./global');
const { parseError } = require('./error');
const axios = require('axios');
const tokename = Buffer.from("token").toString('base64').replace('=','');
const retokename = Buffer.from("refreshtoken").toString('base64').replace('=','');
const userobjname = Buffer.from("userobj").toString('base64').replace('=','');
const timetoken = {
    expires: new Date(
        Date.now() + 10 * 60 * 1000
    ),
    httpOnly: true
}

exports.mapekmap = async (req, res) => {
    if (req.cookies[tokename]) {
        var token = req.cookies[tokename]
    } else {
        var tokenrf = req.cookies[retokename];
        var token = await refeshtoken(tokenrf);
        res.cookie(tokename, token, timetoken);;
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: process.env.URL_API + '/city/cities',
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    };
    const noti = await list_notification(token,1);
    
   const makers = await homelistdata(token);
   console.log(makers)
    await axios.request(config)
        .then((response) => {
            let listlocation = response.data
            let datamarker = [];
            var i = 0;
            makers.forEach(function (dataget, index) {
                if (dataget.latitude != null) {
                    let item = {
                        position: { lat: (dataget.latitude), lng: (dataget.longitude) },
                        title: dataget.name + ' - ' + dataget.address,
                        homeid: dataget.id,
                    };
                    datamarker[i] = item;
                    i++;
                }
            });
            // res.json(datamarker);
            res.render('pages/maps3', { lang: req.cookies.lang, cities: JSON.stringify(datamarker), results:noti});

        })
        .catch((error) => {
            const { code, message } = parseError(error)
            res.json({ code, message });
        });
}
