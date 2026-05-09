import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['app.js'],
  bundle: true,
  outfile: 'dist/app.bundle.js',
  format: 'esm'
});
