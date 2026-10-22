import { cp, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(repositoryRoot, "content", "covers");
const destination = path.join(repositoryRoot, "web", "public", "covers");

await mkdir(destination, { recursive: true });
await cp(source, destination, { recursive: true });
