const net = require('net');

const client = new net.Socket();
module.exports = {
    printToZebra,
};

function printToZebra(ipAddress, port, zpl) {
    try {
        client.connect(port, ipAddress, () => {
            client.write(zpl);

            client.destroy();
        });
    } catch (error) {
        console.log('error: ', error);
    }
}

const zpl =
    '^XA^CFE,23^CFE,23^XA^CFE,23^FO8,27^FB203,0,1,C^FD-SE^FS^FO233,27^FB203,0,1,C^FD-SE^FS^FO458,27^FB203,0,1,C^FD-SE^FS ^XZ^XA^MMC^XZ';

const port = 9100;
const ipAddress = '10.76.13.150';
printToZebra(ipAddress, port, zpl);
// production labels 10.76.14.29 and 10.76.14.30
