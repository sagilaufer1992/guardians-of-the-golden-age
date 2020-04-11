export interface FetchOptions {
    token?: string;
    method?: string;
    body?: any;
}

export async function fetchBackend(url: string, options: FetchOptions = {}): Promise<Response> {
    const { token, method = "GET", body } = options;

    return await fetch(process.env.REACT_APP_BE + url, {
        method,
        headers: new Headers({
            "Content-Type": "application/json",
            ...(token ? { authorization: `Bearer ${token}` } : {})
        }),
        body: body ? JSON.stringify(body) : undefined
    });
}