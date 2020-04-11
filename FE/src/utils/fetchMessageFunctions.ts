import { fetchBackend, FetchOptions } from "./fetchHelpers";

function _parseJsonWithDate(data: Message) {
    return { ...data, date: new Date(data.date) }
}

async function _fetchMessagesApi(url: string, options?: FetchOptions): Promise<Message[] | Message | null> {
    try {
        const response = await fetchBackend("/api/messages" + url, options);

        const data = await response.json();

        return Array.isArray(data) ? data.map(fault => ({ ...fault, date: new Date(fault.date) })) : _parseJsonWithDate(data);
    }
    catch {
        return null;
    }
}

export async function getMessagesByFaultId({ token }: gg.User, faultId: string): Promise<Message[] | null> {
    return await _fetchMessagesApi("?faultId=" + faultId, { token }) as any;
}

export async function addMessage({ token }: gg.User, faultId: string, newMessage: NewMessage): Promise<Message | null> {
    return await _fetchMessagesApi("?faultId=" + faultId, {
        method: "POST",
        token,
        body: newMessage
    }) as Message;
}