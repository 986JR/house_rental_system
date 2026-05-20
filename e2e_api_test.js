const BASE_URL = 'http://localhost:8080/api/v1';

async function runTests() {
  console.log('🚀 Starting RentalHub End-to-End System Testing...\n');
  let testCount = 0;
  let successCount = 0;

  function assert(condition, message) {
    testCount++;
    if (condition) {
      successCount++;
      console.log(` ✅ PASS: ${message}`);
    } else {
      console.error(` ❌ FAIL: ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  try {
    // ----------------------------------------------------
    // 1. Guest Flow
    // ----------------------------------------------------
    console.log('--- 1. Guest Flow ---');
    const guestPropsRes = await fetch(`${BASE_URL}/properties`);
    assert(guestPropsRes.status === 200, 'Guest can retrieve properties list (Status 200)');
    const guestProps = await guestPropsRes.json();
    assert(guestProps && guestProps.content && guestProps.content.length > 0, 'Properties content list has seeded listings');
    console.log(`Found ${guestProps.content.length} properties for guest.`);
    const penthouse = guestProps.content.find(p => p.title.includes('Skyline'));
    assert(penthouse !== undefined, "Found seeded 'Modern Skyline Penthouse' property in marketplace");
    console.log(`Penthouse ID: ${penthouse.id}, Location: ${penthouse.location}, Price: ${penthouse.pricePerMonth}`);

    // ----------------------------------------------------
    // 2. Admin Flow (Initial Check)
    // ----------------------------------------------------
    console.log('\n--- 2. Admin Flow (Initial Check) ---');
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@gmail.com', password: 'admin' })
    });
    assert(adminLoginRes.status === 200, 'Admin can log in successfully');
    const adminLogin = await adminLoginRes.json();
    assert(adminLogin.accessToken !== undefined, 'Admin login response contains accessToken');
    const adminToken = adminLogin.accessToken;

    // Get stats
    const adminStatsRes = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(adminStatsRes.status === 200, 'Admin can retrieve stats dashboard metrics');
    const initialStats = await adminStatsRes.json();
    console.log(`Initial Admin Stats:
  - Users: ${initialStats.users}
  - Properties: ${initialStats.properties}
  - Bookings: ${initialStats.bookings}
  - Messages: ${initialStats.messages}`);

    // Get users list
    const adminUsersRes = await fetch(`${BASE_URL}/admin/users`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(adminUsersRes.status === 200, 'Admin can retrieve user list');
    const adminUsers = await adminUsersRes.json();
    assert(adminUsers && adminUsers.length > 0, 'User database list is populated');
    console.log(`Total users registered in the system: ${adminUsers.length}`);

    // ----------------------------------------------------
    // 3. Tenant Flow
    // ----------------------------------------------------
    console.log('\n--- 3. Tenant Flow ---');
    const tenantLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'tenant@houserental.com', password: 'Tenant@123' })
    });
    assert(tenantLoginRes.status === 200, 'Tenant can log in successfully');
    const tenantLogin = await tenantLoginRes.json();
    const tenantToken = tenantLogin.accessToken;

    // Favorite a property
    console.log(`Adding Property ${penthouse.id} ('${penthouse.title}') to favorites...`);
    const addFavRes = await fetch(`${BASE_URL}/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tenantToken}`
      },
      body: JSON.stringify({ propertyId: penthouse.id })
    });
    assert(addFavRes.status === 200 || addFavRes.status === 201, 'Tenant can bookmark a property');

    // Verify favorite list
    const favsRes = await fetch(`${BASE_URL}/favorites`, {
      headers: { 'Authorization': `Bearer ${tenantToken}` }
    });
    assert(favsRes.status === 200, 'Tenant can retrieve bookmarked properties list');
    const favs = await favsRes.json();
    const isBookmarked = favs.some(f => f.id === penthouse.id);
    assert(isBookmarked, 'The bookmarked property is returned in favorites list');

    // Create a booking request
    console.log('Submitting a lease booking request for the penthouse...');
    const bookingRes = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tenantToken}`
      },
      body: JSON.stringify({
        propertyId: penthouse.id,
        startDate: '2026-06-01',
        endDate: '2026-06-30',
        message: 'Hello! I am a verified tenant interested in leasing your luxury penthouse for June 2026. Looking forward to your approval.'
      })
    });
    assert(bookingRes.status === 200 || bookingRes.status === 201, 'Booking application submitted successfully');
    const newBooking = await bookingRes.json();
    assert(newBooking.id !== undefined, 'Booking response returns valid booking ID');
    assert(newBooking.status === 'pending', 'Initial status of booking is pending');
    const bookingId = newBooking.id;
    console.log(`Created Booking ID: ${bookingId}, Status: ${newBooking.status}`);

    // Verify booking in my applications list
    const myBookingsRes = await fetch(`${BASE_URL}/bookings/my`, {
      headers: { 'Authorization': `Bearer ${tenantToken}` }
    });
    assert(myBookingsRes.status === 200, 'Tenant can fetch their submitted applications');
    const myBookings = await myBookingsRes.json();
    const hasMyBooking = myBookings.some(b => b.id === bookingId);
    assert(hasMyBooking, 'Tenant application list contains the newly created booking request');

    // ----------------------------------------------------
    // 4. Landlord Flow
    // ----------------------------------------------------
    console.log('\n--- 4. Landlord Flow ---');
    const landlordLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'landlord@houserental.com', password: 'Landlord@123' })
    });
    assert(landlordLoginRes.status === 200, 'Landlord can log in successfully');
    const landlordLogin = await landlordLoginRes.json();
    const landlordToken = landlordLogin.accessToken;

    // View incoming requests
    const landlordBookingsRes = await fetch(`${BASE_URL}/bookings/landlord`, {
      headers: { 'Authorization': `Bearer ${landlordToken}` }
    });
    assert(landlordBookingsRes.status === 200, 'Landlord can retrieve incoming booking requests');
    const landlordBookings = await landlordBookingsRes.json();
    const incomingBooking = landlordBookings.find(b => b.id === bookingId);
    assert(incomingBooking !== undefined, 'Landlord received the booking request from the tenant');
    console.log(`Found incoming booking request: Tenant: ${incomingBooking.tenantEmail}, Msg: "${incomingBooking.message}"`);

    // Approve the booking
    console.log(`Approving Booking ID: ${bookingId}...`);
    const approveRes = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${landlordToken}`
      },
      body: JSON.stringify({ status: 'approved' })
    });
    assert(approveRes.status === 200, 'Landlord can approve booking successfully (Status 200)');
    const approvedBooking = await approveRes.json();
    assert(approvedBooking.status === 'approved', 'Booking status was successfully updated to approved');

    // Landlord publishes a new property
    console.log('Publishing a new property listing...');
    const createPropRes = await fetch(`${BASE_URL}/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${landlordToken}`
      },
      body: JSON.stringify({
        title: 'Ultra-Modern Smart Loft',
        description: 'Stunning smart home loft with automatic shading, private EV charger, and contemporary design.',
        location: 'Silicon Valley, California',
        pricePerMonth: 4200.00,
        rooms: 2,
        availability: 'available',
        phone: '+15550199',
        contactEmail: 'landlord@houserental.com'
      })
    });
    assert(createPropRes.status === 200 || createPropRes.status === 201, 'Landlord can create a new property listing');
    const newProperty = await createPropRes.json();
    assert(newProperty.id !== undefined, 'Created property response contains a valid ID');
    console.log(`Created Property ID: ${newProperty.id}, Title: "${newProperty.title}", Price: ${newProperty.pricePerMonth}`);

    // Verify property in landlord portfolio
    const myPropsRes = await fetch(`${BASE_URL}/properties/my`, {
      headers: { 'Authorization': `Bearer ${landlordToken}` }
    });
    assert(myPropsRes.status === 200, 'Landlord can retrieve personal properties list');
    const myProps = await myPropsRes.json();
    const hasNewProp = myProps.some(p => p.id === newProperty.id);
    assert(hasNewProp, 'New property successfully exists in Landlord portfolio');

    // ----------------------------------------------------
    // 5. Admin Flow (Final Check & Logs Verification)
    // ----------------------------------------------------
    console.log('\n--- 5. Admin Flow (Final Check & Logs Verification) ---');
    // Get stats again to see if they updated
    const finalStatsRes = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(finalStatsRes.status === 200, 'Admin can fetch stats again');
    const finalStats = await finalStatsRes.json();
    console.log(`Final Admin Stats:
  - Users: ${finalStats.users} (increased by ${finalStats.users - initialStats.users})
  - Properties: ${finalStats.properties} (increased by ${finalStats.properties - initialStats.properties})
  - Bookings: ${finalStats.bookings} (increased by ${finalStats.bookings - initialStats.bookings})
  - Messages: ${finalStats.messages} (increased by ${finalStats.messages - initialStats.messages})`);

    assert(finalStats.properties > initialStats.properties, 'Total properties count increased');
    assert(finalStats.bookings > initialStats.bookings, 'Total bookings count increased');

    // Fetch system audit logs
    const logsRes = await fetch(`${BASE_URL}/admin/logs`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(logsRes.status === 200, 'Admin can fetch system audit logs');
    const systemLogs = await logsRes.json();
    assert(systemLogs && systemLogs.length > 0, 'System audit logs are populated');

    console.log('\n--- Recent Audit Logs Recorded in System ---');
    // Show top 5 most recent logs
    const recentLogs = systemLogs.slice(0, 5);
    recentLogs.forEach(log => {
      console.log(`[${log.createdAt}] [User: ${log.userEmail}] [Action: ${log.action}] - ${log.details}`);
    });

    console.log('\n🎉 ALL END-TO-END SYSTEM INTEGRATION TESTS COMPLETED SUCCESSFULLY! 🎉');
    console.log(`Tests Run: ${testCount}, Success: ${successCount}`);
  } catch (error) {
    console.error('\n🔴 E2E TEST RUN ENCOUNTERED FAILURE:', error.message);
    process.exit(1);
  }
}

runTests();
