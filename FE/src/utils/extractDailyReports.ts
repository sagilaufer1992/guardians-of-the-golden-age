import * as XLSX from 'xlsx';

interface Dictionary<T> {
    [index: string]: T
}

interface FutureReport extends Branch {
    amount: number;
}

const COLUMN_TO_KEY: Dictionary<string> = {
    A: "district",
    B: "napa",
    C: "municipality",
    D: "name",
    E: "id",
    F: "address",
    I: "amount"
}

//TODO: לשנות לשם אמיתי שנתחיל לטעון קבצים ממשתמשים
const SHEET_NAME ="פורמט טעינה";

export function extractDailyReports(file: File) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = event => {
            const binaryData = reader.result;
            const workBook = XLSX.read(binaryData, { type: 'binary' });

            if (!workBook.Sheets[SHEET_NAME]) reject("הקובץ לא בפורמט הנכון");

            const data = XLSX.utils.sheet_to_json(workBook.Sheets[SHEET_NAME], { header: "A", raw: true, });
            const reports = data.slice(1).map(_convertToReport).filter(_ => _.id) as FutureReport[];
            
            resolve(_unionDuplicates(reports));
        }

        reader.addEventListener("error", reject);

        reader.readAsBinaryString(file);
    });

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