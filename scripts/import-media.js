import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import crypto from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_TARGET_ROOT = path.resolve(scriptDir, "../public/assets");
const SUPPORTED_MEDIA_EXTENSIONS = new Set([
	".png",
	".jpg",
	".jpeg",
	".webp",
	".gif",
	".svg",
	".avif",
	".mp4",
	".webm",
	".mov",
]);

export function sanitizeSegment(value) {
	const normalized = value
		.normalize("NFKC")
		.trim()
		.replace(/[<>:"/\\|?*\u0000-\u001f]/g, " ")
		.replace(/[^\p{L}\p{N}\p{M}]+/gu, "-")
		.replace(/-+/g, "-")
		.replace(/^[.-]+|[.-]+$/g, "");

	return normalized || "media";
}

export function isSupportedMediaFile(fileName) {
	return SUPPORTED_MEDIA_EXTENSIONS.has(path.extname(fileName).toLowerCase());
}

function ensureDirectoryExists(dirPath) {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true });
	}
}

function collectFilePathsRecursively(rootDir) {
	const collected = [];

	function visit(currentDir) {
		const entries = fs
			.readdirSync(currentDir, { withFileTypes: true })
			.sort((left, right) => left.name.localeCompare(right.name, "zh-CN"));

		for (const entry of entries) {
			const entryPath = path.join(currentDir, entry.name);
			if (entry.isDirectory()) {
				visit(entryPath);
				continue;
			}

			if (entry.isFile()) {
				collected.push(entryPath);
			}
		}
	}

	visit(rootDir);
	return collected;
}

function getFileHash(filePath) {
	return crypto.createHash("sha1").update(fs.readFileSync(filePath)).digest("hex");
}

function resolveTargetPath(targetDir, originalFileName, sourcePath) {
	const originalExtension = path.extname(originalFileName);
	const extension = originalExtension.toLowerCase();
	const baseName = sanitizeSegment(path.basename(originalFileName, originalExtension)).toLowerCase();
	const safeBaseName = baseName || "media";
	const sourceHash = getFileHash(sourcePath);

	let attempt = 1;
	while (true) {
		const suffix = attempt === 1 ? "" : `-${attempt}`;
		const candidate = path.join(targetDir, `${safeBaseName}${suffix}${extension}`);
		if (!fs.existsSync(candidate)) {
			return { targetPath: candidate, duplicate: false };
		}
		if (getFileHash(candidate) === sourceHash) {
			return { targetPath: candidate, duplicate: true };
		}
		attempt += 1;
	}
}

export function importMediaDirectory({ sourceDir, targetRoot = DEFAULT_TARGET_ROOT, targetFolderName } = {}) {
	if (!sourceDir) {
		throw new Error("Please provide a source folder path.");
	}

	const resolvedSourceDir = path.resolve(sourceDir);
	if (!fs.existsSync(resolvedSourceDir)) {
		throw new Error(`Source folder does not exist: ${resolvedSourceDir}`);
	}

	const sourceStat = fs.statSync(resolvedSourceDir);
	if (!sourceStat.isDirectory()) {
		throw new Error(`Source path is not a folder: ${resolvedSourceDir}`);
	}

	const folderName = sanitizeSegment(targetFolderName || path.basename(resolvedSourceDir));
	const resolvedTargetRoot = path.resolve(targetRoot);
	const targetDir = path.join(resolvedTargetRoot, folderName);

	ensureDirectoryExists(resolvedTargetRoot);
	ensureDirectoryExists(targetDir);

	const files = collectFilePathsRecursively(resolvedSourceDir);

	const copiedFiles = [];
	let skippedCount = 0;
	let duplicateCount = 0;

	for (const sourcePath of files) {
		const fileName = path.basename(sourcePath);
		if (!isSupportedMediaFile(sourcePath)) {
			skippedCount += 1;
			continue;
		}

		const { targetPath, duplicate } = resolveTargetPath(targetDir, fileName, sourcePath);

		if (duplicate) {
			duplicateCount += 1;
			continue;
		}

		fs.copyFileSync(sourcePath, targetPath);

		copiedFiles.push({
			sourcePath,
			targetPath,
			relativeUrl: `/assets/${folderName}/${path.basename(targetPath)}`,
		});
	}

	if (copiedFiles.length === 0 && duplicateCount === 0) {
		throw new Error(`No supported media files found in: ${resolvedSourceDir}`);
	}

	return {
		sourceDir: resolvedSourceDir,
		targetDir,
		importedCount: copiedFiles.length,
		skippedCount,
		duplicateCount,
		copiedFiles,
	};
}

function formatResult(result) {
	const lines = [
		`Imported ${result.importedCount} media file(s).`,
		`Target folder: ${result.targetDir}`,
	];

	if (result.skippedCount > 0) {
		lines.push(`Skipped ${result.skippedCount} unsupported file(s).`);
	}
	if (result.duplicateCount > 0) {
		lines.push(`Skipped ${result.duplicateCount} identical file(s) already in the target folder.`);
	}

	lines.push("Files:");
	for (const file of result.copiedFiles) {
		lines.push(`- ${path.basename(file.targetPath)} -> ${file.relativeUrl}`);
	}

	return lines.join("\n");
}

function printUsage() {
	console.log("Usage: npm run import-media -- <source-folder> [target-folder-name]");
}

function runCli() {
	const args = process.argv.slice(2);
	if (args.length === 0) {
		printUsage();
		process.exitCode = 1;
		return;
	}

	try {
		const result = importMediaDirectory({
			sourceDir: args[0],
			targetFolderName: args[1],
		});

		console.log(formatResult(result));
	} catch (error) {
		console.error(`Error: ${error.message}`);
		process.exitCode = 1;
	}
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	runCli();
}
