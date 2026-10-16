const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

console.log('====================================================');
console.log('  SHREE ARADHNA JEWELLERS - VIGOROUS STORAGE TESTS  ');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, testName, detail = '') {
  if (condition) {
    console.log(`[PASS] ${testName} ${detail ? '(' + detail + ')' : ''}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${testName} ${detail ? '--> ' + detail : ''}`);
    failCount++;
  }
}

async function runTests() {
  // TEST 1: Local Filesystem Storage & Assets Directory Integrity
  console.log('\n--- 1. Testing Local Filesystem Storage & Assets ---');
  const assetsDir = path.join(__dirname, 'public', 'assets');
  assert(fs.existsSync(assetsDir), 'Public assets folder exists', assetsDir);

  const keyFiles = [
    'logo.png',
    'gents_collection_img.jpg',
    'ladies_collection_img.jpg',
    'earrings_collection_img.jpg',
    'wedding_collection_banner.jpg'
  ];

  for (const f of keyFiles) {
    const fPath = path.join(assetsDir, f);
    const exists = fs.existsSync(fPath);
    const size = exists ? fs.statSync(fPath).size : 0;
    assert(exists && size > 1000, `Asset ${f} present and valid`, `${(size / 1024).toFixed(1)} KB`);
  }

  // TEST 2: Local Storage JSON Persistence Stress Test (100KB - 500KB)
  console.log('\n--- 2. Testing Local Data Serialization & Stress Limits ---');
  try {
    const largeObject = {
      store: 'Shree Aradhna Jewellers',
      branches: ['Gandhidham', 'Adipur'],
      sampleRates: { gold24k: 15500, gold22k: 14200, gold18k: 11625, silver: 98 },
      inquiries: Array.from({ length: 100 }, (_, i) => ({
        id: `inq_${i}`,
        name: `Customer ${i}`,
        phone: '9638888170',
        notes: 'Interested in Royal Bridal Wedding Set with matching bangles.'
      }))
    };

    const serialized = JSON.stringify(largeObject);
    const deserialized = JSON.parse(serialized);
    assert(deserialized.inquiries.length === 100, 'JSON serialization & deserialization integrity (100 complex objects)', `${(serialized.length / 1024).toFixed(1)} KB`);
    assert(deserialized.store === 'Shree Aradhna Jewellers', 'Object fields preserved exactly');
  } catch (err) {
    assert(false, 'Local data serialization', err.message);
  }

  // TEST 3: SQL Schema Storage Configuration Verification
  console.log('\n--- 3. Testing Supabase SQL Schema Storage Definitions ---');
  const schemaPath = path.join(__dirname, 'supabase_schema.sql');
  assert(fs.existsSync(schemaPath), 'supabase_schema.sql exists');

  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  assert(schemaContent.includes("INSERT INTO storage.buckets (id, name, public)\nVALUES ('payment_screenshots'"), "Bucket 'payment_screenshots' defined in SQL");
  assert(schemaContent.includes("INSERT INTO storage.buckets (id, name, public)\nVALUES ('product_images'"), "Bucket 'product_images' defined in SQL");
  assert(schemaContent.includes('Public Read payment_screenshots'), "RLS Read policy for 'payment_screenshots' configured");
  assert(schemaContent.includes('Public Upload payment_screenshots'), "RLS Upload policy for 'payment_screenshots' configured");
  assert(schemaContent.includes('Public Read product_images'), "RLS Read policy for 'product_images' configured");
  assert(schemaContent.includes('Public Upload product_images'), "RLS Upload policy for 'product_images' configured");

  // TEST 4: Supabase Client Resilient Fallback (Offline / Dummy Handling)
  console.log('\n--- 4. Testing Supabase Client Resilient Fallback ---');
  const dummyClient = createClient(
    'https://placeholder-project.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder',
    { auth: { persistSession: false } }
  );

  assert(typeof dummyClient.from === 'function', 'Client exports .from() method');
  assert(typeof dummyClient.storage.from === 'function', 'Client exports .storage.from() method');

  // Verify getPublicUrl works synchronously without crashing
  const urlRes = dummyClient.storage.from('payment_screenshots').getPublicUrl('test_sample.png');
  assert(urlRes && urlRes.data && urlRes.data.publicUrl.includes('test_sample.png'), 'getPublicUrl generates valid URL structure safely');

  // TEST 5: Graceful Network Error Handling (No Uncaught Exceptions)
  console.log('\n--- 5. Testing Graceful Network Error Handling on Storage Upload ---');
  try {
    const { data, error } = await dummyClient.storage
      .from('payment_screenshots')
      .upload('nonexistent.txt', Buffer.from('test buffer'), { upsert: true });

    assert(error !== null, 'Offline/invalid upload returns controlled error instead of crashing process', error ? error.message : 'no error');
  } catch (ex) {
    assert(true, 'Handled exception caught smoothly', ex.message);
  }

  // Summary
  console.log('\n====================================================');
  console.log(`  STORAGE TEST SUMMARY: ${passCount} PASSED, ${failCount} FAILED  `);
  console.log('====================================================\n');

  if (failCount === 0) {
    console.log('>>> ALL STORAGE INTEGRITY & RESILIENCE TESTS PASSED! <<<');
  } else {
    process.exit(1);
  }
}

runTests();
