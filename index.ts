import { addPath, getInput, setFailed, info } from "@actions/core";
import os from "os";
import cache, { extractTar } from "@actions/tool-cache";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const chmod = promisify(fs.chmod);

const FILENAME = "pack";

async function main() {
  try {
    const url = getInput("pack-url");
    const version = getInput("pack-version");
    const platform = "linux"; // TODO: Add other platforms
    let arch = os.arch();
    if (arch === "x64") {
      arch = "amd64";
    }

    let toolPath = cache.find(FILENAME, version, arch);
    if (!toolPath || true) {
      // TODO: enable caching when this works
      const context: { [key: string]: string } = {
        PLATFORM: platform,
        PACK_VERSION: version,
      };
      const rendered = url.replace(/\{(\w+?)\}/g, (a, match) => {
        return context[match] || "";
      });

      const downloadPath = await cache.downloadTool(rendered);
      const extractedPath = path.join(
        await extractTar(downloadPath),
        "FILENAME"
      );
      toolPath = await cache.cacheFile(
        extractedPath,
        FILENAME,
        FILENAME,
        version
      );
    }

    info("toolpath:" + toolPath);

    await chmod(path.join(toolPath, FILENAME), 0o755);
    addPath(toolPath);
  } catch (err) {
    setFailed(err.message);
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err.stack);
    process.exit(1);
  });
}
