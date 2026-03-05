export const SUCCESS_MESSAGES = {
  AUTH: {
    REGISTER_SUCCESS: 'Register successful',
    LOGIN_SUCCESS: 'Login successful',
    REFRESH_TOKEN_SUCCESS: 'Token refreshed successfully',
    LOGOUT_SUCCESS: 'Logout successful',
    LOGOUT_ALL_SUCCESS: 'Logged out from all devices',
  },

  USER: {
    PROFILE_UPDATED: 'Profile updated successfully',
    USER_CREATED: 'User created successfully',
  },

  CHAT: {
    MESSAGE_SENT: 'Message sent successfully',
    MESSAGE_DELETED: 'Message deleted successfully',
  },

  COMMON: {
    SUCCESS: 'Success',
  },
} as const;
