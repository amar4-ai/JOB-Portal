import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // Convert Buffer to string for Svix verification
        const payload = Buffer.isBuffer(req.body) 
            ? req.body.toString('utf8') 
            : JSON.stringify(req.body);
        
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        console.log("Headers received:", headers);
        console.log("Payload type:", typeof payload);

        // Verify the webhook
        const event = whook.verify(payload, headers);
        const { data, type } = event;

        console.log("✅ Webhook verified! Event type:", type);
        console.log("User ID:", data.id);

        switch (type) {
            case 'user.created': {
                console.log("Processing user.created event");
                const exists = await User.findById(data.id);

                if (!exists) {
                    const newUser = await User.create({
                        _id: data.id,
                        email: data.email_addresses?.[0]?.email_address || "",
                        name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                        image: data.image_url || "",
                        resume: ''
                    });
                    console.log("✅ User created in DB:", newUser._id);
                } else {
                    console.log("ℹ️ User already exists");
                }
                break;
            }

            case 'user.updated': {
                console.log("Processing user.updated event");
                const updated = await User.findByIdAndUpdate(
                    data.id,
                    {
                        email: data.email_addresses?.[0]?.email_address || "",
                        name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                        image: data.image_url || "",
                    },
                    { new: true }
                );
                console.log("✅ User updated:", updated?._id);
                break;
            }

            case 'user.deleted': {
                console.log("Processing user.deleted event");
                await User.findByIdAndDelete(data.id);
                console.log("✅ User deleted:", data.id);
                break;
            }

            default:
                console.log("⚠️ Unhandled event type:", type);
        }

        return res.status(200).json({ success: true, message: "Webhook processed" });

    } catch (error) {
        console.error("❌ Webhook Error:", error.message);
        console.error("Error stack:", error.stack);
        
        return res.status(400).json({ 
            success: false, 
            error: error.message,
            details: error.stack 
        });
    }
};