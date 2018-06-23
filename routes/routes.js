
const express = require('express');
const router = express.Router();
const httpError = require('../errors/httpError')
const DB_NAME = process.env.NODE_ENV === 'production' ? 'locations-app' : 'locations-app-test';

// TODO: use mongoose as a mongo client?
// TODO: change data model from embedded to references? - what would be better?
// TODO: additionally check documents in database

async function main () {
    const MongoClient = require('mongodb').MongoClient;
    const client = await MongoClient.connect('mongodb://localhost:27017');
    console.log('api connected to db');
    const db = client.db(DB_NAME);

    /* GET LOCATIONS */
    router.get('/', async (req, res, next) => {
        try {
            const locations = await db.collection('locations').find({}).toArray();
            res.status(200).send(locations);
        } catch (e) {
            next(e);
        }
    });

    /* CREATE LOCATION */
    router.post('/', async (req, res, next) => {
        try {
            validateLocation(req.body, res);

            await db.collection('locations').insertOne(Object.assign(req.body, { employees: [] }));
            res.status(201).json('Location created successfully.');
        } catch (e) {
            next(e);
        }
    });

    /* UPDATE LOCATION */
    router.put('/:id', async (req, res, next) => {
        try {
            validateLocation(req.body, res);

            const { _id, name, employees = [], oldId } = req.body;
            const locations = db.collection('locations');
            if (_id === oldId) {
                await locations.updateOne({ _id: req.body.oldId }, { $set: { name } });
            } else {
                await locations.insertOne({ _id, name, employees });
                await locations.deleteOne({ _id: oldId });
            }
            res.status(200).json('Location updated successfully.');
        } catch (e) {
            next(e);
        }
    });

    /* DELETE LOCATION */
    router.delete('/location/:id', async (req, res, next) => {
        try {
            await db.collection('locations').deleteOne({ _id: req.params.id });
            res.status(200).json('Location deleted successfully.');
        } catch (e) {
            next(e);
        }
    });

    /* DELETE EMPLOYEE */
    router.delete('/employee/:id', async (req, res, next) => {
        try {
            const locations = db.collection('locations');
            await locations.update({}, { $pull: { employees: { _id: Number(req.params.id) } } }, { multi: true });
            res.status(200).json('Employee deleted successfully.');
        } catch (e) {
            next(e);
        }
    });

    /* CREATE EMPLOYEE */
    router.post('/:id', (req, res, next) => {
        try {
            validateEmployee(req.body, res);

            const { name, salary } = req.body;
            const locations = db.collection('locations');
            const agg = locations.aggregate([
                { $project: { 'employees._id': 1 } },
                { $unwind: '$employees' },
                { $sort: { 'employees._id': -1 } },
                { $limit: 1 }]);
            agg.on('data', async data => {
                await locations.updateOne({ _id: req.params.id },
                    { $push: { employees: { _id: data.employees._id + 1, name, salary: Number(salary) } } });

                res.status(201).json('Employee created successfully.');
            });
        } catch (e) {
            next(e);
        }
    });

    /* UPDATE EMPLOYEE */
    router.put('/:locationId/:id', async (req, res, next) => {
        try {
            validateEmployee(req.body, res);

            const locations = db.collection('locations');
            await locations.updateOne({ 'employees._id': Number(req.params.id) },
                { $set: { 'employees.$.name': req.body.name, 'employees.$.salary': Number(req.body.salary) } });
            res.status(200).json('Employee updated successfully.');
        } catch (e) {
            next(e);
        }
    });
}

main();

function validateLocation (params) {
    if (!/^[A-Z]{3}$/.test(params._id)) {
        throw new httpError('Bad request. Location Id has to have 3 uppercase letters.');
    }
    if (!/^\w{0,20}$/i.test(params.name) || Number(params.name)) {
        throw new httpError('Bad request. Wrong or too long location name.');
    }
}

function validateEmployee (params) {
    if (!/^\d{0,6}$/.test(params.salary)) {
        throw new httpError('Bad request. Wrong or too big salary.');
    }

    if (!/^\w{0,15}$/i.test(params.name) || Number(params.name)) {
        throw new httpError('Bad request. Wrong or too long employee name.');
    }
}

module.exports = router;
