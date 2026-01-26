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
	mt
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
		assertObjectMatch(argsToObject(['a=1', 'b=2', 'c']), { a: '1', b: '2', c: true });
		assertObjectMatch(argsToObject([]), {});
	},
});

Deno.test({
	name: 'addQuery',
	fn() {
		const query = {};
		const params = new URLSearchParams('a=1&b[]=2&b[]=3&c[d]=4');
		addQuery(query, params);
		assertObjectMatch(query, { a: '1', b: ['2', '3'], c: { d: '4' } });
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
		assert(eq({ a: 1 }, { a: 1 }));
		assertFalse(eq({ a: 1 }, { a: 2 }));
		assert(eq([1, 2], [1, 2]));
		assertFalse(eq([1, 2], [1, 3]));
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

// Note: alertTelegram and readJsonSync are not tested as they require external dependencies (network/file system)