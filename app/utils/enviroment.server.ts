const isDev = process.env.NODE_ENV === 'development';
const isLocal = process.env.IS_LOCAL;

export const BASE_URL = isDev  ? 'https://askgramdev.work' : 'https://askgram.work';
export const AWS_SECRET_ID = isDev  ? 'dev/askgram/basicAuth' : 'prod/askgram/basicAuth';
export const USERS_CLUSTER = isLocal ? `${BASE_URL}/api/users` : `http://askgram-users:8080`;
export const CONTENT_CLUSTER = isLocal ? `${BASE_URL}/api/content` : `http://askgram-content:8080`;