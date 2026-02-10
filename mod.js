/* @ts-self-types="./mod.d.ts" */
import * as util from 'node:util';
import { escape, unescape } from '@std/html';

export function alertTelegram(config, data, retry = true) {
	var text = typeof data === 'string' ? data : JSON.stringify(util.inspect(
		data instanceof Error ? (data.stack || data.message) : data, false, 999));

	if (text.length > 600) {
		text = escape(removeHTML(text).slice(0, 600));
	}

	return fetch(config.telegram_bot, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			chat_id: config.telegram_alert_chat_id,
			parse_mode: 'HTML',
			text: (config.host ?? 'unknown host') + ' - ' + text,
		})
	}).then(r => {
		return r.ok ? r : (retry ? alertTelegram(config, `error sending alert text ${text.slice(0, 50)}, ${JSON.stringify(r)}`, false) : false);
	});
}

export function removeHTML(s) {
	if (s === 0) return s;
	if (!s) return '';

	s = String(s);

	s = s.replace(/(<br\s*\/?>)/g, '\n')
		.replace(/(<\/(li|p)\s*>)/g, '$1\n')
		.replace(/<([a-zA-Z][^>]*|\/?[a-zA-Z]+[^>]*)>/g, '');

	return unescape(s);
}

export function argsToObject(args) {
	var query = {};
	args.forEach((arg) => {
		var [k, v] = arg.split('=');
		query[k] = v ?? true;
	});
	return query;
}

export function addQuery(query, params) {
	[...params.keys()].forEach((key) => {
		var value;

		if (key.endsWith('[]')) {
			value = params.getAll(key);
			key = key.slice(0, -2);
		} else {
			value = params.get(key);
		}

		let x = key.match(/^(\w+)\[(\w+)\]$/);
		if (x) {
			key = x[1];
			value = { ...(query[key] || {}), [x[2]]: value };
		}

		query[key] = value;
	});
}

export function randomString(length = 4, options = { case: 'lower', numbers: false, symbols: '' }) {
	options.case ||= 'lower';

	var chars = '',
		result = '';

	if (options.case === 'upper' || options.case === 'all') {
		chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	}
	if (options.case === 'lower' || options.case === 'all') {
		chars += 'abcdefghijklmnopqrstuvwxyz';
	}
	if (options.numbers) {
		chars += '0123456789';
	}
	if (options.symbols) {
		chars += options.symbols;
	}

	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}

	return result;
}

export function eq(v1, v2) {
	if (!v1 && !v2) {
		return v1 === 0 && v2 === 0 || (v1 !== 0 && v2 !== 0);
	}

	if (Object.keys(v1).length != Object.keys(v2).length) return false;

	for (const k1 in v1) {
		if (typeof v1[k1] === 'object' && typeof v2[k1] === 'object') {
			if (!eq(v1[k1], v2[k1])) return false;
			continue;
		}

		if (v2[k1] === undefined || v1[k1] != v2[k1]) return false;
	}

	return true;
}

/**
* @description get keys with values that are different
*/
export function objectDifferentKeys(o1, o2) {
	var r = [];
	o1 ||= {};
	o2 ||= {};
	for (var [k1, v1] of Object.entries(o1)) {
		v1 === o2[k1] || r.push(k1);
	}
	return r.concat(Object.keys(o2).filter(k2 => o1[k2] === undefined));
}

export function objectUnion(obj, newObj) {
	if (!isObject(newObj)) return;

	for (let [k, v] of Object.entries(newObj)) {
		if (obj[k] === undefined) {
			obj[k] = v;
		} else if (isObject(obj[k]) && isObject(v)) {
			objectUnion(obj[k], v);
		}
	}
}

export function readJsonSync(filename, ingoreNonexisting = false) {
	var res;
	try {
		res = JSON.parse(Deno.readTextFileSync(filename));
	} catch (e) {
		if (e.code === 'ENOENT' && ingoreNonexisting) {
			res = {};
		} else {
			throw e;
		}
	}

	return res;
}

export function writeJsonSync(data, filename, options = { format: false }) {
	var text = JSON.stringify(data, null, options.format ? '\t' : 0);
	filename.endsWith('.json') || (filename += '.json');
	try {
		Deno.writeTextFileSync(filename, text);
	} catch (e) {
		if (e.code === 'ENOENT') {
			Deno.mkdirSync(filename.split('/').slice(0, -1).join('/'), { recursive: true });
			Deno.writeTextFileSync(filename, text);
		} else {
			throw e;
		}
	}
}

export function isObject(s) {
	return s && Object.getPrototypeOf(s) === Object.prototype;
}

export function resolveObject(obj) {
	var ps = [],
		resolveValues = (obj) => {
			if (Array.isArray(obj)) {
				obj.forEach((value, i) => resolveOne(value, i, obj));
			} else if (obj && typeof obj === 'object') {
				Object.keys(obj).forEach(key => resolveOne(obj[key], key, obj));
			}
		},
		resolveOne = (value, key, obj) => {
			if (value?.then) {
				ps.push(value.then((value) => obj[key] = value));
			} else if (typeof value === 'object') {
				resolveValues(value);
			}
			return value;
		};

	resolveValues(obj);
	return Promise.all(ps).then(() => obj);
}

var ts = {};
export function mt(label = '', reset = false) {
	var res = '', now = Date.now();

	if (!reset) {
		if (ts[label]) {
			res = `${label} ${String((now - ts[label]) / 1000).padEnd(5, '0')}`.trim();
		}
	}

	ts[label] = now;

	return res;
}