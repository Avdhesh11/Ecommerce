import jwt from 'jsonwebtoken'


//@desc - jwt helps us to allow users to access the protected pages(which only can be accessed after login)
const generateToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET, {
        expiresIn:'30d'
    }) 
}

export default generateToken