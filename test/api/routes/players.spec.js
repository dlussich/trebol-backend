require('dotenv').config();
const {expect,assert} = require('chai');
const request = require('supertest');
const db = require('../../../config/db_config');
const app = require('../../../app');

//let's set up the data we need to pass to the login method
const userCredentials = {
    email: 'dlussich@gmail.com', 
    password: '1234567'
  }
  //now let's login the user before we run any tests
  //var authenticatedUser = request.agent(app);
beforeEach((done)=>{
    db.connect().then((res,err)=>{
        if(err) return done(err);
        console.log("Connected to the DB...");
        done();
    }).catch(err=> done(err));
});
afterEach((done)=>{
    db.close();
    done();
});
describe('GET /login', (done)=>{
    it('should return a 200 response if the user is logged in', (done)=>{
        request(app).post('/login').send(userCredentials)
                .expect(200)
                .expect(res=>{
                    assert.isNotNull(res.header['x-aut']);
                })
                .end(done);
      });

});
