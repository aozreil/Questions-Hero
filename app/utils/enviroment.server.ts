const isDev = process.env.NODE_ENV === 'development';

export const BASE_URL = isDev  ? 'https://askgramdev.work' : 'https://askgram.work';
export const AWS_SECRET_ID = isDev  ? 'dev/askgram/basicAuth' : 'prod/askgram/basicAuth';