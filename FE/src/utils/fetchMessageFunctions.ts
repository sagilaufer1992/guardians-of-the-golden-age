function _parseJsonWithDate(data: Message) {
    return { ...data, date: new Date(data.date) }
}

async function _fetchMessagesApi(url: string, method: string = "GET", body: any = null): Promise<Message[] | Message> {
    const response = await fetch(`${process.env.REACT_APP_BE}/api/messages${url || ""}`, {
        method,
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined
    });

    const data = await response.json();

    const dataWithDates = Array.isArray(data) ? data.map(fault => ({ ...fault, date: new Date(fault.date) })) : _parseJsonWithDate(data);

    return dataWithDates;
}

export async function getMessagesByFaultId(faultId: string): Promise<Message[]> {
    return await _fetchMessagesApi(`/fault/${faultId}`) as Message[];
}

export async function addMessage(fault: Fault, content: string, name: string): Promise<Message | null> {
    const { _id } = fault;

    try {
        return await _fetchMessagesApi("", "POST", {
            faultId: _id,
            author: {
                name,
                role: "hamal",
            },
            content,
            date: new Date()
        }) as Message;
    }
    catch {
        alert("חלה שגיאה בהוספת הודעה");
        return null;
    }
}