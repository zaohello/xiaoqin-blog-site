import assert from "node:assert/strict";
import test from "node:test";
import { remarkReadingTime } from "../src/plugins/remark-reading-time.mjs";

function runPluginOnText(text) {
	const tree = {
		type: "root",
		children: [
			{
				type: "paragraph",
				children: [{ type: "text", value: text }],
			},
		],
	};
	const context = { data: { astro: { frontmatter: {} } } };
	remarkReadingTime()(tree, context);
	return context.data.astro.frontmatter;
}

test("rounds reading time up once content exceeds one minute", () => {
	const content = Array.from({ length: 241 }, () => "word").join(" ");
	const frontmatter = runPluginOnText(content);

	assert.equal(frontmatter.words, 241);
	assert.equal(frontmatter.minutes, 2);
});

test("keeps very short content at one minute minimum", () => {
	const content = Array.from({ length: 20 }, () => "word").join(" ");
	const frontmatter = runPluginOnText(content);

	assert.equal(frontmatter.minutes, 1);
});
