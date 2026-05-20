# RPMS Engineering Analysis and Production Design

Document ID: RPMS-ENG-ANALYSIS-2026-001  
Source SRS: RPMS-SRS-2026-001, Version 1.0  
Date: May 19, 2026  
Audience: Product, Engineering, QA, Architecture Review

## 1. Requirements Analysis

### Core Modules

1. Authentication and Identity
   - User registration for Landlord and Tenant.
   - Pre-seeded Administrator account.
   - Login, logout, failed-login tracking.
   - Role-based access control at the API layer.

2. Property Management
   - Landlord creates, updates, deletes, and views own listings.
   - Tenant and public users browse available listings.
   - Property search by location, price, and room count.
   - Property activity is audit logged.

3. Booking and Lease Management
   - Tenant submits booking request for an available listing.
   - Landlord reviews incoming booking requests.
   - Landlord approval transitions booking to an active lease state.
   - Approval affects property occupancy and dashboard metrics.

4. Dashboard Metrics
   - Landlord: active listings, estimated revenue, occupancy rate, pending requests.
   - Tenant: approved leases, applications sent, pending requests, monthly commitment.
   - Metrics are derived from database state and refreshed within 2 seconds.

5. Audit and Monitoring
   - Administrator reads audit logs only.
   - Logs include authentication and property lifecycle events.
   - Logs are sorted newest-first and refreshed without manual page reload.

### Subsystems

1. Web Frontend
   - Responsive UI.
   - Role-specific dashboards.
   - Search, listing forms, booking forms, and audit-log views.

2. REST API
   - Stateless authentication.
   - Validation and authorization.
   - Transactional booking approval.

3. Persistence Layer
   - Relational database for users, properties, bookings, leases, audit logs, and favorites/messages if retained.
   - Indexes for search, ownership lookup, and log ordering.

4. Event and Metrics Layer
   - SRS allows direct DB-derived metrics.
   - Production design should emit domain events for audit logging, notification, and metric cache invalidation.

### Data Models

Core data models required by the SRS:

- User
- Property
- BookingRequest
- Lease
- AuditLog

Supporting data models recommended for a production system:

- PropertyImage
- Notification
- MessageThread or Conversation
- FailedLoginAttempt or security event details
- DashboardMetricSnapshot if cached metrics are introduced

### API Boundaries

- `/auth/*`: identity, session, profile.
- `/properties/*`: browse, search, landlord listing management.
- `/bookings/*`: tenant booking creation, landlord request review.
- `/leases/*`: active lease retrieval and lease lifecycle.
- `/admin/audit-logs`: administrator monitoring.
- `/dashboard/*`: optional aggregated metric APIs.

### Missing or Unclear Requirements

1. Lease record definition is incomplete.
   - FR-E2E-01 says a lease record shall be created, but the SRS does not define the lease entity fields.
   - Recommended fields: lease id, booking id, property id, landlord id, tenant id, start date, end date, monthly rent, status, approved at.

2. "Active listing" is not defined.
   - Could mean available property, approved property, non-deleted property, or landlord-owned listing.
   - Recommended definition: a property with status `available` or `rented`, not deleted, owned by active landlord.

3. "Approved lease" wording conflicts with booking status.
   - Booking status `Approved` may represent a lease, but the SRS separately requires a lease record.
   - Recommended model: booking request remains as request history; lease is separate and created on approval.

4. Administrator capability is intentionally limited but needs enforcement detail.
   - SRS says admin does not manage listings or bookings.
   - Admin APIs should be read-only for audit logs and monitoring.

5. Real-time is not technically defined.
   - FR-ADM-05 and NFR-01 imply updates without refresh and within 2 seconds.
   - Implementation can use polling, SSE, WebSocket, or event-driven refresh.
   - SRS should define whether 2-second update applies to every dashboard view or only active sessions.

6. Booking conflicts are unspecified.
   - No rule for overlapping booking date ranges.
   - No rule for multiple pending requests on the same property.
   - Recommended rule: allow multiple pending requests, but only one approval can create an active lease for overlapping dates.

7. Tenant eligibility is unspecified.
   - SRS does not say whether landlords can also book properties or tenants can list properties.
   - Current role model should enforce landlord-only listing and tenant-only booking.

8. Property moderation/fraud prevention is not specified.
   - SRS gives admins read-only access, so fraud controls need automated rules, reporting, or a future moderation role.

### Contradictions or Weak Definitions

- The administrator is called "full monitoring access" but "read-only monitoring." This should be clarified as full read access to monitoring data only.
- FR-E2E-01 requires lease creation, but the rest of the requirements often treat approved booking as the lease. The data model should separate them.
- FR-LL-03 says revenue is calculated from active approved leases, but no lease pricing snapshot is defined. Lease should store monthly rent at approval time so later property price changes do not rewrite revenue history.
- "Real-time" dashboard metrics and "derived from database state" can conflict at scale. Direct live queries are accurate but expensive; cached projections are fast but eventually consistent.

## 2. Real-World Simulation Scenarios

### High-Traffic Landlord Posts Many Listings

Scenario:
A landlord uploads 200 listings and 1,000 images in a short time.

What could break:
- Database write throughput can spike.
- Image uploads may timeout or produce orphaned records.
- Dashboard active listing count may lag if metric refresh depends on polling.
- Audit log table can receive large write bursts.

Mitigations:
- Use transactional property create with separate async image processing.
- Rate-limit listing creation.
- Add indexes on `properties.landlord_id`, `properties.status`, and `properties.created_at`.
- Store audit logs with efficient append-only writes.

### Tenant Floods Booking Requests

Scenario:
A tenant scripts hundreds of booking requests against the same property.

What could break:
- Duplicate pending requests from the same tenant.
- Booking table grows quickly.
- Landlord dashboard becomes noisy.
- Race conditions during approval become more likely.

Mitigations:
- Unique constraint on pending booking per tenant/property/date range where practical.
- API rate limiting by user and IP.
- Idempotency key for booking creation.
- Landlord UI grouping and filtering.

### Audit Logs Under Heavy Write Load

Scenario:
Hundreds of users login, fail login, create listings, and update properties concurrently.

What could break:
- Audit logging inside the main transaction can slow user-facing requests.
- If audit logging fails, NFR-04 says no event should be lost, but the main transaction may need rollback.

Mitigations:
- For strict atomicity, write audit logs in the same transaction for core events.
- For scale, write to an outbox table in the same transaction, then asynchronously publish to log storage.
- Partition audit logs by month or created date.

### Simultaneous Lease Approvals

Scenario:
Two browser tabs or two landlords approve different bookings for the same property at nearly the same time.

What could break:
- Two active leases can be created for the same property/date range.
- Occupancy and revenue metrics become inaccurate.

Mitigations:
- Use database row locking on the property or booking during approval.
- Add exclusion constraints for overlapping active leases where supported.
- Use optimistic locking with a version column.
- Run approval in a single transaction.

### Fraud Attempts

Scenario:
Users create fake landlord accounts, duplicate tenant accounts, or listings with suspicious content.

What could break:
- Bad listings appear in search.
- Tenants may submit requests to fraudulent landlords.
- Admin is read-only, so no manual moderation path exists in the SRS.

Mitigations:
- Email verification and optional phone verification.
- Duplicate account detection by email, phone, device fingerprint, and payment identity.
- Automated listing risk scoring.
- Add a future "moderator" or "trust and safety" role if business wants manual takedown.

### Network Delay or Partial Failures

Scenario:
Tenant submits a booking but loses network before receiving response.

What could break:
- Tenant retries and creates duplicate bookings.
- UI shows failure while database contains the request.
- Landlord receives request but tenant thinks it failed.

Mitigations:
- Idempotency keys on POST requests.
- Client retries only on safe error classes.
- Return consistent request ids.
- Show booking history after failed submission.

## 3. Edge Case Design

### Authentication Edge Cases

Input:
- Email case differences.
- Leading/trailing whitespace.
- Weak passwords.
- Role submitted as `admin` during public registration.
- Empty password, malformed email, inactive account.

Concurrency:
- Same email registration submitted twice.
- User logs out while token is used in another tab.
- Admin seed process runs while another admin already exists.

System failure:
- Audit write fails during login.
- JWT secret rotated while sessions exist.
- Database unavailable during authentication.

### Property Listing Creation Edge Cases

Input:
- Negative price.
- Zero rooms.
- Extremely long title or location.
- Empty description.
- Invalid contact email.
- Image upload unsupported type or too large.

Concurrency:
- Same landlord submits duplicate form twice.
- Property updated while tenant is viewing details.
- Property deleted while booking request is being submitted.

System failure:
- Property saved but image upload fails.
- Audit log write fails after property insert.
- Dashboard query times out after listing creation.

### Booking Request Edge Cases

Input:
- End date before start date.
- Same start and end date.
- Booking unavailable property.
- Booking own property.
- Booking already rented property.
- Duplicate booking for same property and dates.

Concurrency:
- Multiple tenants submit requests for same listing.
- Tenant submits request while landlord deletes listing.
- Two retries create duplicate rows.

System failure:
- Booking created but response lost.
- Landlord dashboard polling misses one interval.
- Audit log write fails during booking creation.

### Lease Approval Flow Edge Cases

Input:
- Approving non-pending booking.
- Rejecting already approved booking.
- Approving booking for deleted or inactive property.
- Approving booking where tenant account is inactive.

Concurrency:
- Two approvals for same property.
- Approval and property deletion happen simultaneously.
- Approval and tenant cancellation happen simultaneously.

System failure:
- Booking status updates but lease insert fails.
- Lease insert succeeds but property availability update fails.
- Metrics cache invalidation fails.

### Dashboard Metric Edge Cases

Input:
- Landlord has zero listings.
- Tenant has zero approved leases.
- Property price changes after lease approval.
- Lease cancelled after approval.

Concurrency:
- Metrics queried during approval transaction.
- Multiple approvals and cancellations occur within 2 seconds.

System failure:
- Metrics API returns stale data.
- Polling request fails.
- Browser tab sleeps and resumes with old dashboard data.

## 4. Production-Level System Design

### Backend Architecture

Recommended stack:
- Spring Boot REST API.
- Spring Security with JWT or session tokens.
- PostgreSQL relational database.
- Flyway migrations.
- Transactional service layer.
- Optional Redis for short-lived metrics cache.
- Optional outbox worker for audit and notification events.

Layering:
- Controller layer: request validation, endpoint boundaries.
- Service layer: business rules and transactions.
- Repository layer: database access.
- Security layer: role checks and authentication.
- Event layer: domain events, audit writes, metric invalidation.

Why:
- Spring Boot fits the SRS REST API and RBAC requirements.
- PostgreSQL gives strong transactional consistency for lease approval.
- Flyway provides repeatable schema control.
- A service layer keeps role-specific business logic maintainable.

### Database Schema

Core tables:

- `users`
  - `id` PK
  - `email` unique
  - `password_hash`
  - `role` enum: admin, landlord, tenant
  - `full_name`
  - `active`
  - `created_at`

- `properties`
  - `id` PK
  - `landlord_id` FK users.id
  - `title`
  - `description`
  - `location`
  - `price_per_month`
  - `rooms`
  - `availability` enum: available, rented, unavailable
  - `created_at`
  - `updated_at`

- `property_images`
  - `id` PK
  - `property_id` FK properties.id
  - `file_path`
  - `sort_order`

- `bookings`
  - `id` PK
  - `property_id` FK properties.id
  - `tenant_id` FK users.id
  - `status` enum: pending, approved, rejected, cancelled
  - `start_date`
  - `end_date`
  - `message`
  - `created_at`
  - `updated_at`

- `leases`
  - `id` PK
  - `booking_id` unique FK bookings.id
  - `property_id` FK properties.id
  - `landlord_id` FK users.id
  - `tenant_id` FK users.id
  - `monthly_rent`
  - `start_date`
  - `end_date`
  - `status` enum: active, ended, cancelled
  - `approved_at`
  - `created_at`

- `audit_logs`
  - `id` PK
  - `action`
  - `entity_type`
  - `entity_id`
  - `actor_user_id`
  - `actor_email`
  - `result` enum: success, failure
  - `details`
  - `ip_address`
  - `user_agent`
  - `created_at`

### REST API Structure

- AuthController: `/auth`
- PropertyController: `/properties`
- BookingController: `/bookings`
- LeaseController: `/leases`
- AdminAuditController: `/admin/audit-logs`
- DashboardController: `/dashboard`

Why:
- Boundaries match business modules.
- Admin endpoints are read-only and isolated.
- Lease operations are separate from booking history.

### RBAC Model

Admin:
- Can read audit logs and monitoring metrics.
- Cannot create, update, delete listings.
- Cannot approve or reject bookings.

Landlord:
- Can create and manage own properties.
- Can view booking requests for own properties.
- Can approve or reject own property booking requests.
- Can view own leases and dashboard metrics.

Tenant:
- Can browse/search properties.
- Can create booking requests.
- Can view own bookings and approved leases.
- Cannot create properties or approve bookings.

Public:
- Can view landing page and public search if product allows.
- Cannot submit bookings without authentication.

### Lease Approval Event Flow

1. Landlord submits `PUT /bookings/{id}` with `status=approved`.
2. API validates landlord owns the booking property.
3. Service starts transaction.
4. Service locks booking and property rows.
5. Service verifies booking is pending and property/date range is still available.
6. Service updates booking status to approved.
7. Service creates lease with rent snapshot.
8. Service marks property rented if lease starts immediately or blocks overlapping dates.
9. Service writes audit log.
10. Service commits transaction.
11. Event/outbox emits `LeaseApproved`.
12. Dashboards refresh or receive event within 2 seconds.

## 5. Data Model Design

### User

Primary key: `id`  
Relationships:
- One user can own many properties.
- One tenant can submit many bookings.
- One user can appear in many audit logs as actor.

Important constraints:
- Email unique.
- Public registration cannot create admin role.

### Property

Primary key: `id`  
Relationships:
- Many properties belong to one landlord.
- One property can have many images.
- One property can have many bookings.
- One property can have many leases over time.

Important constraints:
- `landlord_id` required.
- Price must be non-negative.
- Rooms should be positive if business treats zero rooms as invalid.

### Booking

Primary key: `id`  
Relationships:
- Many bookings belong to one property.
- Many bookings belong to one tenant.
- One approved booking creates one lease.

Important constraints:
- End date must be after start date.
- Status transition rules enforced by service.
- Tenant cannot book own landlord listing.

### Lease

Primary key: `id`  
Relationships:
- One lease belongs to one booking.
- One lease belongs to one property, one landlord, and one tenant.

Important constraints:
- Booking id unique.
- Monthly rent is copied from property price at approval time.
- Active leases should not overlap for the same property.

### Audit Log

Primary key: `id`  
Relationships:
- Optional actor user id references users.
- Entity type and id are generic to support multiple modules.

Important fields:
- Action: LOGIN, LOGOUT, LOGIN_FAILED, PROPERTY_CREATED, PROPERTY_UPDATED, PROPERTY_DELETED, BOOKING_CREATED, BOOKING_APPROVED.
- Result: success or failure.
- Details: safe human-readable context.
- Created at indexed descending.

## 6. API Design

### Auth

`POST /auth/register`  
Allowed: Public  
Payload:

```json
{
  "email": "landlord@example.com",
  "password": "StrongPass123",
  "fullName": "Jane Host",
  "role": "landlord"
}
```

Response:

```json
{
  "id": 12,
  "email": "landlord@example.com",
  "fullName": "Jane Host",
  "role": "landlord",
  "active": true
}
```

`POST /auth/login`  
Allowed: Public  
Payload:

```json
{
  "email": "admin@gmail.com",
  "password": "admin"
}
```

Response:

```json
{
  "accessToken": "jwt-token",
  "tokenType": "Bearer",
  "user": {
    "id": 1,
    "email": "admin@gmail.com",
    "role": "admin"
  }
}
```

Audit:
- Success writes LOGIN.
- Bad credentials writes LOGIN_FAILED.

`POST /auth/logout`  
Allowed: Authenticated  
Response:

```json
{ "status": "ok" }
```

Audit:
- Writes LOGOUT.

### Properties

`GET /properties`  
Allowed: Public or authenticated users  
Query:
- `location`
- `minPrice`
- `maxPrice`
- `minRooms`
- `page`
- `size`

Response:

```json
{
  "content": [
    {
      "id": 45,
      "title": "Mbezi Beach Apartment",
      "location": "Dar es Salaam",
      "pricePerMonth": 900000,
      "rooms": 3,
      "availability": "available",
      "landlordId": 8
    }
  ],
  "totalElements": 1,
  "totalPages": 1
}
```

`POST /properties`  
Allowed: Landlord only  
Payload:

```json
{
  "title": "Mbezi Beach Apartment",
  "description": "Near main road and shops",
  "location": "Dar es Salaam",
  "pricePerMonth": 900000,
  "rooms": 3,
  "availability": "available",
  "phone": "+255700000000",
  "contactEmail": "host@example.com"
}
```

Response: property object.  
Audit: PROPERTY_CREATED.

`PUT /properties/{id}`  
Allowed: Owning landlord only  
Audit: PROPERTY_UPDATED.

`DELETE /properties/{id}`  
Allowed: Owning landlord only  
Audit: PROPERTY_DELETED.

### Bookings

`POST /bookings`  
Allowed: Tenant only  
Payload:

```json
{
  "propertyId": 45,
  "startDate": "2026-06-01",
  "endDate": "2027-06-01",
  "message": "I would like to view this property."
}
```

Response:

```json
{
  "id": 71,
  "propertyId": 45,
  "tenantId": 22,
  "status": "pending",
  "startDate": "2026-06-01",
  "endDate": "2027-06-01"
}
```

`GET /bookings/my`  
Allowed: Tenant only  
Returns tenant booking history.

`GET /bookings/landlord`  
Allowed: Landlord only  
Returns requests for landlord-owned properties.

`PUT /bookings/{id}`  
Allowed: Owning landlord only  
Payload:

```json
{
  "status": "approved"
}
```

Response:

```json
{
  "id": 71,
  "status": "approved",
  "leaseId": 12
}
```

Audit:
- BOOKING_APPROVED or BOOKING_REJECTED.

### Leases

`GET /leases/my`  
Allowed: Tenant or landlord  
Returns active and historical leases for the current user.

`GET /leases/{id}`  
Allowed: Lease tenant or lease landlord.

### Admin Audit Logs

`GET /admin/audit-logs`  
Allowed: Admin only  
Query:
- `days`
- `action`
- `page`
- `size`

Response:

```json
{
  "content": [
    {
      "id": 501,
      "action": "PROPERTY_CREATED",
      "entityType": "property",
      "entityId": 45,
      "actorEmail": "host@example.com",
      "result": "success",
      "details": "Created property listing",
      "createdAt": "2026-05-19T12:00:00Z"
    }
  ],
  "totalElements": 1
}
```

## 7. Test Strategy

### Unit Tests

- AuthService registration prevents admin role from public signup.
  - Maps to NFR-02.

- AuthService logs successful and failed login attempts.
  - Maps to FR-ADM-02, NFR-04.

- PropertyService validates landlord ownership on update/delete.
  - Maps to FR-LL-01, FR-ADM-03, NFR-02.

- BookingService rejects invalid date ranges.
  - Maps to FR-TN-05.

- BookingService approval creates lease and updates status atomically.
  - Maps to FR-E2E-01.

- DashboardMetricService calculates occupancy and revenue from active leases.
  - Maps to FR-LL-02, FR-LL-03, FR-LL-04, FR-TN-06, FR-TN-07.

### Integration Tests

- Register landlord, create property, verify audit log.
  - Maps to FR-LL-01, FR-ADM-03.

- Tenant searches by location, price, rooms.
  - Maps to FR-TN-02, FR-TN-03, FR-TN-04.

- Tenant submits booking; landlord sees request.
  - Maps to FR-TN-05, FR-LL-06.

- Landlord approves booking; lease row exists.
  - Maps to FR-LL-07, FR-E2E-01.

- Admin can read audit logs but cannot manage bookings/listings.
  - Maps to FR-ADM-01, NFR-02.

### System Tests

- Full end-to-end lease approval:
  - Landlord creates listing.
  - Tenant books listing.
  - Landlord approves.
  - Tenant sees Approved Leases = 1.
  - Landlord sees revenue and occupancy update.
  - Maps to FR-E2E-01 through FR-E2E-05.

- Landing page active listing count matches database count.
  - Maps to FR-TN-01.

- Dashboard metrics update within 2 seconds after booking approval.
  - Maps to NFR-01 and FR-LL-05.

### Stress Tests

- 1,000 tenants search concurrently.
  - Maps to NFR-05.

- 500 booking requests on same property.
  - Validates concurrency and duplicate handling.
  - Maps to FR-TN-05, NFR-05.

- Two simultaneous approvals for overlapping bookings.
  - Must create only one active lease.
  - Maps to FR-E2E-01 and NFR-05.

- 10,000 audit log writes in a short burst.
  - Logs remain complete and newest-first query stays performant.
  - Maps to FR-ADM-02, FR-ADM-03, FR-ADM-04, NFR-04.

## 8. Real-World Product Thinking

### How Airbnb/Zillow-Like Systems Handle Similar Flows

- Listings are usually created by hosts, then pass through automated trust, content, and completeness checks.
- Search relies on indexed stores rather than raw relational scans at scale.
- Booking approval is treated as a transactional workflow with strict conflict prevention.
- Pricing and availability are snapshotted at booking or lease creation time.
- Messaging and notifications are event-driven.
- Admin and trust tools are usually separate from normal user workflows.

### Scalability Risks

- Search queries become slow without indexes or search infrastructure.
- Dashboard metrics become expensive if calculated repeatedly from raw tables.
- Audit logs can grow faster than operational tables.
- Concurrent booking approvals can corrupt occupancy if not transactionally protected.
- Image uploads can overload API nodes if handled synchronously.

### Caching Strategies for Dashboards

Small scale:
- Query database directly every 2 seconds or on action completion.

Medium scale:
- Use lightweight server-side aggregate queries with indexes.
- Cache dashboard responses for 1-2 seconds per user.

Large scale:
- Maintain metric projection tables:
  - `landlord_metrics`
  - `tenant_metrics`
  - `property_occupancy_summary`
- Update projections from domain events.
- Use Redis for hot dashboard values.
- Invalidate cache on property create/update/delete and lease approval/cancel.

### Audit Log Storage Strategies

Small scale:
- Store audit logs in relational database with indexes on `created_at`, `action`, and `actor_user_id`.

Medium scale:
- Partition audit log table by month.
- Move old logs to cheaper archive storage.

Large scale:
- Use transactional outbox for reliability.
- Stream logs to append-only storage such as Kafka, OpenSearch, or object storage.
- Keep recent logs in PostgreSQL for admin UI.
- Archive historical logs with retention policies.

## Recommended SRS Follow-Up Changes

1. Define a formal Lease entity and lifecycle.
2. Clarify active listing meaning.
3. Clarify whether public users can browse listings or only authenticated tenants.
4. Define duplicate booking and overlapping lease rules.
5. Define implementation mechanism for "real-time" updates.
6. Add fraud/moderation requirements or explicitly mark them out of scope.
7. Add audit log retention and privacy requirements.
8. Add expected search pagination and sorting behavior.
9. Add explicit admin read-only authorization tests.
