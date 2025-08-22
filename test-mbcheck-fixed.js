#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { access } from 'fs/promises';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Test the fixed mbcheck path
const mbcheckPath = path.join(process.cwd(), "mbcheck", "_build", "default", "bin", "main.exe");

console.log('🧪 Testing fixed mbcheck path...\n');
console.log(`Expected path: ${mbcheckPath}`);

try {
    console.log('1. Checking mbcheck executable...');
    await access(mbcheckPath, fs.constants.X_OK);
    console.log('   ✅ mbcheck executable found and executable');

    // Get file stats
    const stats = fs.statSync(mbcheckPath);
    console.log(`   File size: ${stats.size} bytes`);
    console.log(`   Permissions: ${stats.mode.toString(8)}`);

} catch (error) {
    console.log('   ❌ mbcheck executable not found or not executable');
    console.log(`   Error: ${error.message}`);
}

console.log('\n🎯 Path test completed.');
