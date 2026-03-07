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
            req.write(JSON.stringify(data));
        }
        req.end();
    });
};

async function run() {
    console.log("--- PHASE 1: Live API Recon & Auth Testing ---");
    
    // 1. Register Retail Outlet
    console.log("Registering Retail Outlet...");
    let res = await request({
        hostname: 'localhost', port: 5000, path: '/api/auth/register', method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, {
        name: 'Pentest Outlet', email: 'pentest_outlet@test.com', password: 'pentest123',
        shopName: 'Pentest Shop', address: { street: '123 Pen St', cityState: 'Pentown, PT', zipCode: '123456' }
    });
    console.log(`Status: ${res.status}`);
    
    // 2. Login to extract JWT
    console.log("Logging in Retail Outlet...");
    res = await request({
        hostname: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, { email: 'pentest_outlet@test.com', password: 'pentest123' });
    
    console.log(`Login Status: ${res.status}`);
    const token = res.data.token;
    if (!token) {
        console.error("Failed to get token", res.data);
        return;
    }

    // 3. Attempt Auth Bypass on GET /api/admin/orders
    console.log("Testing No Token...");
    res = await request({
        hostname: 'localhost', port: 5000, path: '/api/admin/orders', method: 'GET'
    });
    console.log(`No Token Status: ${res.status} - ${JSON.stringify(res.data)}`);

    console.log("Testing Invalid Token...");
    res = await request({
        hostname: 'localhost', port: 5000, path: '/api/admin/orders', method: 'GET',
        headers: { 'Authorization': 'Bearer invalid.token.here' }
    });
    console.log(`Invalid Token Status: ${res.status} - ${JSON.stringify(res.data)}`);

    console.log("Testing RetailOutlet Token on Admin Route...");
    res = await request({
        hostname: 'localhost', port: 5000, path: '/api/admin/orders', method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`Retail Token on Admin Route Status: ${res.status} - ${JSON.stringify(res.data)}`);
}

run().catch(console.error);
