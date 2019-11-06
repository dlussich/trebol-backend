require('dotenv').config();
const mongoose = require('mongoose');

exports.connect = ()=>{

    return new Promise((resolve,reject)=>{
         mongoose.connect(process.env.DB_CONN_STRING, {useNewUrlParser: true, useCreateIndex:true })
                .then((res,err)=>{
                    if(err) return reject(err);
                    resolve();
                }).catch(reject);
    });

};

exports.close = ()=>{
    return mongoose.disconnect();
};
