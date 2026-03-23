const { Resend } = require("resend");

const getResendClient = () => {
    const { RESEND_API_KEY } = process.env;

    if (!RESEND_API_KEY) {
        return null;
    }

    return new Resend(RESEND_API_KEY);
};

const sendPasswordResetEmail = async ({ to, resetLink, resetToken }) => {
    const resend = getResendClient();

    if (!resend) {
        if (process.env.NODE_ENV !== "production") {
            console.log(`Password reset for ${to}: ${resetLink}`);
            return { delivered: false, fallback: true };
        }

        throw new Error("Resend is not configured");
    }

    const from = process.env.EMAIL_FROM || "onboarding@resend.dev";

    await resend.emails.send({
        from,
        to,
        subject: "Reset your Actio AI password",
        text: `Use this reset link to change your password: ${resetLink}\n\nIf the link does not open, use this reset token: ${resetToken}`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>Reset your Actio AI password</h2>
              <p>Click the link below to set a new password:</p>
              <p><a href="${resetLink}">${resetLink}</a></p>
              <p>If the link does not open, use this reset token:</p>
              <p><strong>${resetToken}</strong></p>
              <p>This link expires in 15 minutes.</p>
            </div>
        `
    });

    return { delivered: true, fallback: false };
};

module.exports = {
    sendPasswordResetEmail
};
