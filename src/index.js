const http = require('http');
const url = require('url');
const fs = require('fs');

http.createServer((req, res)=> {
    if (req.method === 'POST' && creq.url.includes('/user')) {
        const query = url.parse(req.url, true).query;
        readFile((users) => {
            users.push(query.username);
            saveFile(users, () => {
                res.write('user created');
                res.end();
            });
        });
    } else if (req.method === 'GET' && req.url.includes('/user')) {
        readFile((users) => {
            console.log(users);
            res.end();
        });
    } else if (req.method === 'DELETE' && req.url.includes('/user')) {
        readFile((users) => {
            const query = url.parse(req.url, true).query;
            if(users.indexOf(query.username) === -1) {
               res.write(`user ${query.username} not exist`);
               res.end();
               return;
            }
            users.splice(users.indexOf(query.username), 1)
            saveFile(users, () => {
               res.write(`user ${query.username} was deleted`);
               res.end();
            }); 
        });
    } else if (req.method === 'PUT' && req.url.includes('/user')) {
        readFile((users) => {
            const query = url.parse(req.url, true).query;
            if (!users.includes(query.usernameOld)) {
                res.write(`user ${query.usernameOld} not exist`);
                res.end();
                return;
            }
            if (users.includes(query.usernameNew)) {
                res.write(`user ${query.usernameNew} already exist`);
                res.end();
                return;
            }
            users.splice(users.indexOf(query.usernameOld), 1);
            users.push(query.usernameNew);
            saveFile(users, ()=> {
                res.write(`user ${query.usernameOld} was change to ${query.usernameNew}`);
                res.end();
            }); 
        });
    }
}).listen(4000);

function saveFile(content, cb) {
    fs.writeFile('./src/db.json', JSON.stringify(content), cb);
}
function readFile(cb) {
    fs.readFile('./src/db.json', { encoding: 'utf-8' }, (err, content) => {
        if (err) {
            console.log(err);
            return;
        }
        cb(JSON.parse(content));
    });
}

console.log('Listening on: http://localhost:4000');