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

const zpl = '^XA^CFE,350^XA^FO12,20^FB300,0,1,C^FD-SE^FS^FO345,20^FB300,0,1,C^FD-SE^FS^XZ';

const port = 9100;
const ipAddress = '10.76.13.150';
printToZebra(ipAddress, port, zpl);
