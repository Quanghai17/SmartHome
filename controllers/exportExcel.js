const fs = require('fs');
const csv = require('csv-writer').createObjectCsvWriter;
const axios = require('axios');

exports.exportCSV = async (req, res) => {
    try {
        const response = await axios.get('https://phucuong.kennatech.vn/api/getways')

        const getways = response.data; 

        const csvWriter = csv({
            path: 'getwaysNew.csv',
            header: [
                { id: 'id', title: 'ID' },
                { id: 'name', title: 'Name' }
            ]
        });
        await csvWriter.writeRecords(getways);

        const file = `getwaysNew.csv`;
        res.download(file);
    } catch (error) {
        console.error('Lỗi khi xuất file CSV:', error);
        
        res.status(500).send('Đã xảy ra lỗi khi xuất file CSV');
    }
};
