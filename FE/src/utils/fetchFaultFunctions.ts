import { fetchBackend, FetchOptions } from "./fetchHelpers";

function _parseJsonWithDate(data: Fault) {
    return { ...data, date: new Date(data.date) }
}

async function _fetchFaultsApi(url: string, options?: FetchOptions): Promise<Fault[] | Fault | null> {
    try {
        const response = await fetchBackend("/api/faults" + url, options);

        const data = await response.json();

        return Array.isArray(data) ? data.map(fault => ({ ...fault, date: new Date(fault.date) })) : _parseJsonWithDate(data);
    }
    catch {
        return null;
    }
}

export async function getFaultsByDate({ token }: gg.User, date: Date): Promise<Fault[] | null> {
    return await _fetchFaultsApi(`?date=${date.toISOString()}`, { token }) as any;
}

export async function getFaultsByDateAndLevel({ token }: gg.User, date: Date, level: Level = "all", levelValue?: string): Promise<Fault[] | null> {
    // TODO: not really working, needs BE
    return await _fetchFaultsApi(`?date=${date.toISOString()}&level=${level}${levelValue && `&value=${levelValue}` || ""}`, { token }) as any;
}

export async function addFault({ token }: gg.User, fault: NewFault): Promise<Fault | null> {
    return await _fetchFaultsApi("", {
        method: "POST",
        token,
        body: fault
    }) as any;
}

export async function updateFault({ token }: gg.User, id: string, updated: Partial<Fault>): Promise<Fault | null> {
    return await _fetchFaultsApi(`/${id}`, { method: "PUT", token, body: updated }) as any;
}

export async function deleteFault({ token }: gg.User, id: string): Promise<Fault | null> {
    return await _fetchFaultsApi(`/${id}`, { method: "DELETE", token }) as any;
}