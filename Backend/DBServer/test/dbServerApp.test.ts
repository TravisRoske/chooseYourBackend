import request from 'supertest'
import { app } from '../dbServerApp.js'


describe('GET /assignid', () =>  {
    describe('Given no userid', () => {
        //should return a new valid userid
        //should return status 200
        test("should return a new valid userid", async () => {
            const response = await request(app).get('/assignid').send()
            const result = await request(app).get("/assignid");
            expect(response.statusCode).toBe(200)
        })
    })

    describe('Given a valid userid', () => {
        //should return the same userid
        //should return status 200
    })

    describe('Given an invalid userid', () => {
        //should return a new valid userid
        //should return an error status code???
    })

})