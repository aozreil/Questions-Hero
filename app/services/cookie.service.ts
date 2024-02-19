export function getCookie(key: string, request: Request) {
    const cookies = Object.fromEntries(
        request.headers
            .get("Cookie")
            ?.split(";")
            .map((cookie) => cookie.trim().split("=")) ?? []
    );

    return cookies[key];
}