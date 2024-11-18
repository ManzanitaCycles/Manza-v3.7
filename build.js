const esbuild = require('esbuild');

esbuild.build({
    entryPoints: ['./src/assets/js/index.js'], // Single entry point
    bundle: true, // Bundle all imports
    minify: true, // Compress the output
    outfile: 'public/assets/js/main.js', // Output file
    sourcemap: true, // Optional: generate source map
}).catch(() => process.exit(1));

