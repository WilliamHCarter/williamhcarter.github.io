import { cp, mkdir, readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";

const [sourceDirectory, destinationDirectory, manifestPath] = process.argv.slice(2);

if (!sourceDirectory || !destinationDirectory || !manifestPath) {
  throw new Error("Usage: node scripts/stage-archives.mjs <source-dir> <destination-dir> <manifest-path>");
}

const releases = JSON.parse(await readFile(manifestPath, "utf8"));

if (!Array.isArray(releases)) {
  throw new Error(`Archive manifest must be an array: ${manifestPath}`);
}

if (releases.length === 0) {
  console.log("No archive releases are configured; skipping archive staging.");
  process.exit(0);
}

const sourceRoot = resolve(sourceDirectory);
const destinationRoot = resolve(destinationDirectory);
await mkdir(destinationRoot, { recursive: true });

for (const release of releases) {
  if (!release || typeof release.id !== "string" || !/^[a-z0-9]+(?:[a-z0-9-]*[a-z0-9])?$/.test(release.id)) {
    throw new Error(`Invalid archive release ID: ${JSON.stringify(release?.id)}`);
  }

  const source = resolve(sourceRoot, release.id);
  const destination = resolve(destinationRoot, release.id);

  if (!source.startsWith(`${sourceRoot}/`)) {
    throw new Error(`Archive release resolves outside the source directory: ${release.id}`);
  }

  try {
    if (!(await stat(source)).isDirectory()) {
      throw new Error("not a directory");
    }
  } catch {
    throw new Error(`Archive output is missing for configured release: ${release.id}`);
  }

  await cp(source, destination, { recursive: true, force: true });
  console.log(`Staged archive release: ${release.id}`);
}
