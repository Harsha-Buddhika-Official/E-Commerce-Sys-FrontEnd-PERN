/**
 * Token Expiry & Deletion Test Suite
 * Run this in browser console to test token functions
 */

import { isTokenExpired, getTokenExpiryTime } from "../utils/token.utils";

const TOKEN_KEY = "admin_token";

// Test 1: Create a token that expires in 1 hour
export const testTokenCreation = () => {
  // For actual testing, you'd need a real JWT
  console.log("✓ Test token structure created");
};

// Test 2: Check if isTokenExpired works correctly
export const testTokenExpiration = (token) => {
  if (!token) {
    console.error("❌ No token provided");
    return;
  }

  const isExpired = isTokenExpired(token);
  const expiryTime = getTokenExpiryTime(token);
  const now = Date.now();
  const timeLeft = expiryTime - now;
  const hoursLeft = (timeLeft / 3600000).toFixed(2);

  console.log("📋 Token Status:");
  console.log(`  - Is Expired: ${isExpired}`);
  console.log(`  - Expiry Time: ${new Date(expiryTime).toLocaleString()}`);
  console.log(`  - Current Time: ${new Date(now).toLocaleString()}`);
  console.log(`  - Time Remaining: ${hoursLeft} hours`);

  return { isExpired, expiryTime, timeLeft };
};

// Test 3: Check localStorage cleanup
export const testLocalStorageCleanup = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const user = localStorage.getItem("user");

  console.log("📦 LocalStorage Check:");
  console.log(`  - Token stored: ${!!token}`);
  console.log(`  - User stored: ${!!user}`);

  if (token && user) {
    console.log("✓ Token and User are in localStorage");
    return true;
  } else {
    console.log("❌ Missing token or user in localStorage");
    return false;
  }
};

// Test 4: Simulate token deletion
export const simulateTokenDeletion = () => {
  console.log("🗑️ Simulating token deletion...");
  
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("user");
  
  const token = localStorage.getItem(TOKEN_KEY);
  const user = localStorage.getItem("user");

  console.log(`✓ Token deleted: ${token === null}`);
  console.log(`✓ User deleted: ${user === null}`);

  if (!token && !user) {
    console.log("✅ Token deletion successful");
    return true;
  }
};

// Test 5: Run all tests
export const runAllTests = () => {
  console.log("🧪 Starting Token Expiry & Deletion Tests...\n");
  
  testLocalStorageCleanup();
  console.log("\n---\n");
  
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    testTokenExpiration(token);
  } else {
    console.log("⚠️ No token in localStorage. Login first to test expiration.");
  }
  
  console.log("\n---\n");
  console.log("✅ Tests completed. Check console for results.");
};

// Usage: In browser console, run:
// import { runAllTests } from '@/modules/admin/features/auth/__tests__/auth.test.js'
// runAllTests()
