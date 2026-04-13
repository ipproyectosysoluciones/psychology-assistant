import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync, existsSync, cpSync, rmSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const srcDir = join(rootDir, 'src');
const distDir = join(rootDir, 'dist');

// Parse command line arguments
const isWatch = process.argv.includes('--watch');
const isMinify = !process.argv.includes('--no-minify');

// Clean dist directory
if (existsSync(distDir)) {
  rmSync(distDir, { recursive: true });
}
mkdirSync(distDir, { recursive: true });

/**
 * Build configuration for the server bundle
 */
const buildOptions = {
  entryPoints: [join(srcDir, 'server.ts')],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile: join(distDir, 'server.mjs'),
  format: 'esm',
  sourcemap: true,
  minify: isMinify,
  legalComments: 'none',
  external: [
    'pino',
    'pino-pretty',
    'express',
    'mongoose',
    'mongodb-memory-server',
    'bcryptjs',
    'jsonwebtoken',
    'dotenv',
    'cors',
    'helmet',
    'express-rate-limit',
    'express-validator',
    'otplib',
    'qrcode',
    'jest',
    '@jest/globals',
    'supertest',
    'node:*',
  ],
};

async function build() {
  console.log('🔨 Building with esbuild...');
  console.log(`   Mode: ${isMinify ? 'production (minified)' : 'development'}`);
  console.log(`   Entry: ${buildOptions.entryPoints}`);
  console.log(`   Output: ${buildOptions.outfile}`);

  try {
    if (isWatch) {
      const ctx = await esbuild.context(buildOptions);
      await ctx.watch();
      console.log('👀 Watching for changes...');
    } else {
      const result = await esbuild.build(buildOptions);
      const sizeKB = (result.outputFiles?.[0]?.contents.length / 1024).toFixed(2) || 'N/A';
      console.log(`✅ Build complete! Output size: ${sizeKB} KB`);
    }
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

build();
