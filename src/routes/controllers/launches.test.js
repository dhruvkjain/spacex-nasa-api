const request = require('supertest');
const path = require('path');

const { app } = require(path.join(__dirname, '..', '..', 'app.js'));
const { connectToMongo , disconnectToMongo } = require(path.join(__dirname, '..', '..', 'services', 'mongo.js'))

describe('Test launches', () => {

    beforeAll( async()=> {
        await connectToMongo()
    });

    afterAll(async()=>{
        await disconnectToMongo();
    })

    const testlaunch = {
        mission: "MSI 1",
        rocket: "ISE 1",
        launchDate: "January 17, 2030",
        target: "Kepler-1410 b"
    };

    test('GET/launches', async () => {
        const response = await request(app)
            .get('/v1/launches')
            .expect('Content-Type', /json/)
            .expect(200);
    });

    test('POST/launches 201 creation test', async () => {
        const response = await request(app)
            .post('/v1/launches')
            .send(testlaunch)
            .expect('Content-Type', /json/)
            .expect(201);
        
        const responseDate = new Date(response.body.launchDate).valueOf();
        const ogDate = new Date(testlaunch.launchDate).valueOf();
        expect(responseDate).toBe(ogDate);

        expect(response.body).toMatchObject({
            mission: "MSI 1",
            rocket: "ISE 1",
            target: "Kepler-1410 b"
        })
    });

    test('POST/launches 400 catch missing properties error', async () => {
        const testlaunch = {
            mission: "MSI 1",
            rocket: "ISE 1",
            target: "Kepler-1410 b"
        };
        const response = await request(app)
            .post('v/launches')
            .send(testlaunch)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toStrictEqual({error: 'Insufficient data'})
    });

    test('POST/launches 400 catch invalid Date error', async () => {
        const testlaunch = {
            mission: "MSI 1",
            rocket: "ISE 1",
            target: "Kepler-1410 b",
            launchDate: "adfasd",
        };
        const response = await request(app)
            .post('/v1/launches')
            .send(testlaunch)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toBe('Wrong Date')
    });
})
