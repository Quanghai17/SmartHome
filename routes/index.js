const express = require('express');
const router = express.Router();
const homeController = require("../controllers/home.js");
const uploadController = require("../controllers/upload.js");

router.get('/vmap', homeController.mapekmap);
router.get('/importfile', homeController.importFile);
router.get('/uploadfile', homeController.uploadFile);

router.post('/upload', uploadController.handleUpload);


module.exports = router;