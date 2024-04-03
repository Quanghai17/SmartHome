const CryptoJS = require("crypto-js");
function parseError(e) {
    let rCode = -1;
    let rMessage = 'Unhandled error has occurred';
    let rData = {};
    const { response } = e;
    if (response) {
        const { status, data } = response;
        if (status) {
            rCode = status;
        }
        if (data) {
            rData = { ...data };
            const { message } = data;
            rMessage = message ?? 'Unhandled exception has occurred!';
            if (!data.hasOwnProperty('message') && data.detail) {
                rMessage = data.detail.toString();
            } else if (typeof data === 'string') {
                rMessage = data;
            }
        }
    } else {
        const { code, message } = e;
        if (code && message) {
            rCode = code;
            rMessage = message;
            rData = e;
        } else if (message) {
            rMessage = message;
        } else {
            rMessage = e;
        }
    }
    let msg = rMessage;
    if (typeof rMessage !== 'string') {
        if (Array.isArray(rMessage)) {
            msg = rMessage.join('\n');
        } else {
            const keys = Object.keys(rMessage);
            if (keys.length > 0) {
                for (const key of keys) {
                    let k = key.charAt(0).toUpperCase() + key.slice(1);
                    let value = rMessage[key];
                    msg += k + ': ' + value;
                    msg += ', ';
                }
                if (msg.length > 2) {
                    msg = msg.substring(0, msg.length - 2);
                }
            } else {
                msg = JSON.stringify(rMessage);
            }
        }
    }
    return { code: rCode, message: msg, data: rData };
}
module.exports = {
    parseError
};