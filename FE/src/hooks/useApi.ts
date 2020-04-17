import { useSnackbar } from "notistack";
import { fetchBackend } from "../utils/fetchHelpers";
import { useUser } from "../utils/UserProvider";

interface ApiOptions {
    route?: string;
    method?: string;
    body?: any;
    defaultErrorMessage?: string;
    successMessage?: string;
}

export function useApi(baseUrl: string = "") {
    const { token } = useUser();
    const { enqueueSnackbar } = useSnackbar();

    async function fetchApi<T>({ route = "", method = "GET", body, defaultErrorMessage, successMessage }: ApiOptions = {}): Promise<T | null> {
        try {
            const result = await fetchBackend(`${baseUrl}${route}`, { token, method, body });

            // 401 means the token is invalid and needs to be refreshed (in login page)
            if (result.status === 401) window.location.reload();

            if (!result.ok) throw await result.json();

            if (successMessage) enqueueSnackbar(successMessage, { variant: "success" });

            return await result.json();
        }
        catch (err) {
            if (typeof err === "string") enqueueSnackbar(err, { variant: "error" });
            else enqueueSnackbar(defaultErrorMessage ?? "אירעה שגיאה לא ידועה בביצוע הפעולה האחרונה", { variant: "error" });

            return null;
        }
    }

    return [fetchApi];
}
