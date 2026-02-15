const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, text, html) => {
    console.log("Resend Service Attempt:", {
        apiKey: process.env.RESEND_API_KEY ? "DETECTED" : "MISSING",
        to
    });

    if (!process.env.RESEND_API_KEY) {
        throw new Error("Missing RESEND_API_KEY environment variable");
    }

    try {
        const { data, error } = await resend.emails.send({
            from: "onboarding@resend.dev",
            to,
            subject,
            text,
            html,
        });

        if (error) {
            console.error("Resend API Error:", error);
            throw new Error(error.message);
        }

        console.log("Email sent successfully via Resend:", data.id);
        return data;
    } catch (error) {
        console.error("Resend execution error:", error);
        throw error;
    }
};

module.exports = { sendEmail };
