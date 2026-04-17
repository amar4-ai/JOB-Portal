import jwt from 'jsonwebtoken'

const generateToken = (id) => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("Server configuration error: JWT_SECRET not found");
    }

    return jwt.sign({ id }, secret, {
        expiresIn: '30d'
    });
};

export default generateToken;