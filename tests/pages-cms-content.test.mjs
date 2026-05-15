import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const contentRoot = path.resolve("src/content");
const markdownFiles = collectMarkdownFiles(contentRoot);

function collectMarkdownFiles(dir, acc = []) {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			collectMarkdownFiles(fullPath, acc);
			continue;
		}
		if (fullPath.endsWith(".md") || fullPath.endsWith(".mdx")) {
			acc.push(fullPath);
		}
	}
	return acc.sort();
}

function hasUtf8Bom(buffer) {
	return buffer.length >= 3 && buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf;
}

test("Pages CMS managed markdown files do not start with a UTF-8 BOM", () => {
	const filesWithBom = markdownFiles.filter((file) => hasUtf8Bom(fs.readFileSync(file)));

	assert.deepEqual(
		filesWithBom,
		[],
		`These content files start with a UTF-8 BOM and can break Pages CMS frontmatter parsing:\n${filesWithBom.join("\n")}`,
	);
});
