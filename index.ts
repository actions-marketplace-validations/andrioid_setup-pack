import { addPath, getInput, setFailed } from "@actions/core";
import os from "os";
import cache from "@actions/tool-cache";
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

    let toolPath = cache.find("pack", version, arch);
    if (!toolPath) {
      const context: { [key: string]: string } = {
        arch,
        platform,
        version,
      };
      const rendered = url.replace(/\{(\w+?)\}/g, (a, match) => {
        return context[match] || "";
      });

      const downloadPath = await cache.downloadTool(rendered);
      toolPath = await cache.cacheFile(
        downloadPath,
        FILENAME,
        FILENAME,
        version
      );
    }

    await chmod(path.join(toolPath, FILENAME), 0o755);
    addPath(toolPath);
  } catch (err) {
    setFailed(err.message);
  }
}
