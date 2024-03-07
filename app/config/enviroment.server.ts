export const API_URL = 'https://askgramdev.work'
export const AWS_SECRET_ID = 'dev/askgram/basicAuth' //isDev  ? 'dev/askgram/basicAuth' : 'prod/askgram/basicAuth';
export const USERS_CLUSTER = `${API_URL}/api/users` //isLocal ? `${BASE_URL}/api/users` : `http://askgram-users:8080`;
export const CONTENT_CLUSTER = `${API_URL}/api/content` //isLocal ? `${BASE_URL}/api/content` : `http://askgram-content:8080`;