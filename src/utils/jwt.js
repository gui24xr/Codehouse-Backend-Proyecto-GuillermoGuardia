import jwt from 'jsonwebtoken'

//Estas 2luego vendran de env
const SECRET_TOKEN_KEY = process.env.SECRET_TOKEN_KEY //'coderhouse'
const EXPIRES_TOKEN_TIME = process.env.EXPIRES_TOKEN_TIME
//Genera y devuelve un token con la data enviada por parametro
//Recibe un objeto
function generateJWT(userData){
    return jwt.sign({user: userData},SECRET_TOKEN_KEY,{expiresIn:EXPIRES_TOKEN_TIME})
}

export {generateJWT}