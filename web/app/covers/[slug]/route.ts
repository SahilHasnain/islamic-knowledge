import { readFile } from "node:fs/promises";
import path from "node:path";

type Props = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Props) {
  const { slug } = await params;
  const coverName = slug.match(/^([a-z0-9-]+)\.png$/)?.[1];
  if (!coverName) {
    return new Response("Not found", { status: 404 });
  }

  const repositoryRoot = path.basename(process.cwd()) === "web"
    ? path.resolve(process.cwd(), "..")
    : process.cwd();
  const coverPath = path.join(repositoryRoot, "content", "covers", `${coverName}.png`);

  try {
    const cover = await readFile(coverPath);
    return new Response(cover, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": "image/png",
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return new Response("Not found", { status: 404 });
    }
    throw error;
  }
}
