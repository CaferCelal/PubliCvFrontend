// services/contact.tsx
import Config from "./config";

interface ContactResponse {
    status: number;
    data?: string;
}

const ContactServices = {
    sendContactMessage(
        firstName: string,
        lastName: string,
        email: string,
        message: string
    ): Promise<ContactResponse> {
        return fetch(`${Config.DOMAIN}/contact-us`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ firstName, lastName, email, message }),
        }).then(async (res) => {
            const responseText = await res.text();
            const data = responseText ? JSON.parse(responseText) : undefined;

            // Always return status, include data if available
            return { status: res.status, data };
        }).catch((err) => {
            // If fetch itself fails (network error)
            return { status: 0, data: err.message };
        });
    },
};

export default ContactServices;
