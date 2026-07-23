import { copyFile, mkdir, readFile, readdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'yaml';

const projectRoot = process.cwd();
const contentRoot = path.join(projectRoot, 'content', 'docs');
const outputRoot = path.join(projectRoot, 'public', 'audio');
const frontmatterPattern = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const audioSourcePattern = /^\.\/assets\/([a-zA-Z0-9][a-zA-Z0-9._-]*\.(?:mp3|m4a|ogg|wav))$/i;

async function findMdxFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return findMdxFiles(entryPath);
    return entry.isFile() && entry.name.endsWith('.mdx') ? [entryPath] : [];
  }));

  return nestedFiles.flat();
}

async function readAudioDeclaration(filePath) {
  const source = await readFile(filePath, 'utf8');
  const frontmatter = frontmatterPattern.exec(source);
  if (!frontmatter) return null;

  const data = parse(frontmatter[1]);
  if (!data?.audio) return null;

  const relativePath = path.relative(projectRoot, filePath);
  if (typeof data.slug !== 'string' || !slugPattern.test(data.slug)) {
    throw new Error(`${relativePath}: audio requires a valid slug`);
  }

  const audioSource = typeof data.audio === 'object' ? data.audio.src : undefined;
  const audioMatch = typeof audioSource === 'string' ? audioSourcePattern.exec(audioSource) : null;
  if (!audioMatch) {
    throw new Error(`${relativePath}: audio.src must reference a supported file in ./assets/`);
  }

  return {
    slug: data.slug,
    filename: audioMatch[1],
    sourcePath: path.join(path.dirname(filePath), 'assets', audioMatch[1]),
  };
}

async function syncPostAudio() {
  const mdxFiles = await findMdxFiles(contentRoot);
  const declarations = (await Promise.all(mdxFiles.map(readAudioDeclaration))).filter(Boolean);
  const destinations = new Map();

  await rm(outputRoot, { recursive: true, force: true });

  for (const declaration of declarations) {
    const sourceInfo = await stat(declaration.sourcePath).catch(() => null);
    if (!sourceInfo?.isFile()) {
      throw new Error(`Audio file not found: ${path.relative(projectRoot, declaration.sourcePath)}`);
    }

    const destinationPath = path.join(outputRoot, declaration.slug, declaration.filename);
    const previousSource = destinations.get(destinationPath);
    if (previousSource && previousSource !== declaration.sourcePath) {
      throw new Error(`Multiple audio files resolve to ${path.relative(projectRoot, destinationPath)}`);
    }
    if (previousSource) continue;

    await mkdir(path.dirname(destinationPath), { recursive: true });
    await copyFile(declaration.sourcePath, destinationPath);
    destinations.set(destinationPath, declaration.sourcePath);
  }

  console.log(`Synced ${destinations.size} post audio file(s).`);
}

await syncPostAudio();
