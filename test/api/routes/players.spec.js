require('dotenv').config();
const jwt = require('jsonwebtoken');
const {expect,assert} = require('chai');
const request = require('supertest');
const db = require('../../../config/db_config');
const app = require('../../../app');



describe('Players module tests',()=>{
    var auth_token ={};
        before((done)=>{
            const userCredentials = {
                email: 'testuser@gmail.com', 
                password: '@testing'
            };
            db.connect().then((res,err)=>{
                if(err) return done(err);
                request(app).post('/login').send(userCredentials)
                            .then((data,err)=>{
                                if(err) return done(err);
                                auth_token = data.body;
                                done();
                            })
                            .catch(err=>done(err));
            }).catch(err=> done(err));
        });
        after((done)=>{
            db.close();
            done();
        });
    describe('GET /players',()=>{
        it('should return 200 and the result list should contain players',(done)=>{
                request(app).get('/players')
                            .set('Authorization', 'bearer ' + auth_token.token)
                            .end((err, res)=>{ 
                                if(err) return done(err);
                                expect(res.statusCode).to.equal(200);  
                                expect(res.body.count).to.be.gt(2) 
                                done(); 
                              }); 
        });
        it('should return 401 failed authentication',(done)=>{
            request(app).get('/players')
                        .expect(401)
                        .end(done);
        });
    });
    var playerId;
    describe('GET /players/:playerId',()=>{
        it('should return 200 and return player info',(done)=>{
            try{
               const decoded = jwt.verify(auth_token.token,process.env.JWT_KEY);
               playerId = decoded.playerId;
            }catch(error){
                console.log(error);
            }
            request(app).get('/players/'+playerId)
                            .set('Authorization', 'bearer ' + auth_token.token)
                            .expect(200)
                            .end(done);
        });
        it('should return 401 failed authentication',(done)=>{
            request(app).get('/players/'+playerId)
                        .expect(401)
                        .end(done);
        });

        it('should return 404 player not found',(done)=>{
            request(app).get('/players/'+1)
                        .set('Authorization', 'bearer ' + auth_token.token)
                        .expect(404)
                        .end(done);
        });
    });

    describe('UPDATE /players',()=>{

        it('should return 201 and return updated player',(done)=>{
                request(app).put('/players')
                            .send({email:'testuser@gmail.com', name:'New Name', lastName:'New LastName'})
                            .set('Authorization', 'bearer ' + auth_token.token)
                            .end((err, res)=>{ 
                                if(err) return done(err);
                                expect(res.statusCode).to.equal(201);  
                                expect(res.body.data.name).to.equal('New Name'); 
                                expect(res.body.data.lastName).to.equal('New LastName'); 
                                done(); 
                              }); 
        });
        it('should return 401 failed authentication',(done)=>{
            request(app).get('/players')
                        .expect(401)
                        .end(done);
        });
    });

    describe('DELETE /players/:playerId',()=>{

        it('should return 401 failed authentication',(done)=>{
            request(app).delete('/players/'+playerId)
                        .expect(401)
                        .end(done);
        });

        it('should return 404, player ID does not exist',(done)=>{
            request(app).delete('/players/'+1)
                        .set('Authorization', 'bearer ' + auth_token.token)
                        .expect(404)
                        .end(done);
        });

        it('should return 200, player successfully removed',(done)=>{
            request(app).delete('/players/'+playerId)
                        .set('Authorization', 'bearer ' + auth_token.token)
                        .expect(200)
                        .end(done);
        });
    });
});
