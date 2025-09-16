// In a real-world application, this data must come from a secure backend service.
// Storing credentials directly in the client-side code is NOT secure and is done
// here for demonstration purposes only, as per the user's request structure.

export interface User {
  email: string;
  password: string;
}

// NOTE: This is placeholder data. Replace with your actual user credentials.
export const authorizedUsers: User[] = [
  {
    email: 'user@example.com',
    password: 'password123'
  },
  {
    email: 'test.user@neerai.com',
    password: 'securepassword'
  },
];

// NOTE: This is a placeholder whitelist for Google accounts.
// Add the email addresses of Google users who should have access.
export const authorizedGoogleUsers: string[] = [
    'authorized.google.user@gmail.com',
    'another.user@google.com',
];
