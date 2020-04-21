import * as XLSX from 'xlsx';

const COLUMN_TO_TITEL: Record<string, string> = {
    A: "מחוז",
    B: "נפה",
    C: "רשות",
    D: "שם נקודת החלוקה",
    E: "סמל נקודת החלוקה",
    F: "כתובת נקודת החלוקה",
    G: "סוג מנה",
    H: "כמות אזרחים",
    I: "כמות מנות"
}

const REQUIRED_KEYS = ["A", "B", "C", "D", "E", "F", "I"];

const COLUMN_TO_KEY: Record<string, string> = {
    A: "district",
    B: "napa",
    C: "municipality",
    D: "name",
    E: "id",
    F: "address",
    I: "amount"
}

export function extractDailyReports(file: File): Promise<FutureReport[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = event => {
            try {
                const binaryData = reader.result;
                const workBook = XLSX.read(binaryData, { type: 'binary' });

                if (workBook.SheetNames.length === 0) reject("הקובץ שהועלה לא תקין, יש ליצור קובץ שמכיל גליון");

                const data = XLSX.utils.sheet_to_json(workBook.Sheets[workBook.SheetNames[0]], { header: "A", raw: true });

                _validator(data[0]);

                const reports = data.slice(1).map(_convertToReport).filter(_ => _.id) as FutureReport[];
                resolve(_unionDuplicates(reports));
            }
            catch (e) {
                reject(e);
            }
        }

        reader.addEventListener("error", reject);

        reader.readAsBinaryString(file);
    });

}

function _validator(headers: any) {
    if (!headers) throw new Error("הקובץ לא תקין");

    if (REQUIRED_KEYS.some(key => headers[key]?.trim() !== COLUMN_TO_TITEL[key]))
        throw new Error("הקובץ אינו תקין, נא הורד קובץ לדוגמה")
}

// מרכז יום חבל מודיעין מופיע פעמיים בקובץ
function _unionDuplicates(reports: FutureReport[]) {
    const dictionary: Record<string, FutureReport> = {};

    reports.forEach(report => {
        if (dictionary[report.id]) dictionary[report.id].amount += report.amount;
        else dictionary[report.id] = { ...report };
    });

    return Object.values(dictionary);
}

function _convertToReport(item: any) {
    return Object.keys(COLUMN_TO_KEY).map(key => ({ [COLUMN_TO_KEY[key]]: item[key] }))
        .reduce((a, b) => ({ ...a, ...b }), {});
}