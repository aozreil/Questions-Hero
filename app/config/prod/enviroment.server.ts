export const BASE_URL = 'https://askgram.work';// isDev  ? 'https://askgramdev.work' : 'https://askgram.work';
export const API_URL = 'https://askgram.work';
export const AWS_SECRET_ID = 'prod/askgram/basicAuth'; //isDev  ? 'dev/askgram/basicAuth' : 'prod/askgram/basicAuth';
export const USERS_CLUSTER = `${API_URL}/api/users`; //isLocal ? `${BASE_URL}/api/users` : `http://askgram-users:8080`;
export const CONTENT_CLUSTER = `${API_URL}/api/users`; //isLocal ? `${BASE_URL}/api/content` : `http://askgram-content:8080`;