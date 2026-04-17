import jwt from 'jsonwebtoken'

const generateToken = (id) => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        console.error("❌ JWT_SECRET is missing or empty in environment variables!");
        // Do NOT throw here in production – it crashes the function
        // Instead, return a clear error or let the caller handle it
        throw new Error("Server configuration error: JWT_SECRET not found");
    }

    console.log("✅ JWT_SECRET loaded successfully (length:", secret.length, ")");

    return jwt.sign({ id }, secret, {
        expiresIn: '30d'
    });
};

export default generateToken;