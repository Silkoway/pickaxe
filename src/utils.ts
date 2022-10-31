export function err(msg: string) {
    console.error(`[ERROR] ${msg}`);
    process.exit(1);
}

export function parseErr(msg: string, row: number, column: number) {
    console.error(`[PARSER] [ERROR] At row ${row}, column ${column}: ${msg}`);
    process.exit(1);
}