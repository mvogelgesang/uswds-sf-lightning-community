// scripts/build-uswds.js
const sass = require("sass");
const fs = require("fs-extra");
const archiver = require("archiver");
const path = require("path");
const chokidar = require("chokidar"); // For watch mode
const Terser = require("terser");
const cssnano = require("cssnano");
const postcss = require("postcss");

const paths = {
  scssEntry: path.join(__dirname, "../src/scss/theme.scss"),
  jsEntry: path.join(__dirname, "../src/js/uswds-initializer.js"),
  assetsSrc: path.join(__dirname, "../src/assets"),
  outputDir: path.join(
    __dirname,
    "../force-app/main/default/staticresources/uswds_assets"
  ), // Direct output dir
  zipDest: path.join(
    __dirname,
    "../force-app/main/default/staticresources/uswds_assets.zip"
  ),
  staticResourceMeta: path.join(
    __dirname,
    "../force-app/main/default/staticresources/uswds_assets.resource-meta.xml"
  )
};

const staticResourceMetaContent = `<?xml version="1.0" encoding="UTF-8"?>
<StaticResource xmlns="http://soap.sforce.com/2006/04/metadata">
    <cacheControl>Public</cacheControl>
    <contentType>application/zip</contentType>
    <description>USWDS compiled assets (CSS, JS, fonts, images) - Note: This meta file is for compatibility but assets are deployed directly.</description>
</StaticResource>`;

async function compileSass() {
  console.log("Compiling SASS...");
  try {
    const result = sass.compile(paths.scssEntry, {
      style: "expanded", // Compile expanded first for better debugging
      loadPaths: [
        path.join(__dirname, "../node_modules"),
        path.join(__dirname, "../node_modules/@uswds/uswds/dist/scss"),
        path.join(__dirname, "../node_modules/@uswds/uswds/packages"),
        path.join(__dirname, "../node_modules/@uswds/uswds/dist")
      ], // Add proper paths for USWDS imports
      quietDeps: true // Suppress warnings from dependencies
    });

    // Minify CSS
    const minifiedCss = await postcss([cssnano]).process(result.css, {
      from: undefined
    });

    await fs.ensureDir(path.join(paths.outputDir, "css"));
    await fs.writeFile(
      path.join(paths.outputDir, "css/theme.min.css"),
      minifiedCss.css
    );
    console.log("SASS compiled and minified successfully.");
  } catch (err) {
    console.error("SASS Compilation Error:", err);
    throw err; // Re-throw to handle the error in the build process
  }
}

async function bundleAndMinifyJs() {
  console.log("Bundling and minifying JS...");
  try {
    const jsCode = await fs.readFile(paths.jsEntry, "utf8");
    const minifiedJs = await Terser.minify(jsCode);
    if (minifiedJs.error) {
      throw minifiedJs.error;
    }
    await fs.ensureDir(path.join(paths.outputDir, "js"));
    await fs.writeFile(
      path.join(paths.outputDir, "js/uswds-initializer.min.js"),
      minifiedJs.code
    );
    console.log("JS bundled and minified successfully.");
  } catch (err) {
    console.error("JS Minification Error:", err);
  }
}

async function copyAssets() {
  console.log("Copying assets (fonts, images)...");
  try {
    if (await fs.pathExists(path.join(paths.assetsSrc, "fonts"))) {
      console.log("Copying fonts...");
      await fs.copy(
        path.join(paths.assetsSrc, "fonts"),
        path.join(paths.outputDir, "fonts")
      );
    }
    if (await fs.pathExists(path.join(paths.assetsSrc, "img"))) {
      console.log("Copying images...");
      await fs.copy(
        path.join(paths.assetsSrc, "img"),
        path.join(paths.outputDir, "img")
      );
    }
    console.log("Assets copied.");
  } catch (err) {
    console.error("Asset Copying Error:", err);
  }
}

async function cleanOutputDir() {
  console.log(`Cleaning output directory: ${paths.outputDir}`);
  if (await fs.pathExists(paths.outputDir)) {
    await fs.emptyDir(paths.outputDir); // Clean previous build
  }
}

async function createMetaFile() {
  console.log("Creating/Updating static resource meta file...");
  try {
    await fs.writeFile(paths.staticResourceMeta, staticResourceMetaContent);
    console.log("Static resource meta file created/updated.");
  } catch (err) {
    console.error("Error creating meta file:", err);
  }
}

async function build() {
  console.time("USWDS Build Time");
  await cleanOutputDir(); // Clean previous build
  await compileSass();
  await bundleAndMinifyJs();
  await copyAssets(); // Copy fonts, images from src/assets
  await createMetaFile();
  console.timeEnd("USWDS Build Time");
}

// Watch mode logic
const isWatchMode = process.argv.includes("--watch");
if (isWatchMode) {
  console.log("Running in watch mode...");
  const watcher = chokidar.watch(
    [
      path.join(__dirname, "../src/scss/**/*.scss"),
      path.join(__dirname, "../src/js/**/*.js"),
      path.join(__dirname, "../src/assets/**/*")
    ],
    {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true
    }
  );

  watcher.on("change", async (filePath) => {
    console.log(`File ${filePath} has been changed. Rebuilding...`);
    await build();
  });
  build(); // Initial build
} else {
  build();
}
