const zpl ="^^CF A,34^FO80,20^FB203,1,0,C^FDAAAA^FS^CF B,34^FO310,20^FB203,"
+"1,0,C^FDBBBB^FS ^XZ^XA  ^CF C,34  ^FO80,20 ^FB203,1,0,C ^FDCCCCC^FS"+
"^CF D,34  ^FO310,20 ^FB203,1,0,C ^FDDDDD^FS ^XZ^XA  ^CF E,34  ^FO80,20"+
"^FB203,1,0,C ^FDEEEeee^FS ^CF F,34  ^FO310,20 ^FB203,1,0,C ^FDFFFfff^FS"+
"^XZ^XA  ^CF G,34  ^FO80,20 ^FB203,1,0,C ^FDGGGggg^FS ^CF F,34  ^FO310,20"+
"^FB203,1,0,C ^FDHHHHhhhh^FS ^XZ"
//function print zpl
function printZPL(zpl) {
    const ip = "10.76.13.150";
    const port = 9100;
    const net = require('net');
    const client = new net.Socket();
    client.connect(port, ip, () => {
        client.write(zpl);
        client.destroy();
    }
    );
}
//print zpl
printZPL(zpl);


