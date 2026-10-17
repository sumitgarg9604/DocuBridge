export type UserRole = 'customer' | 'staff';

export interface UserSession {
  role: UserRole;
  name: string;
  email: string;
  roleTitle: string;
  applicantId?: string;
  employeeId?: string;
  department?: string;
}
