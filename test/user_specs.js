const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const User = require('../app/models/user');

chai.use(chaiHttp);

const server = require('../server');

describe('Contacts', () => {
    beforeEach((done) => {
        User.remove({}, (err) => {
            if(err) done(err);
            done();
        });
    });

    describe('/POST user', () => {
        it('it should POST an user', (done) => {
            let user = {
                username:'test',
                password:'password'
            };
            chai.request(server)
                .post('/api/users')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.user.should.have.property('username');
                    res.body.user.should.have.property('password');
                    res.body.should.be.a('object');
                    done();
                });
        })
    });
});



