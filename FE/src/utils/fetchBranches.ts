import { fetchBackend, FetchOptions } from "./fetchHelpers";

async function _fetchBranchesApi(url: string, options?: FetchOptions): Promise<Branch[] | Branch | null> {
    try {
        const response = await fetchBackend("/api/branches" + url, options);
        const data = await response.json();

        return data;
    }
    catch {
        return null;
    }
}

export async function getBranches({ token }: gg.User): Promise<Branch[] | null> {
    return await _fetchBranchesApi('', { token }) as Branch[];
}