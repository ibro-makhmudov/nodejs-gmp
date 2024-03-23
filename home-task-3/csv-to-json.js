const fs = require('fs');
const csvtojson = require('csvtojson');

const csvFilePath = './csv/data.csv';
const txtFilePath = './csv/output.txt';

const readStream = fs.createReadStream(csvFilePath);
const writeStream = fs.createWriteStream(txtFilePath);

readStream
    .pipe(csvtojson({
        headers: ['book', 'author', 'amount', 'price']
    }))
    .on('error', (error) => {
        console.error('Error reading CSV file:', error.message);
    })
    .on('data', (data) => {
        const { book, author, price } = data;
        const formattedData = `{"book":"${book}","author":"${author}","price":${price}}\n`;
        writeStream.write(formattedData, (error) => {
            if (error) {
                console.error('Error writing to TXT file:', error.message);
            }
        });
    })
    .on('end', () => {
        console.log('Conversion completed. Output file is saved.');
        writeStream.end();
    });
