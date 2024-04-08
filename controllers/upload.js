const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

const API_URL = 'https://phucuong.kennatech.vn/api/uploadfile';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage }).single('file');

function handleUpload(req, res) {
    upload(req, res, function (err) {
        if (err) {
            console.error(err);
            return res.status(500).send('File upload failed.');
        }
        if (!req.file) {
            return res.status(400).send('No files were uploaded.');
        }

        const formData = new FormData();
        formData.append('name', req.file.originalname);

        axios.post(API_URL, { file_name: req.file.originalname })
            .then(response => {
                console.log('File uploaded successfully:', response.data);
                res.redirect('/uploadfile');
            })
            .catch(error => {
                console.error('Error uploading file:', error);
                res.status(500).send('File upload failed.');
            });
    });
}

module.exports = {
    handleUpload
};