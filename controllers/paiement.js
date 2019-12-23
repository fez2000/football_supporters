exports.status = (req, res) => {
    res.redirect(`/paiement/${req.params.status}`);
};

const paypal = require("@paypal/checkout-server-sdk");

// Creating an environment
const clientId =
    "ATPOXO5gEo-aL7_mCsyHbXmRvZ574dJxl7iJbvYvzrRR_0pvDW4eh09naeVMWbjOGE8MfvvwDGg7K5Ma";
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

// Construct a request object and set desired parameters

// 2. Set up your server to receive a call from the client
exports.payer = (req, res) => {
    // 3. Call PayPal to set up a transaction
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        intent: "CAPTURE",
        purchase_units: [
            {
                amount: {
                    currency_code: "USD",
                    value: req.body.amount
                }
            }
        ]
    });

    let order;
    try {
        client.execute(request).then(order => {
            res.status(200).json({
                orderID: order.result.id
            });
        });
    } catch (err) {
        // 4. Handle any errors from the call
        console.error(err);
        return res.send(500);
    }

    // 5. Return a successful response to the client with the order ID
};
