export default function printLine(char: string): void {
    if (!process.stdout.columns) return;

    console.log(char.repeat(process.stdout.columns));
}
