// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000; // The port your API will run on

// Middleware to parse JSON request bodies
app.use(express.json());

// Enable CORS for all origins (for local development)
// In a production environment, you would restrict this to your frontend's domain.
app.use(cors());

// A simple in-memory "database" to simulate hash balances
// In a real system, this would be a secure database like PostgreSQL, MongoDB, etc.
const simulatedBalances = {
    "65a6745f084e7af17e1715ae9302cc14820e331af610badd3d9805cb9cd3504e": 843973673468271827.00,
    "ca4ba96c58580a9d2ddbc99d993cf0a703c366c85f608a8d9d6b3890": 104072038102022288.00,
    "3842daf9315978e904e20579f52913aec3274e22b09c4fa9ddd2a2b7": 331832306422424247.00,
    "a23b0d1d1e8a721623a1a85b64a353fface595030eb41ba33d8fe4a554ee59d5": 433584416429004014.00,
    "dc5b25606dc0c977dec5aa13d61946b470066976aefcf390c40ffaff75d9a186": 304836019657602521.00,
    "8470faf251f8c3c8672718cbd982f942ce649bb69714794eb8b1de934cb59d52": 511219268553231541.00,
    "663e295cc4399e9a551571eebd7a4db0d6f3662c87eb18d0e0a2a4b67f07145c": 979986251455561479.00,
    "3fc8241058ee913bfe277e4652abc04822b33aa939d6f65084aae02e917eeff1": 737671459026407806.00,
    "d71d4b23cb2ec49e7b0ff31fd563b5ffdf4899dbecebd599711213ff37e52bd9": 566991529670817765.00,
    "c6f44160cdd0479af696b81abdd1982d36e08263322e4c5b07bf27b5623b29d5": 866792902670770747.00,
    "26efc86c0269a129bd183480f947c7424a48f9523156a8a70d3dfe5ed7103aab": 673006143246620432.00,
    "7c7228137410dc76b4925dfcc729fdc92cfd94a026022111c1a502d6240580fb": 362909002628211717.00,
    "029ff25d832b97b9d55fc93078dac6552a61be7a": 652314353930976890.00,
    "94e02b38274bfc81e66ea2e90f57f62faa2b5ae13e15bf89a3fc113881871e4e": 648327740574171527.00,
    "3e153176e6fcf704b9ebdb6cce4818ea6f276bcb42d4db72d6207df3434f3344": 106495142286541647.00,
    "b818d555523674878848476ee8ffc99cff1c95529e3cc450511672922a4a5736": 777193703470672458.00,
    "7f1c56bf38070c1637e6b0ce91fe5ab1ab8474be6dab8be2a3bf8eadb771e062": 925379479273846641.00,
    "c1e586cecb4f643611e882c6b3638f2d51a7b6ccd4f647c305351fccde94b9b4": 77288644914241172.00,
    "20f586474bf292d420bb8c5139bfb8224cda900280ffa2c95b45a33eb98e96cd": 240152579988175246.00
};

/**
 * Helper function to format a number as a currency string.
 * @param {number} amount - The numeric amount.
 * @returns {string} - Formatted currency string.
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// API Endpoint for simulated transfers
app.post('/api/initiate-transfer', (req, res) => {
    const { sourceHash, amount, targetAccount } = req.body;

    console.log(`Received simulated transfer request:`);
    console.log(`  Source Hash: ${sourceHash}`);
    console.log(`  Amount: ${amount}`);
    console.log(`  Target Account: ${targetAccount}`);

    // --- Basic Validation and Simulation Logic ---
    if (!sourceHash || !amount || !targetAccount) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields: sourceHash, amount, or targetAccount."
        });
    }

    // Simulate authentication/authorization (always succeeds for this demo)
    const isAuthenticated = true; // In a real system, verify tokens/credentials
    if (!isAuthenticated) {
        return res.status(401).json({
            success: false,
            message: "Authentication failed. Invalid credentials."
        });
    }

    // Check if the source hash exists in our simulated balances
    if (simulatedBalances[sourceHash] === undefined) {
        return res.status(404).json({
            success: false,
            message: `Source hash '${sourceHash}' not found in simulated accounts.`
        });
    }

    // Check for sufficient funds (simulated)
    if (simulatedBalances[sourceHash] < amount) {
        return res.status(400).json({
            success: false,
            message: `Insufficient funds for hash '${sourceHash}'. Current balance: ${formatCurrency(simulatedBalances[sourceHash])}`
        });
    }

    // Simulate the transfer process (deducting from source, adding to target)
    // For this demo, we'll just "deduct" from the source balance and log it.
    // In a real system, you'd update actual database records.
    simulatedBalances[sourceHash] -= amount;
    const transactionId = `SIM-TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    console.log(`  Simulated transfer successful! New balance for ${sourceHash}: ${formatCurrency(simulatedBalances[sourceHash])}`);
    console.log(`  Simulated Transaction ID: ${transactionId}`);

    // Send a success response
    res.status(200).json({
        success: true,
        message: "Simulated transfer successful.",
        transactionId: transactionId,
        newSourceBalance: formatCurrency(simulatedBalances[sourceHash]),
        timestamp: new Date().toISOString()
    });
});

// API Endpoint to get all simulated balances (useful for initial display)
app.get('/api/balances', (req, res) => {
    // Convert numeric balances back to formatted strings for the frontend
    const formattedBalances = Object.entries(simulatedBalances).map(([hash, balance]) => ({
        hash: hash,
        balance: formatCurrency(balance)
    }));
    res.status(200).json(formattedBalances);
});


// Start the server
app.listen(port, () => {
    console.log(`Simulated Bank API running at http://localhost:${port}`);
    console.log(`Access the frontend at http://localhost:8080 (or wherever you serve index.html)`);
    console.log(`Remember to run 'npm install express cors' in this directory first.`);
});

