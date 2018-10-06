const fs = require('fs');
const fsExtra = require('fs-extra');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const Sass = require('node-sass');
const babelify = require("babelify");
const browserify = require("browserify");
const UglyCss = require('uglifycss');
const UglifyJS = require('uglify-es');

// Various variables
const rootPath = __dirname;
// The settings
const options = require('./package.json');

const cleaner = postcss([autoprefixer({ add: false, browsers: options.settings.browsers })]);
const prefixer = postcss([autoprefixer]);
//###################################################################

// Make sure that the dist paths exist
if (!fs.existsSync(rootPath + '/dist')) {
  fsExtra.mkdirSync(rootPath + '/dist');
}
if (!fs.existsSync(rootPath + '/dist/js')) {
  fsExtra.mkdirSync(rootPath + '/dist/js');
}
if (!fs.existsSync(rootPath + '/dist/css')) {
  fsExtra.mkdirSync(rootPath + '/dist/css');
}
if (fs.existsSync(`${rootPath}/dist`)) {
  if (fs.existsSync(`${rootPath}/docs/_media/js`)) {
    fsExtra.emptyDirSync(`${rootPath}/docs/_media/js`);
    fsExtra.emptyDirSync(`${rootPath}/docs/_media/css`);
  }
} else {
  fsExtra.mkdirSync(`${rootPath}/docs/_media/js`);
  fsExtra.mkdirSync(`${rootPath}/docs/_media/css`);
}

const createJsFiles = (element, es6File, options) => {
  const b = browserify();
  const c = browserify();

  fs.writeFileSync(`${rootPath}/dist/js/ttc-${element}.js`, es6File, { encoding: 'utf8' });

  // And the minified version
  fs.writeFileSync(`${rootPath}/dist/js/ttc-${element}.min.js`, UglifyJS.minify(es6File).code, { encoding: 'utf8' });

  // Transpile a copy for ES5
  fs.writeFileSync(`${rootPath}/dist/js/ttc-${element}-es5.js`, '');
  const bundleFs = fs.createWriteStream(`${rootPath}/dist/js/ttc-${element}-es5.js`);
  const bundleFsMin = fs.createWriteStream(`${rootPath}/dist/js/ttc-${element}-es5.min.js`);

  b.add(`${rootPath}/src/js/${element}/${element}.js`);
  c.add(`${rootPath}/src/js/${element}/${element}.js`);
  b.transform(babelify, { presets: ['babel-preset-es2015'] }).bundle().pipe(bundleFs);
  c.transform(babelify, { presets: ['babel-preset-es2015', 'babel-preset-minify'] }).bundle().pipe(bundleFsMin);
};


options.settings.elements.forEach((element) => {
  // Copy the ES6 file
  let es6File = fs.readFileSync(`${rootPath}/src/js/${element}/${element}.js`, 'utf8');
  // Check if there is a css file
  if (fs.existsSync(`${rootPath}/src/scss/${element}/${element}.scss`)) {
    if (!fs.existsSync(`${rootPath}/src/scss/${element}/${element}.scss`)) {
      return;
    }

    Sass.render({
      file: `${rootPath}/src/scss/${element}/${element}.scss`,
    }, (error, result) => {
      if (error) {
        // eslint-disable-next-line no-console
        console.error(`${error.column}`);
        // eslint-disable-next-line no-console
        console.error(`${error.message}`);
        // eslint-disable-next-line no-console
        console.error(`${error.line}`);
      } else {
        // Auto prefixing
        // eslint-disable-next-line no-console
        console.log(`Prefixing for: ${options.settings.browsers}`);

        if (typeof result === 'object' && result.css) {
          cleaner.process(result.css.toString(), { from: undefined })
            .then(cleaned => prefixer.process(cleaned.css, { from: undefined }))
            .then((res) => {
              if (/{{CSS_CONTENTS_PLACEHOLDER}}/.test(es6File)) {
                if (typeof res === 'object' && res.css) {
                  es6File = es6File.replace('{{CSS_CONTENTS_PLACEHOLDER}}', UglyCss.processString(res.css.toString()));

                  createJsFiles(element, es6File, options);
                }
              } else {
                if (typeof res === 'object' && res.css) {
                  fs.writeFileSync(
                    `${rootPath}/dist/css/ttc-${element}.css`,
                    res.css.toString(),
                    { encoding: 'UTF-8' },
                  );
                  fs.writeFileSync(
                    `${rootPath}/dist/css/ttc-${element}.min.css`,
                    UglyCss.processString(res.css.toString(), { expandVars: false }),
                    { encoding: 'UTF-8' },
                  );
                }

                createJsFiles(element, es6File, options);
              }
            })

            // Handle errors
            .catch((err) => {
              // eslint-disable-next-line no-console
              console.error(`${err}`);
              process.exit(-1);
            });

          return;
          // eslint-disable-next-line no-console
          console.log(`ttc-${element} was updated.`);
        }
      }
    });
  } else {
    createJsFiles(element, es6File, options);
  }
});

// Copy files to docs folder
fsExtra.copySync(`${rootPath}/dist`, `${rootPath}/docs/_media`);
