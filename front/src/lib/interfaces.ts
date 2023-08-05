export interface dataMap {
    [key: string]: string | number | boolean | Date | dataMap | null;
}