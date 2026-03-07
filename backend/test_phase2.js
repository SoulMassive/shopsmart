const http = require('http');

const request = (options, data) => {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(body || '{}') });
                } catch(e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });
        req.on('error', reject);
        if (data) {
            req.write(typeof data === 'string' ? data : JSON.stringify(data));
        }
        req.end();
    });
};

async function run() {
    console.log("--- PHASE 1 Retry: Checking correct admin route ---");
    let res = await request({
        hostname: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, { email: 'pentest_outlet@test.com', password: 'pentest123' });
    const token = res.data.token;

    console.log("Testing RetailOutlet Token on GET /api/admin/users...");
    res = await request({
        hostname: 'localhost', port: 5000, path: '/api/admin/users', method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`Retail Token on /admin/users Status: ${res.status}`); // Should be 403

    console.log("\n--- PHASE 2: Live OWASP & Payload Injection Attacks ---");
    
    // 1. NoSQL Injection
    console.log("1. NoSQL Injection Login...");
    res = await request({
        hostname: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, { email: { "$gt": "" }, password: { "$gt": "" } });
    console.log(`NoSQL Status: ${res.status}`);

    // 2. Insecure Business Logic (Zero-Price)
    console.log("2. Insecure Business Logic (Zero-Price) Checkout...");
    // Let's get the user ID first
    res = await request({
        hostname: 'localhost', port: 5000, path: '/api/auth/me', method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const userId = res.data._id;
    const outletId = res.data.outletId || "6123456789abcdef12345678"; // Mock outlet

    // Attempt zero-price post
    res = await request({
        hostname: 'localhost', port: 5000, path: '/api/orders', method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    }, {
        orderNumber: 'PEN-001',
        outletId: outletId,
        shippingAddress: { street: 'Pen St', city: 'Pen', state: 'PT', zipCode: '111111' },
        items: [],
        itemCount: 1,
        subtotal: 0,
        totalAmount: 0
    });
    console.log(`Zero-Price Order Status: ${res.status}`);
    if (res.status === 201) console.log(`Result: Server Accepted Zero-Price Order!`);

    // 3. Payload DoS Test
    console.log("3. Payload DoS Test (10MB JSON string)...");
    const massivePayload = '{"email":"' + 'A'.repeat(10 * 1024 * 1024) + '"}';
    const start = Date.now();
    res = await request({
        hostname: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, massivePayload);
    const time = Date.now() - start;
    console.log(`Payload Status: ${res.status} in ${time}ms`);
}

run().catch(console.error);
