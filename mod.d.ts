export interface AlertTelegramConfig {
    telegram_bot: string;
    telegram_alert_chat_id: string | number;
    host?: string;
}

export interface RandomStringOptions {
    case?: 'lower' | 'upper' | 'all';
    numbers?: boolean;
    symbols?: string;
}

export function alertTelegram(
    config: AlertTelegramConfig,
    data: unknown,
    retry?: boolean
): Promise<Response | false>;

export function removeHTML(s: unknown): string | 0;

export function argsToObject(
    args: string[],
    stringFields?: string[]
): Record<string, unknown>;

export function addQuery(
    query: Record<string, unknown>,
    params: URLSearchParams | Record<string, unknown>,
    stringFields?: string[]
): void;

export function ucfirst(s: unknown): unknown;

export function randomString(
    length?: number,
    options?: RandomStringOptions
): string;

export function eq(v1: any, v2: any): boolean;

/**
 * @description get keys with values that are different
 */
export function objectDifferentKeys(
    o1: Record<string, unknown> | null | undefined,
    o2: Record<string, unknown> | null | undefined
): string[];

export function objectUnion(
    obj: Record<string, unknown>,
    newObj: unknown
): void;

export function readJsonSync(
    filename: string,
    ingoreNonexisting?: boolean
): any;

export function writeJsonSync(
    data: unknown,
    filename: string,
    options?: { format?: boolean }
): void;

export function isDir(p: string): boolean;

export function readDirSync(p: string): string[];

export function isObject(s: unknown): s is Record<string, unknown>;

export function is(s: unknown): boolean;

export function sleep(ms: number): Promise<void>;

export function resolveObject<T = any>(obj: T): Promise<T>;

export function mt(
    label?: string,
    reset?: boolean,
    returnNumber?: boolean
): string | number;