import * as XLSX from 'xlsx';

interface Dictionary<T> {
    [index: string]: T
}

interface FutureReport extends Branch {
    amount: number;
}

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

const COLUMN_TO_KEY: Dictionary<string> = {
    A: "district",
    B: "napa",
    C: "municipality",
    D: "name",
    E: "id",
    F: "address",
    I: "amount"
}

export function getReportsFileExample(fileName: string) {
    const data = {
        [COLUMN_TO_TITEL["A"]]: "מחוז לדוגמה",
        [COLUMN_TO_TITEL["B"]]: "נפה לדוגמה",
        [COLUMN_TO_TITEL["C"]]: "עיר לדוגמה",
        [COLUMN_TO_TITEL["D"]]: "נקודת חלוקה 123",
        [COLUMN_TO_TITEL["E"]]: 1234567,
        [COLUMN_TO_TITEL["F"]]: "הכתובת שלי",
        [COLUMN_TO_TITEL["G"]]: "חמגשית, על יסודי",
        [COLUMN_TO_TITEL["H"]]: 100,
        [COLUMN_TO_TITEL["I"]]: 200
    };
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([data], { header: Object.values(COLUMN_TO_TITEL) });
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'חבילות יומיות');

    XLSX.writeFile(wb, `${fileName}.xlsx`);
}

export function extractDailyReports(file: File) {
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

    if (REQUIRED_KEYS.some(key => headers[key]?.trim() != COLUMN_TO_TITEL[key].trim()))
        throw new Error("הקובץ אינו תקין, נא הורד קובץ לדוגמה")
}

// מרכז יום חבל מודיעין מופיע פעמיים בקובץ
function _unionDuplicates(reports: FutureReport[]) {
    const dictionary: Dictionary<FutureReport> = {};

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