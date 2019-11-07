require('dotenv').config();
const {expect,assert} = require('chai');
const request = require('supertest');
const db = require('../../../config/db_config');
const app = require('../../../app');


before((done)=>{
    db.connect().then((res,err)=>{
        if(err) return done(err);
        done();
    }).catch(err=> done(err));
});
after((done)=>{
    db.close();
    done();
});

describe('POST /sign up', ()=>{
    //let's set up the data we need to pass to the login method
    const signupUser = {"name": "Testing",
                        "lastName": "User",
                        "email": "testuser@gmail.com",
                        "password": "@testing"};
    it('should return a 201 response if the user created', (done)=>{
        console.log(signupUser);
        request(app).post('/signup').send(signupUser)
                .expect(201)
                .expect(res=>{
                    expect(res.body.data.email).to.equal("testuser@gmail.com");
                    expect(res.body.data.name).to.equal("Testing");
                    expect(res.body.data.lastName).to.equal("User");
                })
                .end(done);
      });

      it('should return a 500 response if user is unauthorized to log in', (done)=>{
        const failedUer = {email: "someemail",password:"@itdoesnotmatter"};
        request(app).post('/signup').send(failedUer)
                .expect(500)
                .expect(res=>{
                    assert.isNotNull(res.body.error.errors.email);
                })
                .end(done);
      });
});


describe('POST /login', ()=>{
    const userCredentials = {"email": "testuser@gmail.com","password": "@testing"};
    it('should return a 200 response if the user is logged in', (done)=>{
        request(app).post('/login').send(userCredentials)
                .expect(200)
                .expect(res=>{
                    assert.isNotNull(res.header['x-aut']);
                })
                .end(done);
      });

      it('should return a 401 response if user is unauthorized to log in', (done)=>{
        request(app).post('/login').send({email: "someemail@gmail.com",password:"@itdoesnotmatter"})
                .expect(401)
                .expect(res=>{
                    assert.isNotNull(res.body.message);
                })
                .end(done);
      });
});
