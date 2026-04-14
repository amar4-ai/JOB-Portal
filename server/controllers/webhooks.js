import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        const payload = req.body;
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        const event = whook.verify(payload, headers);

        const { data, type } = event;

        console.log("Webhook event:", type);

        switch (type) {
            case 'user.created': {
                const exists = await User.findById(data.id);

                if (!exists) {
                    await User.create({
                        _id: data.id,
                        email: data.email_addresses?.[0]?.email_address || "",
                        name: `${data.first_name || ""} ${data.last_name || ""}`,
                        image: data.image_url || "",
                        resume: ''
                    });
                }
                break;
            }

            case 'user.updated': {
                await User.findByIdAndUpdate(data.id, {
                    email: data.email_addresses?.[0]?.email_address || "",
                    name: `${data.first_name || ""} ${data.last_name || ""}`,
                    image: data.image_url || "",
                });
                break;
            }

            case 'user.deleted': {
                await User.findByIdAndDelete(data.id);
                break;
            }
        }

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error("Webhook Error:", error.message);
        return res.status(400).json({ success: false });
    }
};