export const ERROR_MESSAGES = {
  AUTH: {
    EMAIL_ALREADY_EXISTS: 'Email already in use',
    INVALID_CREDENTIALS: 'Invalid email or password',
    UNAUTHORIZED: 'Unauthorized',
    TOKEN_EXPIRED: 'Token expired',
    INVALID_TOKEN: 'Invalid token',
    INVALID_REFRESH_TOKEN: 'Invalid refresh token',
  },

  USER: {
    NOT_FOUND: 'User not found',
  },

  CHAT: {
    CONVERSATION_NOT_FOUND: 'Conversation not found',
    MESSAGE_NOT_FOUND: 'Message not found',
  },

  COMMON: {
    INTERNAL_SERVER_ERROR: 'Internal server error',
    BAD_REQUEST: 'Bad request',
    FORBIDDEN: 'Forbidden',
  },
} as const;
