export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { amount, plan } = body;

        if (!amount || typeof amount !== 'number') {
            return Response.json(
                { error: 'Amount is required and must be a number.' },
                { status: 400 }
            );
        }

        const secretKey = process.env.STRIPE_SECRET_KEY;

        if (!secretKey) {
            console.error('Stripe Secret Key is missing in environment variables.');
            return Response.json(
                { error: 'Stripe backend is misconfigured. Secret key is missing.' },
                { status: 500 }
            );
        }

        // Call Stripe Payment Intents API directly via fetch
        const stripeResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${secretKey}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                amount: amount.toString(),
                currency: 'usd',
                'automatic_payment_methods[enabled]': 'true',
                description: `Photo App Subscription: ${plan ? plan.toUpperCase() : 'Upgrade'}`,
            }).toString(),
        });

        const data = await stripeResponse.json();

        if (!stripeResponse.ok) {
            console.error('Stripe API error:', data);
            return Response.json(
                { error: data.error?.message || 'Failed to create Payment Intent with Stripe.' },
                { status: stripeResponse.status }
            );
        }

        return Response.json({
            clientSecret: data.client_secret,
        });
    } catch (error: any) {
        console.error('API Route error:', error);
        return Response.json(
            { error: error?.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
