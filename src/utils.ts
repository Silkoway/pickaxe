export function err(msg: string) {
    console.error(`[ERROR] ${msg}`);
    process.exit(1);
}