import { fetchBackend } from "../utils/fetchHelpers";
import { useUser } from "../utils/UserProvider";

export function useApi(baseUrl: string) {
    const { token } = useUser();

    async function fetchApi<T>(route: string = "", method: string = "GET", body?: any): Promise<T | null> {
        try {
            const result = await fetchBackend(`${baseUrl}${route}`, { token, method, body });

            // 401 means the token is invalid and needs to be refreshed (in login page)
            if (result.status === 401) window.location.reload();

            if (!result.ok) throw result.text();

            return await result.json();
        }
        catch (err) {
            return null;
        }
    }

    return [fetchApi];
}
