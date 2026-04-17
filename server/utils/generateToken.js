const generateToken = (id) => {
    console.log("JWT_SECRET in generateToken:", process.env.JWT_SECRET ? "✅ Present" : "❌ MISSING!");

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is missing in environment variables");
    }

    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};