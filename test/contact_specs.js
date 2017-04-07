const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const Contact = require('../app/models/contact');
const User = require('../app/models/user');

chai.use(chaiHttp);

const server = require('../server');

describe('Contacts', () => {
    beforeEach((done) => {
        Contact.remove({}, (err) => {
            if (err) done(err);
            done();
        });
    });

    before(function (done) {
        let testUser = new User({
            username: 'testUser',
            password: 'password'
        });
        testUser.save(function (err, user) {
            if (err) done(err);
            done('', user)
        });
    });

    describe('Contact create', function () {
        it('should allow us to create a contact', function (done) {
            const contact = new Contact({
                firstName: 'Joe',
                lastName: 'Doe',
                phoneNumber: '013456789',
                email: 'jdoe@me.com'
            });
            contact.save(function (err, user) {
                expect(err).to.equal(null, 'Error while creating user');
                expect(contact.firstName).to.equal('Joe', 'Error saving user\'s name');
                expect(contact.lastName).to.equal('Doe', 'Error saving user\'s name');
                expect(contact.phoneNumber).to.equal('013456789', 'Error saving user\'s name');
                expect(contact.email).to.equal('jdoe@me.com', 'Error saving user\'s name');
                done();
            })
        });
    });

    describe('/POST contact', () => {
        it('it should not POST an contact without firstName and lastName and phone number', (done) => {
            let contact = {
                email: 'jadoe@me.com'
            };
            chai.request(server)
                .post('/api/contacts')
                .auth('testUser', 'password')
                .send(contact)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('error');
                    res.body.should.be.a('object');
                    done();
                });
        })
    });

    describe('/POST contact', () => {
        it('it should POST an contact', (done) => {
            let contact = {
                firstName: 'Jane',
                lastName: 'Doe',
                phoneNumber: '013456789',
                email: 'jadoe@me.com'
            };
            chai.request(server)
                .post('/api/contacts')
                .auth('testUser', 'password')
                .send(contact)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.contact.should.have.property('firstName');
                    res.body.contact.should.have.property('lastName');
                    res.body.contact.should.have.property('phoneNumber');
                    res.body.contact.should.have.property('email');
                    done();
                });
        })
    });

    describe('/GET/:id book', () => {
        it('it should GET a book by the given id', (done) => {
            let contact = new Contact({
                firstName: 'Bob',
                lastName: 'Doe',
                phoneNumber: '013456789',
                email: 'bdoe@me.com'
            });
            contact.save((err, contact) => {
                chai.request(server)
                    .get('/api/contacts/' + contact.id)
                    .auth('testUser', 'password')
                    .send(contact)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('firstName');
                        res.body.should.have.property('lastName');
                        res.body.should.have.property('phoneNumber');
                        res.body.should.have.property('email');
                        res.body.should.have.property('_id').eql(contact.id);
                        done();
                    });
            });
        });
    });

    describe('/GET contact', () => {
        it('it should GET all the contacts', (done) => {
            chai.request(server)
                .get('/api/contacts')
                .auth('testUser', 'password')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        })
    });

    describe('/PUT/:id contact', () => {
        it('it should UPDATE a contact given the id', (done) => {
            let contact = new Contact({
                firstName: 'Shawn',
                lastName: 'Doe',
                phoneNumber: '013456789'
            });

            contact.save((err, contact) => {
                chai.request(server)
                    .put('/api/contacts/' + contact.id)
                    .auth('testUser', 'password')
                    .send({
                        firstName: 'Shawn',
                        lastName: 'Doe',
                        phoneNumber: '013456789',
                        email: 'sdoe@me.com'
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Contact updated!');
                        res.body.contact.should.have.property('email').eql('sdoe@me.com');
                        done();
                    });
            });
        });
    });

    describe('/DELETE/:id contact', () => {
        it('it should DELETE a contact given the id', (done) => {
            let contact = new Contact({
                firstName: 'Shawna',
                lastName: 'Doe',
                phoneNumber: '013456789',
                email: 'sadoe@me.com'
            });

            contact.save((err, contact) => {
                chai.request(server)
                    .delete('/api/contacts/' + contact.id)
                    .auth('testUser', 'password')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Contact successfully deleted!');
                        done();
                    });
            });
        });
    });
});

