import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

async function loadImporter() {
	try {
		return await import("../scripts/import-media.js");
	} catch (error) {
		return { loadError: error };
	}
}

function makeTempDir(name) {
	return fs.mkdtempSync(path.join(os.tmpdir(), `${name}-`));
}

test("imports supported media files from a local folder into the blog assets directory", async () => {
	const { importMediaDirectory, loadError } = await loadImporter();
	assert.equal(
		typeof importMediaDirectory,
		"function",
		loadError?.stack ?? "Expected scripts/import-media.js to export importMediaDirectory",
	);

	const sourceDir = makeTempDir("source-media");
	const targetRoot = makeTempDir("target-assets");

	fs.writeFileSync(path.join(sourceDir, "cover image.PNG"), "cover");
	fs.writeFileSync(path.join(sourceDir, "notes.txt"), "ignore me");
	fs.writeFileSync(path.join(sourceDir, "photo 01.jpg"), "photo");

	const result = importMediaDirectory({
		sourceDir,
		targetRoot,
		targetFolderName: "谷歌 配置",
	});

	assert.equal(result.importedCount, 2);
	assert.equal(result.skippedCount, 1);
	assert.equal(path.basename(result.targetDir), "谷歌-配置");

	const importedNames = result.copiedFiles.map((item) => path.basename(item.targetPath)).sort();
	assert.deepEqual(importedNames, ["cover-image.png", "photo-01.jpg"]);
	assert.ok(fs.existsSync(path.join(result.targetDir, "cover-image.png")));
	assert.ok(fs.existsSync(path.join(result.targetDir, "photo-01.jpg")));
});

test("adds numeric suffixes when imported media names would collide", async () => {
	const { importMediaDirectory, loadError } = await loadImporter();
	assert.equal(
		typeof importMediaDirectory,
		"function",
		loadError?.stack ?? "Expected scripts/import-media.js to export importMediaDirectory",
	);

	const sourceDir = makeTempDir("source-media-collisions");
	const targetRoot = makeTempDir("target-assets-collisions");

	fs.writeFileSync(path.join(sourceDir, "my photo.png"), "first");
	fs.writeFileSync(path.join(sourceDir, "my@photo.png"), "second");

	const result = importMediaDirectory({
		sourceDir,
		targetRoot,
		targetFolderName: "album",
	});

	const importedNames = result.copiedFiles.map((item) => path.basename(item.targetPath)).sort();
	assert.deepEqual(importedNames, ["my-photo-2.png", "my-photo.png"]);
});
