require('dotenv').config();
const http = require('http');
const db = require('./config/db_config')
const app = require('./app');


const port = process.env.PORT || 3000;

const server = http.createServer(app);
db.connect().then(()=>{
    server.listen(port, ()=>{
        console.log(`Server started listening on port: ${port}`);
    });
 }).catch(err=>{
     console.log(err);
 });

