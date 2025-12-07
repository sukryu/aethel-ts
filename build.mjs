import * as esbuild from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdir, mkdir } from 'fs/promises';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isWatch = process.argv.includes('--watch');
const isProduction = process.argv.includes('--production');

/**
 * Recursively find all TypeScript files in a directory
 */
async function findTypeScriptFiles(dir, fileList = []) {
  const files = await readdir(dir, { withFileTypes: true });
  
  for (const file of files) {
    const path = join(dir, file.name);
    
    if (file.isDirectory() && file.name !== 'node_modules' && file.name !== 'dist') {
      await findTypeScriptFiles(path, fileList);
    } else if (file.isFile() && file.name.endsWith('.ts')) {
      fileList.push(path);
    }
  }
  
  return fileList;
}

/**
 * Ensure dist directory exists
 */
async function ensureDistDirectory() {
  if (!existsSync(join(__dirname, 'dist'))) {
    await mkdir(join(__dirname, 'dist'), { recursive: true });
  }
}

/**
 * Build configuration
 */
async function createBuildConfig() {
  // Find all TypeScript entry points in src only (for npm publish)
  const srcFiles = await findTypeScriptFiles(join(__dirname, 'src'));
  
  // In development, also include benchmark files
  let allEntryPoints = srcFiles;
  if (!isProduction) {
    const benchmarkFiles = await findTypeScriptFiles(join(__dirname, 'benchmark'));
    allEntryPoints = [...srcFiles, ...benchmarkFiles];
  }

  return {
    entryPoints: allEntryPoints,
    bundle: false,
    platform: 'node',
    target: 'node18',
    format: 'esm',
    outdir: 'dist',
    outExtension: { '.js': '.js' },
    sourcemap: true,
    minify: isProduction,
    keepNames: true,
    treeShaking: isProduction,
    logLevel: 'info',
  };
}

/**
 * Main build function
 */
async function build() {
  console.log('🔨 Aethel.TS Build System');
  console.log('═'.repeat(50));
  console.log(`Mode: ${isProduction ? 'Production' : 'Development'}`);
  console.log(`Watch: ${isWatch ? 'Enabled' : 'Disabled'}`);
  console.log('═'.repeat(50));
  console.log('');

  try {
    // Ensure dist directory exists
    await ensureDistDirectory();

    // Create build configuration
    const config = await createBuildConfig();
    
    console.log(`📦 Found ${config.entryPoints.length} TypeScript files to build`);
    console.log('');

    if (isWatch) {
      // Watch mode
      const ctx = await esbuild.context(config);
      await ctx.watch();
      console.log('👀 Watching for changes...');
      console.log('💡 Press Ctrl+C to stop watching');
    } else {
      // Single build
      const result = await esbuild.build(config);
      
      console.log('✅ Build completed successfully');
      console.log('');
      console.log('📊 Build Statistics:');
      console.log(`   - Output directory: ${config.outdir}/`);
      console.log(`   - Files processed: ${config.entryPoints.length}`);
      console.log(`   - Source maps: ${config.sourcemap ? 'Enabled' : 'Disabled'}`);
      console.log(`   - Minification: ${config.minify ? 'Enabled' : 'Disabled'}`);
      console.log('');
      
      if (result.errors.length > 0) {
        console.error('❌ Build errors:', result.errors);
        process.exit(1);
      }
      
      if (result.warnings.length > 0) {
        console.warn('⚠️  Build warnings:', result.warnings);
      }
    }
  } catch (error) {
    console.error('');
    console.error('❌ Build failed:');
    console.error(error);
    console.error('');
    process.exit(1);
  }
}

// Run the build
build();