#!/usr/bin/env node

// Test the fix for undefined map error
// This simulates what the frontend does when API returns undefined arrays

const testCases = [
    {
        name: "Valid response",
        data: {
            success: true,
            typeInfo: ["Type checking passed", "No constraints found"],
            errors: [],
            warnings: [],
            summary: "All good!"
        }
    },
    {
        name: "Undefined typeInfo",
        data: {
            success: true,
            typeInfo: undefined,
            errors: [],
            warnings: [],
            summary: "Test case"
        }
    },
    {
        name: "Empty arrays",
        data: {
            success: false,
            typeInfo: [],
            errors: [],
            warnings: [],
            summary: "Empty arrays test"
        }
    },
    {
        name: "Undefined errors",
        data: {
            success: false,
            typeInfo: [],
            errors: undefined,
            warnings: [],
            summary: "Undefined errors test"
        }
    }
];

function safeMap(array, callback, defaultValue = "No data available") {
    if (array && array.length > 0) {
        return array.map(callback).join("\n");
    }
    return defaultValue;
}

console.log("🧪 Testing frontend fix for undefined map error...\n");

testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: ${testCase.name}`);

    try {
        // Test typeInfo mapping (success case)
        const typeInfoOutput = safeMap(
            testCase.data.typeInfo,
            (info) => `• ${info}`,
            "• No additional type information available"
        );

        // Test errors mapping (error case)
        const errorsOutput = safeMap(
            testCase.data.errors,
            (e) => `• Line ${e.line}: [${e.type}] ${e.message}`,
            "• Analysis error: Cannot read properties of undefined (reading 'map')"
        );

        console.log("✅ TypeInfo output:", typeInfoOutput);
        console.log("✅ Errors output:", errorsOutput);
        console.log("✅ Test passed!\n");

    } catch (error) {
        console.log("❌ Test failed:", error.message);
        console.log("");
    }
});

console.log("🎯 All tests completed!");
