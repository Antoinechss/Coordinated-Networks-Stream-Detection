var __addDisposableResource = (this && this.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (this && this.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        var r, s = 0;
        function next() {
            while (r = env.stack.pop()) {
                try {
                    if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
                    if (r.dispose) {
                        var result = r.dispose.call(r.value);
                        if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                    }
                    else s |= 1;
                }
                catch (e) {
                    fail(e);
                }
            }
            if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
import assert from 'node:assert';
import { mkdir, rm, stat, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { IndentationText, Project } from 'ts-morph';
import { buildFilter } from './filter.js';
import { FilteredIndexer } from './filtered-indexer.js';
import { Formatter } from './formatter.js';
import { LexDefBuilder } from './lex-def-builder.js';
import { LexiconDirectoryIndexer } from './lexicon-directory-indexer.js';
import { asNamespaceExport } from './ts-lang.js';
/**
 * Main builder class for generating TypeScript schemas from Lexicon documents.
 *
 * The LexBuilder orchestrates the entire code generation process:
 * 1. Loading and indexing lexicon documents from the filesystem
 * 2. Generating TypeScript type definitions and runtime schemas
 * 3. Creating namespace export trees for convenient imports
 * 4. Saving formatted output files
 *
 * @example
 * ```ts
 * const builder = new LexBuilder({ indexFile: true, pretty: true })
 *
 * // Load lexicons from a directory
 * await builder.load({ lexicons: './lexicons' })
 *
 * // Save generated TypeScript to output directory
 * await builder.save({ out: './src/generated', clear: true })
 * ```
 */
export class LexBuilder {
    #imported = new Set();
    #project = new Project({
        useInMemoryFileSystem: true,
        manipulationSettings: { indentationText: IndentationText.TwoSpaces },
    });
    constructor(options = {}) {
        this.options = options;
    }
    get fileExt() {
        return this.options.fileExt ?? '.ts';
    }
    get importExt() {
        return this.options.importExt ?? '.js';
    }
    async load(options) {
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
            const indexer = __addDisposableResource(env_1, new FilteredIndexer(new LexiconDirectoryIndexer(options), buildFilter(options)), true);
            for await (const doc of indexer) {
                if (!this.#imported.has(doc.id)) {
                    this.#imported.add(doc.id);
                }
                else {
                    throw new Error(`Duplicate lexicon document id: ${doc.id}`);
                }
                await this.createDefsFile(doc, indexer);
                await this.createExportTree(doc);
            }
        }
        catch (e_1) {
            env_1.error = e_1;
            env_1.hasError = true;
        }
        finally {
            const result_1 = __disposeResources(env_1);
            if (result_1)
                await result_1;
        }
    }
    async save(options) {
        const files = this.#project.getSourceFiles();
        const destination = resolve(options.out);
        if (options.clear) {
            await rm(destination, { recursive: true, force: true });
        }
        else if (!options.override) {
            await Promise.all(files.map(async (f) => assertNotFileExists(join(destination, f.getFilePath()))));
        }
        const formatter = new Formatter(options);
        await Promise.all(Array.from(files, async (file) => {
            const filePath = join(destination, file.getFilePath());
            const content = await formatter.format(file.getFullText());
            await mkdir(join(filePath, '..'), { recursive: true });
            await rm(filePath, { recursive: true, force: true });
            await writeFile(filePath, content, 'utf8');
        }));
    }
    createFile(path) {
        return this.#project.createSourceFile(path);
    }
    getFile(path) {
        return this.#project.getSourceFile(path) || this.createFile(path);
    }
    async createExportTree(doc) {
        const namespaces = doc.id.split('.');
        if (this.options.indexFile) {
            const indexFile = this.getFile(`/index${this.fileExt}`);
            const tldNs = namespaces[0];
            assert(tldNs !== 'index', 'The "indexFile" options cannot be used with namespaces using a ".index" tld.');
            const tldNsSpecifier = `./${tldNs}${this.importExt}`;
            if (!indexFile.getExportDeclaration(tldNsSpecifier)) {
                indexFile.addExportDeclaration({
                    moduleSpecifier: tldNsSpecifier,
                    namespaceExport: asNamespaceExport(tldNs),
                });
            }
        }
        // First create the parent namespaces
        for (let i = 0; i < namespaces.length - 1; i++) {
            const currentNs = namespaces[i];
            const childNs = namespaces[i + 1];
            const path = join('/', ...namespaces.slice(0, i + 1));
            const file = this.getFile(`${path}${this.fileExt}`);
            const childModuleSpecifier = `./${currentNs}/${childNs}${this.importExt}`;
            const dec = file.getExportDeclaration(childModuleSpecifier);
            if (!dec) {
                file.addExportDeclaration({
                    moduleSpecifier: childModuleSpecifier,
                    namespaceExport: asNamespaceExport(childNs),
                });
            }
        }
        // The child file exports the schemas (as *)
        const path = join('/', ...namespaces);
        const file = this.getFile(`${path}${this.fileExt}`);
        file.addExportDeclaration({
            moduleSpecifier: `./${namespaces.at(-1)}.defs${this.importExt}`,
        });
        if (this.options.defsExport) {
            // @NOTE Individual exports exports from the defs file might conflict with
            // child namespaces. For this reason, we also add a namespace export for the
            // defs (export * as $defs from './xyz.defs.js'). This is an escape hatch
            // allowing to still access the definitions if a hash get shadowed by a
            // child namespace.
            file.addExportDeclaration({
                moduleSpecifier: `./${namespaces.at(-1)}.defs${this.importExt}`,
                namespaceExport: '$defs',
            });
        }
        if (this.options.defaultExport && doc.defs.main != null) {
            // export { main as default } from './xyz.defs.js'
            file.addExportDeclaration({
                moduleSpecifier: `./${namespaces.at(-1)}.defs${this.importExt}`,
                namedExports: [{ name: 'main', alias: 'default' }],
            });
        }
    }
    async createDefsFile(doc, indexer) {
        const path = join('/', ...doc.id.split('.'));
        const file = this.createFile(`${path}.defs${this.fileExt}`);
        const fileBuilder = new LexDefBuilder(this.options, file, doc, indexer);
        await fileBuilder.build();
    }
}
async function assertNotFileExists(file) {
    try {
        await stat(file);
        throw new Error(`File already exists: ${file}`);
    }
    catch (err) {
        if (err instanceof Error && 'code' in err && err.code === 'ENOENT')
            return;
        throw err;
    }
}
//# sourceMappingURL=lex-builder.js.map