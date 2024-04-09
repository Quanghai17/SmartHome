const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');

exports.importCsvData = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        const csvFilePath = req.file.path;
        await importCsvData(csvFilePath);
        res.redirect('/importfile');
    } catch (error) {
        console.error('Error importing CSV:', error);
        res.status(500).send('Internal server error');
    }
};

async function importCsvData(csvFilePath) {
    let data = [];
    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
            data.push(row);
        })
        .on('end', () => {
            processData(data);
        });
}

async function processData(data) {
    
    try {
        let gatewayNames = [];
        for (const obj of data) {
            
            for (const key of Object.keys(obj)) {
                if (!gatewayNames.includes(key)) {
                    gatewayNames.push(key);
                }
                if (!gatewayNames.includes(obj[key])) {
                    gatewayNames.push(obj[key]);
                }
            }
        }
        const requestData = { namegetway: gatewayNames };
       
        const response = await axios.post('https://phucuong.kennatech.vn/api/getways', requestData);
        // console.log('Response from server:', response.data);
    } catch (error) {

        console.error('Error sending data to server:', error);
    }
}
