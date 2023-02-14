const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'hello.txt'); 
const data = 'Hello world!' + '\r';
fs.appendFile(filePath, data, (err) => {
    if (err) {
        console.log(err);
    }
}
);


