const jwt = require('jsonwebtoken');

exports.jwt_authentication = (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token,process.env.JWT_KEY);
        req.playerDecoded = decoded;
        next();
    }catch(error){
        console.log(error);
        res.status(401).json({
            error: "Authentication failed!"
        });
    }
    
};