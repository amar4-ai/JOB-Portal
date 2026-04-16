import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // Vercel provides raw body - handle both string and object
        const payload = req.body;
        const payloadString = Buffer.isBuffer(payload)
            ? payload.toString('utf8')
            : typeof payload === 'string'
                ? payload
                : JSON.stringify(payload);

        // Verify webhook signature
        await whook.verify(payloadString, {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });

        // Parse the payload
        const { data, type } = typeof payload === 'string' || Buffer.isBuffer(payload)
            ? JSON.parse(payloadString)
            : payload;

        switch (type) {
            case 'user.created': {
                const userData = {
                    _id: data.id,
                
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Anonymous',
                    image: data.image_url,
                    resume: ''
                };

                console.log("👉 Data to insert:", userData);
                await User.create(userData);
                console.log("User created in DB");
                break;
            }

            case 'user.updated': {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Anonymous',
                    image: data.image_url,
                };

                await User.findByIdAndUpdate(data.id, userData);
                console.log("User updated in DB");
                break;
            }

            case 'user.deleted': {
                await User.findByIdAndDelete(data.id);
                console.log("User deleted from DB");
                break;
            }

            default:

        }

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error("Webhook Error:", error.message);
        console.error("Full Error:", error);

        // Return 400 so Clerk knows it failed and will retry
        return res.status(400).json({
            success: false,
            error: error.message
        });
    }
};