// Fictional client used across every guide so screenshots stay consistent.
// Test has no hard delete for users, so a re-run sets DEMO_SUFFIX (e.g. '.2') to get a fresh unique username.
const suffix = process.env.DEMO_SUFFIX ?? ''

export const DEMO_CLIENT = {
  username: `minh.anh${suffix}`,
  email: `minh.anh${suffix}@example.com`,
  password: 'NiFit@Demo2026',
  firstName: 'Minh Anh',
  lastName: 'Nguyễn',
  fullName: 'Nguyễn Minh Anh',
  phone: '+84 901 234 567',
  trainerName: 'PT A',
}
