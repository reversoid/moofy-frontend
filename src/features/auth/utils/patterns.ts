export const EMAIL_PATTERN = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i;

/** Can be used for username or password validation */
export const SAFE_STRING = /^[A-Za-z0-9_-]+$/i;

export const EMAIL_OR_SAFE_STRING = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$|^[A-Za-z0-9_-]+$/;
