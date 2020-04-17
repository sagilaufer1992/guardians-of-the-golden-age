import { fetchBackend, FetchOptions } from "./fetchHelpers";

async function _fetchDeliveryReportApi(url: string, options?: FetchOptions): Promise<DeliveryReportData | null> {
    try {
        const response = await fetchBackend("/api/deliveryReport" + url, options);
        const data = await response.json();

        return data[0];
    }
    catch {
        return null;
    }
}

export async function getDeliveryReport({ token }: gg.User, branchId: number, date: Date): Promise<DeliveryReportData | null> {
    return await _fetchDeliveryReportApi(`/${branchId}/${date.toISOString()}`, { token }) as DeliveryReportData;
}

export async function updateDeliveryReport({ token }: gg.User, branchId: number, date: Date, updated: Partial<DeliveryReportData>): Promise<DeliveryReportData | null> {
    return await _fetchDeliveryReportApi(`/${branchId}/${date.toISOString()}`, { method: "PUT", token, body: updated }) as DeliveryReportData;
}