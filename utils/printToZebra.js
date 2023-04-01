const net = require('net');

const client = new net.Socket();
module.exports = {
    printToZebra,
};

function printToZebra(ipAddress, port, zpl) {
    client.connect(port, ipAddress, () => {
        client.write(zpl);

        client.destroy();
    });
}

const zpl =
    '^XA^CFF,50^XA^FO18,18 ^FB203,0,1,C^FD1234&^FS^FO259,8 ^FB203,0,1,C^FD1234567&^FS^FO510,8 ^FB203,0,1,C^FD123456&^FS ^XZ^XA  ^FD  ^XZ ^LL';

const port = 9100;
const ipAddress = '10.76.13.150';
printToZebra(ipAddress, port, zpl);
