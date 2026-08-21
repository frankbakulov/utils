import {
	alertTelegram,
	removeHTML,
	argsToObject,
	addQuery,
	randomString,
	eq,
	objectDifferentKeys,
	objectUnion,
	readJsonSync,
	isObject,
	resolveObject,
	mt,
	sleep
} from "./mod.js";
import {
	assert,
	assertAlmostEquals,
	assertArrayIncludes,
	assertEquals,
	assertExists,
	assertFalse,
	assertMatch,
	assertNotEquals,
	assertObjectMatch,
	assertRejects,
	assertStrictEquals,
	assertThrows,
} from "jsr:@std/assert";


Deno.test({
	name: 'removeHTML',
	fn() {
		assertEquals(removeHTML('<p>Hello <b>world</b></p>'), 'Hello world\n');
		assertEquals(removeHTML('No HTML'), 'No HTML');
		assertEquals(removeHTML('Page<br>break'), `Page\nbreak`);
		assertEquals(removeHTML('<br/>Line1<br>Line2'), '\nLine1\nLine2');
	},
});

Deno.test({
	name: 'argsToObject',
	fn() {
		assertObjectMatch(argsToObject(['a=1', 'b=2a', 'c']), { a: 1, b: '2a', c: '' });
		assertObjectMatch(argsToObject([]), {});
	},
});

/* Deno.test({
	name: 'sleep',
	fn() {
		var now = new Date().getTime(), ms = 1000;
		return sleep(ms).then(() => {
			var then = new Date().getTime() - now;
			assertAlmostEquals(then, ms, 100);
		});
	}
});
 */
Deno.test({
	name: 'addQuery',
	fn() {
		const query = {};
		var params = new URLSearchParams('a=1&b[]=2&b[]=3&c[d]=4a');
		addQuery(query, params);
		assertObjectMatch(query, { a: 1, b: [2, 3], c: { d: '4a' } });
		params = { a: '1', 'b[2]': ['2', '3'], 'c[]': { d: '4a' } };
		addQuery(query, params);
		assertObjectMatch(query, { a: 1, b: { '2': ['2', '3'] }, c: [{ d: '4a' }] });
	},
});

Deno.test({
	name: 'randomString',
	fn() {
		const str = randomString(10, { case: 'all', numbers: true });
		assertEquals(str.length, 10);
		assertMatch(str, /^[a-zA-Z0-9]+$/);
	},
});

Deno.test({
	name: 'eq',
	fn() {
		assertFalse(eq(0, 1));
		assert(eq(0, []));
		assert(eq(0, {}));
		assert(eq(undefined, ''));
		assert(eq(null, {}));
		assert(eq(1, '1'));
		assert(eq([1, 2, null], ['1', '2', {}]));
		assertFalse(eq(
			{
				equipaje: 1,
				is_emergencia: 0,
				comment: "xzzzz!",
				id_Destino: 48,
				id_Chofer: null,
				status: "recibido",
				dt_start: "2026-04-09 12:02:00",
				RidePaxParada: [
					{ id_Parada: 40, id_Pax: 0, hora: "" },
					{ id_Parada: 43, id_Pax: 0, hora: "1" }
				]
			},
			{
				equipaje: 0,
				is_emergencia: 0,
				comment: "xzzzz!",
				id_Destino: 48,
				id_Chofer: null,
				status: "recibido",
				dt_start: "2026-04-09 12:02:00",
				RidePaxParada: [
					{ id_Parada: 42, id_Pax: 0, hora: undefined },
					{ id_Parada: 43, id_Pax: 0, hora: 1 }
				]
			}


		));
	},
});

Deno.test({
	name: 'objectDifferentKeys',
	fn() {
		assertArrayIncludes(objectDifferentKeys({ a: 1, b: 2 }, { a: 1, c: 3 }), ['b', 'c']);
		assertEquals(objectDifferentKeys({ a: 1 }, { a: 1 }), []);
	},
});

Deno.test({
	name: 'objectUnion',
	fn() {
		const obj = { a: 1 };
		objectUnion(obj, { b: 2, c: { d: 3 } });
		assertObjectMatch(obj, { a: 1, b: 2, c: { d: 3 } });
		objectUnion(obj, { c: { e: 4 } });
		assertObjectMatch(obj, { a: 1, b: 2, c: { d: 3, e: 4 } });
	},
});

Deno.test({
	name: 'isObject',
	fn() {
		assert(isObject({}));
		assert(isObject({ a: 1 }));
		assertFalse(isObject([]));
		assertFalse(isObject(null));
		assertFalse(isObject('string'));
	},
});

Deno.test({
	name: 'resolveObject',
	async fn() {
		const obj = {
			a: Promise.resolve(1),
			b: { c: Promise.resolve(2) },
			d: [Promise.resolve(3)]
		};
		const resolved = await resolveObject(obj);
		assertObjectMatch(resolved, { a: 1, b: { c: 2 }, d: [3] });
	},
});

/*
Deno.test({
	name: 'mt',
	async fn() {
		mt('test');

		await new Promise((resolve) => setTimeout(() => {
			var t2 = mt('test');
			assertAlmostEquals(+t2.replace('test ', ''), 1, 0.1);
			resolve(true);
		}, 1000));
	},
});
*/

// Note: alertTelegram and readJsonSync are not tested as they require external dependencies (network/file system)