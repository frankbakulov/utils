import { mt } from "./mod.ts";
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
	name: 'mt',
	async fn() {
		mt('test');

		await new Promise((resolve, reject) => setTimeout(() => {
			var t2 = mt('test');
			assertAlmostEquals(+t2.replace('test ', ''), 1, 0.1);
			resolve(true);
		}, 1000));
	},
});