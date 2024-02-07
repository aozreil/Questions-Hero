export function getBaseUrl() {
    return process.env.NODE_ENV === 'development' ? 'https://askgramdev.work' : 'https://askgram.work'
}