import path from 'node:path';
import fs from 'node:fs';
import type { ViteDevServer, Plugin } from 'vite';

interface Options {
  mockDir?: string;
}

const moduleCache = new Map<string, any>();

export default function vitePluginMockResponse(options: Options): Plugin {
  const { mockDir = 'mock' } = options || {};

  return {
    name: 'vitePluginMockResponse',
    configureServer: async server => {
      await collectModuleCache(mockDir);
      watchMockFile(mockDir, server);
      registerMockServer(server);
    }
  };
}

function registerMockServer(server: ViteDevServer) {
  server.middlewares.use(async (req, res, next) => {
    for (const [, module] of moduleCache) {
      for (const responder of module) {
        if (req.url === responder?.url) {
          const { response, headers, method } = responder;
          if (req.method?.toLocaleUpperCase() === method?.toLocaleUpperCase()) {
            if (typeof response === 'function') {
              const result = await response(req, res);
              res.statusCode = result?.status || 200;
              if (typeof headers === 'object' && headers !== null) {
                Object.entries(headers).map(([name, value]) => {
                  res.setHeader(name, value as string | number);
                });
              }
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result));
              return;
            }
          }
        }
      }
    }
    next();
  });
}

function watchMockFile(mockDir: string, server: ViteDevServer) {
  server.watcher.on('all', async (event, changedPath) => {
    const mockPath = path.resolve(process.cwd(), mockDir);
    if (changedPath.startsWith(mockPath)) {
      if (['add', 'change', 'addDir'].includes(event)) {
        await updateModuleCache(changedPath);
      }
      if (['unlink', 'unlinkDir'].includes(event)) {
        deleteModuleCache(changedPath);
      }
    }
  });
}

async function updateModuleCache(filePath: string) {
  const changedFilePaths: string[] = [];
  collectFilePath(filePath, changedFilePaths);
  for (const changedFile of changedFilePaths) {
    // 禁用动态导入的模块缓存
    const changedModule = await import(
      `file://${changedFile}?v=${Date.now()})`
    );
    const moduleCode = changedModule?.default;
    if (moduleCode && Array.isArray(moduleCode)) {
      moduleCache.set(changedFile, moduleCode);
    }
  }
}

function deleteModuleCache(filePath: string) {
  for (const [cacheFilePath] of moduleCache) {
    if (cacheFilePath.startsWith(filePath)) {
      moduleCache.delete(cacheFilePath);
    }
  }
}

async function collectModuleCache(mockDir: string) {
  const mockFilePath = getMockFilePath(mockDir);
  for (const filePath of mockFilePath) {
    const module = (await import(`file://${filePath}`)).default;
    if (Array.isArray(module)) {
      moduleCache.set(filePath, module);
    }
  }
}

function getMockFilePath(mockDir: string) {
  const mockDirPath = path.resolve(process.cwd(), mockDir);
  const pathCollection: string[] = [];
  collectFilePath(mockDirPath, pathCollection);
  return pathCollection;
}

function collectFilePath(file: string, pathCollection: string[]) {
  if (isDirectory(file)) {
    const childFile = fs.readdirSync(file);
    if (childFile.length > 0) {
      for (const child of childFile) {
        const childPath = path.join(file, child);
        if (isDirectory(childPath)) {
          collectFilePath(childPath, pathCollection);
        } else {
          pathCollection.push(childPath);
        }
      }
    }
  } else {
    pathCollection.push(file);
  }
}

function isDirectory(path: string): boolean {
  const fileStat = fs.statSync(path);
  return fileStat.isDirectory();
}
