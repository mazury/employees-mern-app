const MongoClient = require('mongodb').MongoClient;
const data = require('../data-test').offices;
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const server = require('../app');
chai.use(chaiHttp);

let db;

describe('CRUD tests:', () => {
    before('connect to db', async () => {
        const client = await MongoClient.connect('mongodb://localhost:27017');
        db = client.db('locations-app-test');
    });

    before('insert test data', async () => {
        await db.collection('locations').insertMany(data);
    });

    after('clear test db', async () => {
        await db.dropDatabase();
    });

    describe('Location:', () => {
        describe('get:', () => {
            it('sends all locations in response', () => {
                chai.request(server).get('/api').end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.be.an('array').and.not.to.be.equal(data);
                });
            });
        });

        describe('delete:', () => {
            it('deletes location', () => {
                chai.request(server).delete(`/api/location/${data[1]._id}`).end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.equal('Location deleted successfully.');
                });
            });
        });

        describe('create:', () => {
            it('creates location', () => {
                const location = { _id: 'BYD', name: 'Bydgoszcz' };
                chai.request(server).post(`/api/`).send(location).end((err, res) => {
                    expect(res.status).to.equal(201);
                    expect(res.body).to.equal('Location created successfully.');
                });
            });
        });

        describe('create with wrong _id:', () => {
            it('returns error', () => {
                const location = { _id: 'wrongId', name: 'Bydgoszcz' };
                chai.request(server).post(`/api/`).send(location).end((err, res) => {
                    expect(res.status).to.equal(400);
                    expect(res.error.text).to.equal('Bad request. Location Id has to have 3 uppercase letters.');
                });
            });
        });

        describe('create with wrong name:', () => {
            it('returns error', () => {
                const location = { _id: 'BYD', name: 123 };
                chai.request(server).post(`/api/`).send(location).end((err, res) => {
                    expect(res.status).to.equal(400);
                    expect(res.error.text).to.equal('Bad request. Wrong or too long location name.');
                });
            });
        });

        describe('update:', () => {
            it('updates location', () => {
                const location = { _id: 'POZ', name: 'Poznan' };
                chai.request(server).put(`/api/${data[0]._id}`).send(location).end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.equal('Location updated successfully.');
                });
            });
        });

        // TODO: analogous to CREATE
        describe.skip('update with wrong id:', () => {
            it('returns error', () => {});
        });

        describe.skip('update with wrong name:', () => {
            it('returns error', () => {});
        });
    });

    describe('Employee:', () => {
        describe('delete:', () => {
            it('deletes employee', () => {
                chai.request(server).delete(`/api/employee/${data[0].employees[0]._id}`).end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.equal('Employee deleted successfully.');
                });
            });
        });

        describe('create:', () => {
            it('creates employee', () => {
                const employee = { name: 'Piotr', salary: 6000 };
                chai.request(server).post(`/api/${data[0]._id}`).send(employee).end((err, res) => {
                    expect(res.status).to.equal(201);
                    expect(res.body).to.equal('Employee created successfully.');
                });
            });
        });


        describe('create with wrong name:', () => {
            it('returns error', () => {
                const employee = { name: 12312, salary: 8000 };
                chai.request(server).post(`/api/${data[0]._id}`).send(employee).end((err, res) => {
                    expect(res.status).to.equal(400);
                    expect(res.error.text).to.equal('Bad request. Wrong or too long employee name.');
                });
            });
        });

        describe('create with wrong salary:', () => {
            it('returns error', () => {
                const employee = { name: 'Mateusz', salary: 'wrongSalary' };
                chai.request(server).post(`/api/${data[0]._id}`).send(employee).end((err, res) => {
                    expect(res.status).to.equal(400);
                    expect(res.error.text).to.equal('Bad request. Wrong or too big salary.');
                });
            });
        });

        describe('update:', () => {
            it('updates employee', () => {
                const employee = { name: 'Maciej', salary: 7000 };
                chai.request(server).put(`/api/${data[0]._id}/${data[0].employees[0]._id}`).send(employee).end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.equal('Employee updated successfully.');
                });
            });
        });

        // TODO: analogous to CREATE
        describe.skip('update with wrong name:', () => {
            it('returns error', () => {});
        });

        describe.skip('update with wrong salary:', () => {
            it('returns error', () => {});
        });
    });
});
