export const API_URL = 'https://askgramdev.work'
export const AWS_SECRET_ID = 'dev/askgram/basicAuth' //isDev  ? 'dev/askgram/basicAuth' : 'prod/askgram/basicAuth';
export const USERS_CLUSTER = `${API_URL}/api/users` //isLocal ? `${BASE_URL}/api/users` : `http://askgram-users:8080`;
export const CONTENT_CLUSTER = `${API_URL}/api/content`;
export const SEARCH_CLUSTER = "https://askgramdev.work/api/search"
export const VERSION_DATE = `${new Date().toISOString()}`
export const ATTACHMENTS_BASE = 'https://attachments.askgramdev.work'
export const DATE_BASE_HOST = '45.61.51.51'
