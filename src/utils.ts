let file = ""

export function err(msg: string) {
    console.error(`[ERROR] ${msg}`);
    process.exit(1);
}

export function parseErr(msg: string, row: number, column: number) {
    console.error(`[PARSER] [ERROR] At row ${row}, column ${column}: ${msg}\n${file.split("\n")[row-1]}\n${"^".padStart(column-1, " ")}`);
    process.exit(1);
}

export function setupGlobalSource(_file: string) {
    file = _file;
}