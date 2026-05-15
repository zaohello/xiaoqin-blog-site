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

test("skips importing an identical file that already exists in the target folder", async () => {
	const { importMediaDirectory, loadError } = await loadImporter();
	assert.equal(
		typeof importMediaDirectory,
		"function",
		loadError?.stack ?? "Expected scripts/import-media.js to export importMediaDirectory",
	);

	const sourceDir = makeTempDir("source-media-duplicate-skip");
	const targetRoot = makeTempDir("target-assets-duplicate-skip");
	const targetDir = path.join(targetRoot, "album");

	fs.mkdirSync(targetDir, { recursive: true });
	fs.writeFileSync(path.join(targetDir, "same-file.png"), "identical");
	fs.writeFileSync(path.join(sourceDir, "same file.png"), "identical");

	const result = importMediaDirectory({
		sourceDir,
		targetRoot,
		targetFolderName: "album",
	});

	assert.equal(result.importedCount, 0);
	assert.equal(result.duplicateCount, 1);
	assert.deepEqual(result.copiedFiles, []);
	assert.deepEqual(
		fs.readdirSync(targetDir).sort(),
		["same-file.png"],
	);
});

test("imports supported media files from nested subfolders when the selected folder has no files at the top level", async () => {
	const { importMediaDirectory, loadError } = await loadImporter();
	assert.equal(
		typeof importMediaDirectory,
		"function",
		loadError?.stack ?? "Expected scripts/import-media.js to export importMediaDirectory",
	);

	const sourceDir = makeTempDir("source-media-nested");
	const targetRoot = makeTempDir("target-assets-nested");
	const nestedDir = path.join(sourceDir, "2026-05");

	fs.mkdirSync(nestedDir, { recursive: true });
	fs.writeFileSync(path.join(nestedDir, "first image.png"), "first");
	fs.writeFileSync(path.join(nestedDir, "second image.jpg"), "second");
	fs.writeFileSync(path.join(nestedDir, "notes.txt"), "ignore me");

	const result = importMediaDirectory({
		sourceDir,
		targetRoot,
		targetFolderName: "gallery",
	});

	assert.equal(result.importedCount, 2);
	assert.equal(result.skippedCount, 1);

	const importedNames = result.copiedFiles.map((item) => path.basename(item.targetPath)).sort();
	assert.deepEqual(importedNames, ["first-image.png", "second-image.jpg"]);
	assert.ok(fs.existsSync(path.join(result.targetDir, "first-image.png")));
	assert.ok(fs.existsSync(path.join(result.targetDir, "second-image.jpg")));
});
