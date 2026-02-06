
/**
 * Sends a WhatsApp message via Fonnte API.
 *
 * @param target - The phone number to send the message to (e.g., '08123456789').
 * @param message - The text content of the message.
 * @returns Object containing status and detail of the operation.
 */
export async function sendWhatsApp(target: string, message: string) {
    // Check for mock token or missing token to prevent unnecessary API calls in dev
    if (!process.env.FONNTE_TOKEN || process.env.FONNTE_TOKEN === "mock-token") {
        console.log(`[MOCK FONNTE] Sending to ${target}: ${message}`)
        return { status: true, detail: "Mock success" }
    }

    try {
        const response = await fetch('https://api.fonnte.com/send', {
            method: 'POST',
            headers: {
                'Authorization': process.env.FONNTE_TOKEN!,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                target,
                message,
                countryCode: '62' // Default country code for Indonesia
            })
        })

        const result = await response.json()
        if (!result.status) {
            console.error('[FONNTE ERROR]', result)
        }
        return result

    } catch (error) {
        console.error('[FONNTE EXCEPTION]', error)
        return { status: false, detail: "Exception" }
    }
}
