export function requestLogger(req: any, res: any, next: any){

    /////////
    console.log("body", req.body)
    console.log("headers", req.headers)
    console.log("params", req.params)
    console.log("query", req.query)

    next()
}