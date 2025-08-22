#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { writeFile, unlink } from 'fs/promises';

const execAsync = promisify(exec);

async function testMbcheckExecution() {
    console.log('🧪 Testing mbcheck execution with fixed command...\n');

    const tempFileName = 'test_execution.pat';
    const mbcheckDir = path.join(process.cwd(), 'mbcheck');
    const tempFilePath = path.join(mbcheckDir, tempFileName);
    const mbcheckPath = path.join(mbcheckDir, '_build', 'default', 'bin', 'main.exe');

    try {
        // Create a simple test Pat file
        const testCode = `interface Test {
    Hello(String)
}

def main(): Unit {
    print("Hello, Pat!")
}`;

        await writeFile(tempFilePath, testCode, 'utf8');
        console.log('✅ Test file created');

        // Test the execution command
        const command = `cd "${mbcheckDir}" && ./_build/default/bin/main.exe "${tempFileName}" -v`;
        console.log(`Executing: ${command}`);

        const { stdout, stderr } = await execAsync(command, {
            timeout: 10000
        });

        console.log('✅ Command executed successfully!');
        console.log('📄 Output:');
        console.log(stdout);

        if (stderr) {
            console.log('⚠️  Stderr:');
            console.log(stderr);
        }

        // Clean up
        await unlink(tempFilePath);
        console.log('✅ Test file cleaned up');

    } catch (error) {
        console.log('❌ Execution failed:');
        console.log(`Error: ${error.message}`);
        console.log(`Code: ${error.code}`);

        // Clean up on error
        try {
            await unlink(tempFilePath);
        } catch { }
    }
}

testMbcheckExecution();
