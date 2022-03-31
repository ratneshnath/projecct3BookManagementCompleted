const jwt = require('jsonwebtoken')
const authenticate = function(req, res, next){
    try{
    let token = req.headers['x-api-key']
    if(!token)
    return res.status(400).send({ status: false, msg: "Token is required"})
    let decodedToken = jwt.verify(token, "third project")     
    if(!decodedToken)
    return res.send({ status: false, msg: "token is invalid"})
    next()

}catch(err){
    res.status(500).send({Error:err.message})
}
}

const authorize = function(req, res, next){
    try{
    let token = req.headers['x-api-key'];
    if(!token)
    return res.status(401).send({status: false, msg:"Token not present"})
    let decodedToken = jwt.verify(token, "third project",)
    if(!decodedToken)
    return res.status(401).send({status:false,msg:"Token is invalid"})
    let userToBeModified = req.params.userId
    let userLoggedIn = decodedToken.userId
    if(userToBeModified !== userLoggedIn)
    return res.status(400).send({status: false, msg:"User is not allowed for logged in"})
    next()
}catch(err){
    res.status(500).send({Error: err.message})
}
}

module.exports.authenticate=authenticate
module.exports.authorize=authorize