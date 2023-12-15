const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../app')

describe('Authentication', () => {
    it('should authenticate a user with valid credentilas', (done) => {
        request(app)
            .post('/auth/login')
            .send({ email: 'user@test.com', password: 'user' })
            .end((err,res) => {
                expect(res.status).to.equal(302);
                done();
            })
    })

    it('should reject authentication with invald credentials',(done)=>{
        request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'test123' })
        .end((err,res) => {
            expect(res.status).to.equal(302);
            done();
        })
})
})