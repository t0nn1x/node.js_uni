const os = require('os');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'hello_user.txt'); 
const data = 'Hello ' + os.userInfo().username + '!' + '\r';
fs.appendFile(filePath, data, (err) => {
    if (err) {
        console.log(err);
    }
}
);





