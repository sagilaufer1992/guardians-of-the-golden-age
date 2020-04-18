import { useSnackbar } from "notistack";
import { fetchBackend } from "../utils/fetchHelpers";
import { useUser } from "../utils/UserProvider";

interface ApiOptions {
    route?: string;
    method?: string;
    body?: any;
    parseDate?: boolean;
    defaultErrorMessage?: string;
    successMessage?: string;
}

export function useApi(baseUrl: string = "", defaultOptions: ApiOptions = {}) {
    const { token } = useUser();
    const { enqueueSnackbar } = useSnackbar();

    async function fetchApi<T>(options: ApiOptions = {}): Promise<T | null> {
        const { route = "", method = "GET", body, defaultErrorMessage, successMessage, parseDate } = { ...defaultOptions, ...options };

        try {
            const result = await fetchBackend(`${baseUrl}${route}`, { token, method, body });

            // 401 means the token is invalid and needs to be refreshed (in login page)
            if (result.status === 401) window.location.reload();

            if (!result.ok) throw await result.json();

            let data = await result.json();
            if (parseDate) data = Array.isArray(data) ? data.map(_parseDate) : _parseDate(data);

            if (successMessage) enqueueSnackbar(successMessage, { variant: "success" });

            return data;
        }
        catch (err) {
            if (typeof err === "string")
                enqueueSnackbar(err, { variant: "error" });
            else if (err.message?.startsWith("NetworkError"))
                enqueueSnackbar("נותק הקשר עם השרת, נסה לרענן את הדף", { variant: "error" });
            else
                enqueueSnackbar(defaultErrorMessage ?? "אירעה שגיאה לא ידועה בביצוע הפעולה האחרונה", { variant: "error" });

            return null;
        }
    }

    return [fetchApi];
}

function _parseDate(data: any): any {
    return !data?.date ? data : { ...data, date: new Date(data.date) };
}