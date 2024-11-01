const esbuild = require('esbuild');
const path = require('path');

const fs = require('fs-extra');
fs.removeSync('./dist');

esbuild.build({
  entryPoints: [path.resolve(__dirname, 'src/index.ts')],
  bundle: true,
  format: 'esm',
  jsx: 'automatic',
  outfile: path.resolve(__dirname, 'dist/index.js'),
}).catch(() => process.exit(1));

const sourceDir = './src'; 
const destDir = './dist';

async function copyScssFiles() {
    try {
        await fs.copy(sourceDir, destDir, {
            filter: (src) => {
                const isScss = src.endsWith('.scss');
                const isDirectory = fs.statSync(src).isDirectory();
                return isScss || isDirectory;
            }
        });
        console.log('Copied .scss files and folders to dist!');
    } catch (err) {
        console.error(err);
    }
}

copyScssFiles();