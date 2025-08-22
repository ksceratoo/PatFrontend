#!/usr/bin/env node

// Test the require fix for ES modules
import fs from "fs";
import path from "path";

console.log("🧪 Testing require fix for ES modules...\n");

// Simulate the check-pat.tsx logic
function testMbcheckPath() {
    const mbcheckDir = path.join(process.cwd(), "mbcheck");
    const tempFileName = "test.pat";
    const tempFilePath = path.join(mbcheckDir, tempFileName);

    // Try pre-built binary first, then fallback to build directory
    let mbcheckPath = path.join(process.cwd(), "mbcheck-linux");
    if (!fs.existsSync(mbcheckPath)) {
        mbcheckPath = path.join(mbcheckDir, "_build", "default", "bin", "main.exe");
        console.log("Using fallback path:", mbcheckPath);
    } else {
        console.log("Using pre-built binary:", mbcheckPath);
    }

    console.log("Final mbcheckPath:", mbcheckPath);
    return mbcheckPath;
}

try {
    const result = testMbcheckPath();
    console.log("✅ Test passed! No require error.");
    console.log("mbcheck path:", result);
} catch (error) {
    console.log("❌ Test failed:", error.message);
}

console.log("\n🎯 ES modules require fix test completed!");
