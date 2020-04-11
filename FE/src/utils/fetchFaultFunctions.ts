function _parseJsonWithDate(data: Fault) {
    return { ...data, date: new Date(data.date) }
}

async function _fetchFaultsApi(url: string, method: string = "GET", body: any = null): Promise<Fault[] | Fault> {
    const response = await fetch(`${process.env.REACT_APP_BE}/api/faults${url || ""}`, {
        method,
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined
    });

    const data = await response.json();

    const dataWithDates = Array.isArray(data) ? data.map(fault => ({ ...fault, date: new Date(fault.date) })) : _parseJsonWithDate(data);

    return dataWithDates;
}

export async function getFaultsByDate(date: Date): Promise<Fault[]> {
    return await _fetchFaultsApi(`/date/${date.toISOString()}`) as Fault[];
}

export async function addFault(user: gg.User | null, fault: Partial<Fault>): Promise<Fault | null> {
    const { distributionCenter, content, category } = fault;

    try {
        return await _fetchFaultsApi("", "POST", {
            author: {
                name: user?.username,
                role: user?.role,
            },
            distributionCenter,
            content,
            category
        }) as Fault;
    }
    catch {
        alert("חלה שגיאה בהוספת תקלה");
        return null;
    }
}

export async function updateFault(id: string, updated: Partial<Fault>): Promise<Fault> {
    return await _fetchFaultsApi(`/${id}`, "PUT", updated) as Fault;
}