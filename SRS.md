SOFTWARE REQUIREMENTS SPECIFICATION
Rental Property Management System (RPMS)

Document ID	RPMS-SRS-2026-001
Version	1.0
Status	Draft - For Review
Prepared By	Development Team
Date	May 19, 2026
Classification	Confidential

1. Introduction

1.1 Purpose
This Software Requirements Specification (SRS) document defines the functional and nonfunctional requirements for the Rental Property Management System (RPMS). The system is designed to facilitate property listing, tenant discovery, booking requests, lease management, and administrative oversight through a structured, role-based web application.

1.2 Scope
The RPMS provides a centralized platform supporting three distinct user roles: Administrator, Landlord/Host, and Tenant/Renter. The system enables landlords to list and manage properties, tenants to search and request bookings, and administrators to monitor system activity through audit logs. The platform is accessible via a responsive web interface and is backed by a persistent relational database.

1.3 Definitions, Acronyms, and Abbreviations
Term / Acronym	Definition
RPMS	Rental Property Management System
SRS	Software Requirements Specification
Admin	System Administrator role with full monitoring access
Landlord	A registered user who lists and manages rental properties
Tenant	A registered user who searches for and books rental properties
Lease	A confirmed rental agreement between a landlord and a tenant
FR	Functional Requirement
NFR	Non-Functional Requirement
UI	User Interface

1.4 References
•	RPMS Functional Testing Guide, v1.0
•	RPMS System Architecture Overview
•	ISO/IEC/IEEE 29148:2018 - Systems and Software Requirements Engineering

2. Overall System Description

2.1 Product Perspective
The RPMS is a standalone web-based application operating in a multi-role environment. It integrates with a relational database to store and retrieve property, user, and lease information. All user interactions occur through a browser-based front-end, communicating with a secure back-end REST API.

2.2 User Classes and Characteristics
User Role	Description	Access Level
Administrator	Monitors system-wide activity and audit logs. Does not manage listings or bookings.	Read-only monitoring
Landlord / Host	Creates and manages property listings; reviews and approves tenant booking requests.	Full listing & lease management
Tenant / Renter	Searches available properties, submits booking requests, and tracks approved leases.	Browse & request bookings

2.3 Operating Environment
•	Web-based application accessible via any modern browser (Chrome, Firefox, Safari, Edge).
•	Back-end: RESTful API with relational database persistence.
•	Deployment: Server-side hosted environment supporting concurrent multi-user access.
•	Authentication: Role-based access control enforced at the API level.

2.4 Assumptions and Dependencies
•	Each user must register and select a role (Landlord or Tenant) before accessing role-specific features.
•	The Administrator account is pre-seeded in the system (credentials: admin@gmail.com / admin).
•	Dashboard metrics and occupancy data are derived in real-time from the database state.
•	A property listing must exist before a booking request can be submitted.

3. Functional Requirements

3.1 Administrator - Audit Logs and Monitoring

ID	Requirement Description	Priority
FR-ADM-01	The system shall provide an Audit Logs section accessible only to the Administrator role.	High
FR-ADM-02	The system shall record all authentication attempts (login, logout, failed login) in the audit log.	High
FR-ADM-03	The system shall record all property listing activities (creation, update, deletion) in the audit log.	High
FR-ADM-04	Audit log entries shall be displayed in descending chronological order (most recent first).	Medium
FR-ADM-05	Audit log entries shall be updated in real-time without requiring a manual page refresh.	Medium

3.2 Landlord / Host - Listings and Dashboard

ID	Requirement Description	Priority
FR-LL-01	A registered Landlord shall be able to create a new property listing via an Add Property form.	High
FR-LL-02	The landlord dashboard shall display the total number of active listings.	High
FR-LL-03	The landlord dashboard shall display an Estimated Revenue figure, calculated from active approved leases.	High
FR-LL-04	The dashboard shall include an Occupancy Rate progress gauge that updates dynamically based on current property and lease activity.	High
FR-LL-05	Dashboard metrics (active listings, estimated revenue, occupancy rate) shall recalculate automatically upon any change to listings or lease status.	High
FR-LL-06	The Landlord shall be able to view all incoming tenant booking requests in a Requests section.	High
FR-LL-07	The Landlord shall be able to approve a booking request, converting it to an active lease.	High

3.3 Tenant / Renter - Search and Booking

ID	Requirement Description	Priority
FR-TN-01	The landing page hero section shall display the total number of active listings retrieved from the database.	High
FR-TN-02	The system shall provide a property search interface allowing filtering by location.	High
FR-TN-03	The system shall allow filtering search results by price range.	High
FR-TN-04	The system shall allow filtering search results by number of rooms.	High
FR-TN-05	A Tenant shall be able to submit a booking request for any available property listing.	High
FR-TN-06	The tenant dashboard shall display the number of Approved Leases.	High
FR-TN-07	The tenant dashboard shall display a Monthly Commitment value, derived from approved lease terms.	High

3.4 End-to-End Lease Approval Process

The following requirements describe the full cross-role workflow from booking request through lease confirmation.

ID	Requirement Description	Priority
FR-E2E-01	When a Landlord approves a booking request, the request status shall transition to 'Approved' and a lease record shall be created.	High
FR-E2E-02	Upon lease approval, the Landlord's Occupancy Rate gauge shall update automatically to reflect the newly occupied property.	High
FR-E2E-03	Upon lease approval, the Landlord's Estimated Revenue shall recalculate to include the new lease value.	High
FR-E2E-04	Upon lease approval, the Tenant's Approved Leases count shall increment by one.	High
FR-E2E-05	Upon lease approval, the Tenant's Monthly Commitment figure shall update to reflect the rental amount of the approved lease.	High

4. Non-Functional Requirements

ID	Category	Requirement Description
NFR-01	Performance	Dashboard metrics and occupancy gauges shall reflect database state within 2 seconds of any triggering action.
NFR-02	Security	Role-based access control shall prevent any user from accessing features outside their assigned role.
NFR-03	Usability	All key workflows (registration, listing creation, booking, approval) shall be completable without external documentation.
NFR-04	Reliability	Audit log records shall be written atomically; no authentication or listing event shall be lost due to a system error.
NFR-05	Scalability	The system shall support concurrent access by multiple landlords and tenants without degradation of metric accuracy.
NFR-06	Maintainability	All role-specific features shall be separated into distinct modules to allow independent updates.

5. Key Use Case Scenarios

5.1 Administrator Monitors Audit Logs
Field	Details
Actor	Administrator
Precondition	Administrator is authenticated (admin@gmail.com / admin).
Main Flow	1. Admin navigates to Audit Logs section.  2. System retrieves and displays all audit entries in chronological order.  3. Admin observes authentication and listing activities in real-time.
Postcondition	Audit entries are visible and up to date.
Exception	If no log entries exist, the section displays an empty state message.

5.2 Landlord Creates a Listing and Monitors Dashboard
Field	Details
Actor	Landlord / Host
Precondition	Landlord is registered and authenticated.
Main Flow	1. Landlord navigates to Add Property.  2. Landlord completes and submits the property form.  3. System saves the listing and returns confirmation.  4. Dashboard metrics (Active Listings, Estimated Revenue, Occupancy Rate) update automatically.
Postcondition	New listing appears in the active properties count; dashboard reflects updated metrics.
Exception	If required fields are missing, the system displays validation errors and the listing is not created.

5.3 Tenant Searches and Submits a Booking Request
Field	Details
Actor	Tenant / Renter
Precondition	Tenant is registered and authenticated; at least one property listing exists.
Main Flow	1. Tenant visits the landing page and observes the active listing count.  2. Tenant applies search filters (location, price, rooms).  3. Tenant selects a property and submits a booking request.
Postcondition	Booking request is recorded; landlord can view it in the Requests section.
Exception	If no listings match the applied filters, the system displays a no-results message.

5.4 End-to-End Lease Approval
Field	Details
Actors	Landlord, Tenant
Precondition	A booking request exists and is in pending status.
Main Flow	1. Landlord navigates to Requests section.  2. Landlord approves the booking request.  3. System creates a lease record and updates all related metrics.  4. Tenant logs in and verifies Approved Leases = 1 and updated Monthly Commitment.
Postcondition	Lease is active; landlord and tenant dashboards reflect the updated state.
Exception	If the approval action fails, the request remains in pending state and no metrics are updated.

6. Functional Testing Reference Matrix

The table below maps each functional requirement to its corresponding test scenario as defined in the RPMS Functional Testing Guide.

Requirement ID	Test Scenario	Role	Expected Outcome
FR-ADM-01–05	Admin Workflow: Audit Logs	Administrator	Logs appear in real-time, chronological order.
FR-LL-01	Create Property Listing	Landlord	Property is saved and appears in active listings.
FR-LL-02–04	Dashboard Metrics Update	Landlord	Active Listings, Revenue, Occupancy update on listing add.
FR-LL-06–07	Booking Request Review	Landlord	Pending requests visible; approval transitions to lease.
FR-TN-01	Landing Page Listing Count	Tenant	Hero section shows correct active listing count.
FR-TN-02–04	Property Search & Filter	Tenant	Filtered results match selected location, price, rooms.
FR-TN-05	Submit Booking Request	Tenant	Request recorded; landlord sees it in Requests section.
FR-E2E-01–05	End-to-End Lease Approval	Landlord + Tenant	All dashboard metrics update correctly post-approval.

7. Document Control and Revision History

Version	Date	Author	Description of Change
1.0	May 19, 2026	Development Team	Initial release of the SRS based on completed functional testing guide.

8. Approval

By signing below, the authorized parties confirm that this document accurately represents the agreed-upon requirements for the Rental Property Management System.

Role	Name	Signature	Date
Project Lead			
Lead Developer			
QA Representative			
Stakeholder			
