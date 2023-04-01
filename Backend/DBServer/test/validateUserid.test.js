const { isValidUserid } = require('../Build/middleware/validateUserid.js')


describe('Function isValidUserid', () =>  {

    describe('Given a valid userid', () => {

        test("should return true", async () => {
            const validids = [
                "uidc54d69c962eb4bb98d2d10129f13603d",
                "uidjaeon90aTeaGAEj0ag3j9agngalsdndjg",
                "uidln3a90u249qh4p4ogfdhsgh554jualssd",
                "uid457057203539085956765765756756749237"
            ]
            for(let id of validids){
                expect(isValidUserid(id)).toBe(true)
            }
        })
    })

    describe('Given an invalid userid', () => {
        test("should return false", async () => {
            const invalidids = [
                null,
                undefined,
                NaN,
                "",
                "uidlknaldj",
                "uidjfaoine904ajg90j4a09ga409gn90ag09aug09aj3g9dsgadsg5ssadfh5h5sj454j50ja3g90ja390g",
                "uidADSGJDSAOIGJSasdgaasdgadssdgdsgDAIGH%",
                "uidc54d69c962eb4bb98d2d10129f13603d`",
                "uidc54d69c962eb4bb98d2d10129f13603d*",
                "uidc54d69c962eb4bb98d2d10129f13603d=",
                "uidc54d69c962eb4bb98d2d10129f13603d%",
                "uidc54d69c962eb4bb98d2d10129f13603d;",
                "uidc54d69c962eb4bb98d2d10129f13603d<",
                "uidc54d69c962eb4bb98d2d10129f13603d>",
                "uidc54d69c962eb4bb98d2d10129f13603d[",
                "uidc54d69c962eb4bb98d2d10129f13603d]",
                "uidc54d69c962eb4bb98d2d10129f13603d{",
                "uidc54d69c962eb4bb98d2d10129f13603d(",
                "uidc54d69c962eb4bb98d2d10129f13603d)",
                "uidADSGJDSAasdgassadgeageagOIGJSD AIGH",
                " uid209fadslfnlsdk8888sgdadsgasdauf0as",
                "sadgjaeon90aTeaGAEj0ag3456546j9agngalsdng",
                "46ln3a90u249qh4p4ogdfhsdfhdfshsdhgualssd",
            ]
            for(let id of invalidids){
                expect(isValidUserid(id)).toBe(false)
            }
        })
    })

})