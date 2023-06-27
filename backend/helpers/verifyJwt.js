/*export const verifyJwt = (req, res, next) => {
    const token = req.headers["access-token"];
    if (!token) {
        return res.json("Usted necesita un token y debe logearse de nuevo")
    } else{
        jwt.verify(token, 'grupo3', (err, decoded)=>{
            if (err) {
                res.json("No autenticado")
            } else {
                req.userId = decoded.id;
                // console.log( decoded.id);
                res.json("Autenticado")
                next()
            }
        })
    }
}*/

export const verifyJwt = (req, res, next) => {
    const token = req.headers["access-token"];
    if (!token) {
        return res.json("Usted necesita un token y debe logearse de nuevo")
    } else {
        jwt.verify(token, 'grupo3', (err, decoded) => {
            if (err) {
                res.json("No autenticado")
            } else {
                req.userId = decoded.id;
                // console.log( decoded.id);
                res.json("Autenticado")
                next()
            }
        })
    }
}