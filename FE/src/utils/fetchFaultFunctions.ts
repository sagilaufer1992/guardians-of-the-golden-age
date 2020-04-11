export async function getFaultsByDate(date: Date): Promise<Fault[]> {
    const response = await fetch(`${process.env.REACT_APP_BE}/api/faults/date/${date.toISOString()}`);
    console.log(response);
    const body = await response.json();

    return body;
}

export async function updateFault(newFault: Fault): Promise<Fault> {
    const response = await fetch(`${process.env.REACT_APP_BE}/api/faults/${newFault._id}`, {
        method: "PUT",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newFault),
    })
    const body = await response.json();

    return body;
}