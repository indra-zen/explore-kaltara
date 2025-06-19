/**
 * Centralized Admin Authentication Utilities
 * This file contains all admin-related authentication logic
 */

export const ADMIN_EMAILS = [
  'admin@explorekaltara.com',
  'demo@admin.com'
] as const;

/**
 * Check if a user email is in the admin list
 * @param email - User email to check
 * @returns boolean indicating if user is admin
 */
export const isAdminUser = (email: string | null | undefined): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email as typeof ADMIN_EMAILS[number]);
};

/**
 * Add a new admin email (for development/testing)
 * @param email - Email to add to admin list
 */
export const addAdminEmail = (email: string): void => {
  console.warn('Adding admin email:', email);
  // In production, this should be handled through environment variables
  // or a proper admin management system
};

/**
 * Get all admin emails (for debugging)
 * @returns Array of admin emails
 */
export const getAdminEmails = (): readonly string[] => {
  return ADMIN_EMAILS;
};

/**
 * Validate admin access for components
 * @param user - Current user object
 * @returns Object with access status and redirect info
 */
export const validateAdminAccess = (user: { email: string } | null) => {
  if (!user) {
    return { hasAccess: false, shouldRedirect: true, redirectTo: '/' };
  }
  
  if (!isAdminUser(user.email)) {
    return { hasAccess: false, shouldRedirect: true, redirectTo: '/' };
  }
  
  return { hasAccess: true, shouldRedirect: false };
};
