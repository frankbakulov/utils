export type Tquery = Record<string, any>;

interface TelegramConfig {
  host?: string;
  telegram_bot: string;
  telegram_alert_chat_id: string;
}

interface RandomStringOptions {
  case?: 'lower' | 'upper' | 'all';
  numbers?: boolean;
  symbols?: string;
}

export declare function alertTelegram(config: TelegramConfig, data: any, retry?: boolean): Promise<Response | false>;

export declare function removeHTML(s: any): string;

export declare function argsToObject(args: string[]): Tquery;

export declare function addQuery(query: Tquery, params: URLSearchParams | FormData): void;

export declare function randomString(length?: number, options?: RandomStringOptions): string;

export declare function eq(v1: any, v2: any): boolean;

export declare function objectDifferentKeys(o1: any, o2: any): string[];

export declare function objectUnion(obj: any, newObj: any): void;

export declare function readJsonSync(filename: string, ingoreNonexisting?: boolean): object;

export declare function isObject(s: any): boolean;

export declare function resolveObject(obj: object): Promise<object>;

export declare function mt(label?: string, reset?: boolean): string;