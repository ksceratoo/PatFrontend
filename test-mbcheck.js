#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Testing mbcheck setup...\n');

// Check if mbcheck executable exists
const mbcheckPath = path.join(__dirname, 'patCom', 'paterl', 'mbcheck', 'mbcheck');

try {
    console.log('1. Checking mbcheck executable...');
    if (fs.existsSync(mbcheckPath)) {
        console.log('   ✅ mbcheck executable found');

        // Check permissions
        const stats = fs.statSync(mbcheckPath);
        const isExecutable = !!(stats.mode & parseInt('111', 8));
        console.log(`   ${isExecutable ? '✅' : '❌'} Executable permissions: ${isExecutable ? 'OK' : 'Missing'}`);

        // Try to run mbcheck with a simple test file
        try {
            // Create a temporary test file
            const testFilePath = path.join(__dirname, 'temp_test.pat');
            const testCode = 'def main(): Unit { print("Hello") }';
            fs.writeFileSync(testFilePath, testCode);

            const result = execSync(`"${mbcheckPath}" "${testFilePath}"`, { timeout: 5000, encoding: 'utf8' });
            console.log('   ✅ mbcheck execution test passed');
            console.log(`   Output: ${result.substring(0, 100)}...`);

            // Clean up
            fs.unlinkSync(testFilePath);
        } catch (error) {
            console.log('   ❌ mbcheck execution test failed');
            console.log(`   Error: ${error.message}`);
        }

    } else {
        console.log('   ❌ mbcheck executable not found');
    }

} catch (error) {
    console.log('   ❌ Error checking mbcheck:', error.message);
}

// Check environment
console.log('\n2. Environment check...');
console.log(`   Vercel environment: ${process.env.VERCEL ? '✅ Yes' : '❌ No'}`);
console.log(`   AWS Lambda: ${process.env.AWS_LAMBDA_FUNCTION_NAME ? '✅ Yes' : '❌ No'}`);

// Test API endpoint simulation
console.log('\n3. API compatibility test...');
const testCode = `interface Test { Hello(String) }
def main(): Unit {
  print("Hello, Pat!")
}`;

try {
    const response = await fetch('http://localhost:5173/api/check-pat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: testCode })
    });

    if (response.ok) {
        const result = await response.json();
        console.log('   ✅ API endpoint accessible');
        console.log(`   Success: ${result.success}`);
        console.log(`   Summary: ${result.summary}`);
    } else {
        console.log('   ❌ API endpoint error:', response.status);
    }
} catch (error) {
    console.log('   ❌ API test failed (server may not be running)');
    console.log(`   Error: ${error.message}`);
}

console.log('\n🎯 Test completed. Check results above for any issues.');
