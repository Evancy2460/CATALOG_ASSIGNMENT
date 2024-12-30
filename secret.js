// Import necessary module for reading files
const fs = require('fs');

// Function to decode y value based on the base
function decodeValue(base, value) {
    return parseInt(value, base);
}

// Function to find the constant term using Lagrange Interpolation
function findConstantTerm(points) {
    let constantTerm = 0;

    for (let i = 0; i < points.length; i++) {
        let xi = points[i].x;
        let yi = points[i].y;

        // Calculate the product term for Lagrange basis polynomial
        let product = yi;
        for (let j = 0; j < points.length; j++) {
            if (i !== j) {
                let xj = points[j].x;
                product *= xj / (xj - xi);
            }
        }

        constantTerm += product;
    }

    return Math.round(constantTerm); // Ensure it's an integer
}

// Main function to read JSON and calculate the secret
function findSecretFromJSON(jsonFile) {
    // Read and parse the JSON file
    const data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

    const n = data.keys.n;
    const k = data.keys.k;

    // Ensure the number of provided points is valid
    if (n < k) {
        throw new Error("Not enough points to solve the polynomial.");
    }

    const points = [];

    // Decode the provided points
    for (const key in data) {
        if (key === "keys") continue;

        const x = parseInt(key);
        const base = parseInt(data[key].base);
        const y = decodeValue(base, data[key].value);

        points.push({ x, y });
    }

    // Sort the points by x (optional, but helpful for consistency)
    points.sort((a, b) => a.x - b.x);

    // Use the first k points to find the constant term
    const selectedPoints = points.slice(0, k);
    return findConstantTerm(selectedPoints);
}

// Process both test cases
try {
    const secret1 = findSecretFromJSON('t1.json'); // First JSON file
    console.log("The secret constant (c) for t1.json is:", secret1);

    const secret2 = findSecretFromJSON('t2.json'); // Second JSON file
    console.log("The secret constant (c) for t2.json is:", secret2);
} catch (error) {
    console.error("Error:", error.message);
}