import * as XLSX from 'xlsx';

interface Dictionary<T> {
    [index: string]: T
}

const COLUMN_TO_KEY: Dictionary<string> = {
    A: "district",
    B: "municipalitySymbol",
    D: "municipalityName",
    E: "homeFrontCommandDistrict",
    F: "napa",
    H: "id",
    I: "name",
    O: "address",
    Q: "amount"
}

export function extractDailyReports(file: File) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = event => {
            const binaryData = reader.result;
            const workBook = XLSX.read(binaryData, { type: 'binary' });

            if (!workBook.Sheets["ריכוז"]) reject("הקובץ לא בפורמט הנכון");

            const data = XLSX.utils.sheet_to_json(workBook.Sheets["ריכוז"], { header: "A", raw: true, });

            resolve(data.slice(1).map(_convertToReport).filter(_ => _.id));
        }

        reader.addEventListener("error", reject);

        reader.readAsBinaryString(file);
    });

}

function _convertToReport(item: any) {
    return Object.keys(COLUMN_TO_KEY).map(key => ({ [COLUMN_TO_KEY[key]]: item[key] }))
        .reduce((a, b) => ({ ...a, ...b }), {});
}