const express = require('express');
const router = express.Router();
const homeController = require("../controllers/home.js");
const uploadController = require("../controllers/upload.js");
const importExcelController = require("../controllers/importExcel.js");
const exportExcelController = require("../controllers/exportExcel.js");

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/vmap', homeController.mapekmap);
router.get('/importfile', homeController.importFile);
router.get('/uploadfile', homeController.uploadFile);

router.post('/upload', uploadController.handleUpload);

router.post('/import',upload.single('csvFile'),  async (req, res) => {
    try {
        await importExcelController.importCsvData(req, res);
    } catch (error) {
        console.error('Error handling import:', error);
        res.status(500).send('Internal server error');
    }
});

router.get('/export-csv', exportExcelController.exportCSV);

module.exports = router;