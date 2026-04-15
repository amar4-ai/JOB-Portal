import jwt from 'jsonwebtoken'

const generateToken = (id) =>{
    return jwt.sign({id}, process.env.jWT_SECRET,{
        expiresIn:'30d'
    })
}

export default generateToken