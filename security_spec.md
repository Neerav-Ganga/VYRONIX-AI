# VYRONIX AI Security Specification

## Data Invariants
1. A user can only access their own profile.
2. Tasks must belong to a specific user and only that user can read/write them.
3. Focus sessions are private to the user who created them.
4. Timestamps (createdAt, updatedAt) must be server-syncable or set at creation.
5. Critical fields like `uid` or `userId` must match the authenticated user.

## The "Dirty Dozen" Payloads (Anti-Patterns)
1. **Identity Theft**: Creating a task for another user (`userId: "other_uid"`).
2. **Profile Hijack**: Updating another user's profile metadata.
3. **Ghost Fields**: Adding `isAdmin: true` to a profile update.
4. **ID Poisoning**: Using a 2MB string as a Task ID.
5. **State Skipping**: Manually setting `status: "completed"` without proper logic (verified via rules where possible).
6. **Timeline Forgery**: Setting a `createdAt` in the future.
7. **Size Attack**: Sending a task description that is 50MB.
8. **Auth Injection**: Accessing tasks while signed out.
9. **Relational Orphan**: Creating a sub-collection item without a parent (checked by parent exists).
10. **Shadow Task**: Updating a task the user doesn't own.
11. **Email Spoof**: Accessing admin-only data (if any) with an unverified email.
12. **Type Confusion**: Sending a number for the `title` field.

## Test Runner (Draft)
A `firestore.rules.test.ts` would verify these rejections.
