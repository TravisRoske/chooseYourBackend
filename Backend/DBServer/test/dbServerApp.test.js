// import request from 'supertest'
const request = require('supertest')
const { app } = require('../Build/dbServerApp.js')
const { isValidUserid } = require('../Build/middleware/validateUserid.js')
// import { app } from '../dbServerApp.js'


describe('GET /assignid', () =>  {
    describe('Given no userid', () => {
        test("should return a new userid", async () => {
            const response = await request(app).get('/assignid').send()
            expect(response.body).toHaveProperty("userid")
        })
        test("the new userid should be valid", async () => {
            const response = await request(app).get('/assignid').send()
            console.log(response.body, response.body.userid)
            expect(isValidUserid(response.body.userid)).toBe(true)
        })
        test("should return status code 200", async () => {
            const response = await request(app).get('/assignid').send()
            expect(response.statusCode).toBe(200)
        })
    })

    describe('Given a valid userid', () => {
        const validid = "uidc54d69c962eb4bb98d2d10129f13603d"

        test("should return the same userid", async () => {
            const response = await request(app).get(`/assignid/${validid}`)////
            expect(response.body).toHaveProperty("userid")
            expect(response.body.userid).toEqual(validid)
        })
        test("should return status code 200", async () => {
            const response = await request(app).get(`/assignid/${validid}`)///////
            expect(response.statusCode).toBe(200)
        })
    })

    describe('Given an invalid userid', () => {
        const invalidid = "invalid"

        test("should return a new, valid userid", async () => {
            const response = await request(app).get(`/assignid/${invalidid}`)////
            expect(response.body).toHaveProperty("userid")
            expect(response.body.userid).not.toEqual(invalidid)
        })
        test("should return status code 200", async () => {
            const response = await request(app).get(`/assignid/${invalidid}`)///////
            expect(response.statusCode).toBe(200)
        })
    })

})