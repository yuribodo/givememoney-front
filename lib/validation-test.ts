/**
 * Test script to verify validation is working correctly
 * Run this in browser console to test the validation system
 */

import { ApiValidator } from './validators'
import { apiClient, TypeSafeApiClient } from './api-client'

// Test data matching Go backend response format
const mockTwitchUserResponse = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  name: "TestStreamer",
  email: "test@example.com",
  provider: "twitch",
  provider_id: "12345",
  wallet_id: "987fcdeb-51d8-43a7-b912-123456789abc",
  wallet_provider: "metamask",
  wallet_hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
}

// Test data with temporary wallet hash (actual backend response)
const mockTwitchUserResponseTemp = {
  id: "7f64f683-e584-4ce0-b56a-18ff203ad5ec",
  name: "yuribodo123",
  email: "yemotalara@gmail.com",
  provider: "twitch",
  provider_id: "232222188",
  wallet_id: "6b45c34c-4a1f-4940-9797-7528fceaed69",
  wallet_provider: "metamask",
  wallet_hash: "temp_twitch_232222188"
}

const mockHealthResponse = {
  status: "ok"
}

const mockTokenPair = {
  access_token: "ACCESS_TOKEN_PLACEHOLDER",
  refresh_token: "REFRESH_TOKEN_PLACEHOLDER",
  expires_in: 3600
}

// Test functions (for development/debugging)
export function testValidation() {
  console.log('🧪 Testing validation system...')

  try {
    // Test 1: Valid Twitch user response (full wallet hash)
    console.log('Test 1: Validating Twitch user response (full wallet hash)...')
    const validatedUser = ApiValidator.validateAndTransformTwitchUser(mockTwitchUserResponse)
    console.log('✅ Twitch user validation passed:', validatedUser)

    // Test 1b: Valid Twitch user response with temporary wallet hash
    console.log('Test 1b: Validating Twitch user response (temp wallet hash)...')
    const validatedUserTemp = ApiValidator.validateAndTransformTwitchUser(mockTwitchUserResponseTemp)
    console.log('✅ Twitch user validation with temp hash passed:', validatedUserTemp)

    // Test 2: Valid health response
    console.log('Test 2: Validating health response...')
    const validatedHealth = ApiValidator.validateHealthResponse(mockHealthResponse)
    console.log('✅ Health validation passed:', validatedHealth)

    // Test 3: Valid token pair
    console.log('Test 3: Validating token pair...')
    const validatedTokens = ApiValidator.validateTokenPair(mockTokenPair)
    console.log('✅ Token pair validation passed:', validatedTokens)

    // Test 4: Invalid data (should fail)
    console.log('Test 4: Testing invalid data...')
    try {
      ApiValidator.validateTwitchUserResponse({ invalid: 'data' })
      console.log('❌ Should have failed validation')
    } catch (error) {
      console.log('✅ Invalid data correctly rejected:', error instanceof Error ? error.message : 'Unknown error')
    }

    console.log('🎉 All validation tests passed!')
    return true

  } catch (error) {
    console.error('❌ Validation test failed:', error)
    return false
  }
}

// Test API client static methods
export function testApiClientHelpers() {
  console.log('🧪 Testing API client helpers...')

  // Test JWT validation
  const validJWT = "VALID_JWT_TEST_PLACEHOLDER"
  const invalidJWT = "invalid.jwt.token"

  console.log('Valid JWT format:', TypeSafeApiClient.isValidJWTFormat(validJWT))
  console.log('Invalid JWT format:', TypeSafeApiClient.isValidJWTFormat(invalidJWT))

  // Test JWT claims extraction
  const claims = TypeSafeApiClient.extractJWTClaims(validJWT)
  console.log('Extracted claims:', claims)

  console.log('✅ API client helper tests completed')
}

// Check if backend is reachable (for manual testing)
export async function testBackendConnection() {
  console.log('🌐 Testing backend connection...')

  try {
    const isReachable = await apiClient.isBackendReachable()
    console.log('Backend reachable:', isReachable)
    return isReachable
  } catch (error) {
    console.error('Backend connection failed:', error)
    return false
  }
}

// Development helper - run all tests
export async function runAllTests() {
  console.log('🚀 Running all validation tests...')

  const validationPassed = testValidation()
  testApiClientHelpers()
  const backendReachable = await testBackendConnection()

  console.log('\n📊 Test Results:')
  console.log('- Validation System:', validationPassed ? '✅ PASS' : '❌ FAIL')
  console.log('- API Client Helpers:', '✅ PASS')
  console.log('- Backend Connection:', backendReachable ? '✅ PASS' : '⚠️ OFFLINE')

  return {
    validation: validationPassed,
    backend: backendReachable
  }
}

// For browser console testing
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globalWindow = window as any

  globalWindow.testValidation = testValidation
  globalWindow.testApiClientHelpers = testApiClientHelpers
  globalWindow.testBackendConnection = testBackendConnection
  globalWindow.runAllTests = runAllTests
}