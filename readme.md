1️⃣ Domain Context

This service governs identity, access control, and tenant isolation within the TCMS ecosystem.
All downstream services (Projects, Test Cases, Results, Config) rely on this service to determine who is making a request and what they’re allowed to do.

2️⃣ Guiding Principles
Principle	Description
Least Privilege	Users only get the minimum rights needed for their function.
Separation of Duties	No user can both create and approve critical entities (e.g., projects, test runs).
Tenant Isolation	Users and data are isolated by tenant unless global (super-admin).
Traceability	Every role and action must be auditable via event or log.
Security First	Authentication and authorization are mandatory for all endpoints except /auth/register and /auth/login.
3️⃣ Entity-Level Rules
🔹 User
Category	Rule
Creation	A user must have a unique email within the same tenant.
	Only Admins can create users with roles higher than “viewer”.
	Passwords must be hashed before storage (bcrypt, cost ≥ 10).
Update	Users may edit only their own profile fields (name, avatar). Role or tenant changes require Admin rights.
Deletion / Deactivation	Soft delete → isActive=false; hard delete reserved for compliance purge.
Login	Disabled users cannot authenticate.
Last Login	Must be updated each successful login.
Password Reset	Generates a one-time token valid 15 minutes. Password reset logs an audit event.
🔹 Role
Category	Rule
Creation	Only global Admin can create or modify roles.
Modification	Roles cannot be renamed if already assigned to users.
Deletion	Disallowed if any user currently holds the role.
Hierarchy	Roles are fixed in Phase 1 (admin > lead > tester > viewer).
🔹 Permission
Category	Rule
Assignment	Permissions are always linked to a Role; not directly to a User in Phase 1.
Modification	Admins may add or remove permission codes but must regenerate role cache.
Validation	All permission codes follow format: DOMAIN_ACTION (e.g., PROJECT_CREATE).
🔹 Tenant (optional Phase 1)
Category	Rule
Creation	Only global Admin can create tenants.
Modification	Tenants can be renamed but cannot share domains.
Deletion	Only allowed if no users exist under tenant.
🔹 RefreshToken
Category	Rule
Rotation	Each login invalidates previous refresh token for that user.
Expiry	Default 7 days.
Revocation	Manual logout deletes the token record.
4️⃣ Cross-Entity Rules
Rule	Description
Email Uniqueness	Enforced across all tenants combined if multi-tenant is off; scoped per tenant when on.
Role Validation	When assigning roleId → must exist and be active.
Tenant Propagation	When user created under tenant, all created resources inherit tenantId automatically (by middleware).
Cascade Deactivation	Deactivating a tenant sets all users under it to inactive.
5️⃣ Authorization Matrix (Phase 1 Baseline)
Action	Admin	Lead	Tester	Viewer
Manage Users	✅	❌	❌	❌
Manage Roles	✅	❌	❌	❌
Manage Tenants	✅	❌	❌	❌
Create Projects	✅	✅	❌	❌
Execute Test Runs	✅	✅	✅	❌
View Reports	✅	✅	✅	✅

(Store this in a JSON config for quick policy enforcement.)

6️⃣ Validation Rules Summary
Area	Rule
Email	Must be valid RFC 5321 format, lowercase, unique.
Password	≥ 8 chars, at least 1 uppercase, 1 number, 1 symbol.
Role	Must be one of predefined enums or existing role _id.
JWT	Must include sub, role, tenant claims; 1 hour expiry.
7️⃣ Security Rules
Concern	Rule
Transport	All endpoints served behind HTTPS (enforced at gateway).
Token Storage	JWT only in Authorization: Bearer header.
Brute-force Protection	5 login attempts → temporary 15 min lockout.
Audit Logging	Login, logout, create/update/delete user, role, tenant.
Admin Actions	Always logged with IP + timestamp.
CORS	Restricted to known frontend origins.
8️⃣ Data Integrity & Lifecycle
Phase	Event	System Reaction
User Creation	User document inserted → Audit “USER_CREATED”	
Password Change	Replace hash, invalidate refresh tokens	
User Deactivation	Update isActive=false, cascade revoke tokens	
Tenant Removal	Remove all child references, set audit “TENANT_DELETED”