var gulp = require('gulp');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var cssMin = require('gulp-css');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const autoprefix = require('gulp-autoprefixer');
const babelify = require('babelify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const browserSync = require ('browser-sync').create();

const BASE_ROOT = './proj/';

const scssSource = BASE_ROOT + 'scss/**/*.scss';
const cssDest = BASE_ROOT + 'css/';

const jsSrc = 'scripts.js';
const jsFolder = BASE_ROOT + 'jsSrc/';
const jsDest = BASE_ROOT + 'js/';

//watching folder in my case same as src files

const watchCss = BASE_ROOT + 'css/styles.css';
const watchJs = BASE_ROOT + 'jsSrc/**/*.js';
const watchHtml = './*.html';
// const watchPhp = './*.php';

//JS file array for the futture

const jsArrFiles = [jsSrc];

function browser_sync(done) {
    browserSync.init({
        server: {
            baseDir: BASE_ROOT,
            open: false,
            injectChanges: true,
            // for https urls redirects i dues
            // proxy: SVGAnimatedNumberList,
            // https: {
            //     key: '',
            //     cert: ''
            // }
        }
    });
    done();
}

function reload(done){
    gulp.task(browserSync.reload());
    done();
}


function buildCss (done) {
    return gulp.src([
        scssSource
    ])
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefix({cascade: false}))
    .pipe(concat('styles.css'))
    // .pipe(rename({suffix: '.min'}))
    // .pipe(cssMin())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(cssDest))
    .pipe(browserSync.stream())
    done();
}

function buildJs(done) {
    jsArrFiles.map(entry => browserify({
            entries: [jsFolder + entry]
        })
        .transform(babelify, {presets: ['@babel/preset-env']})
        .bundle()
        .pipe(source(entry))
        .pipe(rename({extname: '.min.js'}))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(jsDest))
        .pipe(browserSync.stream())
    )
    done();

    //browserify
    //transform babelify[env]
    //bundle
    //source
    //rename .min
    //buffer
    //init sourcemap
    //uglify
    //wirte sourcemap
    //dest?
}

function watch_files(){
    gulp.watch(scssSource, gulp.series(buildCss, reload));
    gulp.watch(watchJs, gulp.series(buildJs, reload));
    gulp.watch( BASE_ROOT + '*.html', gulp.series(reload));
}

gulp.task('css', buildCss);
gulp.task('js', buildJs);

gulp.task('default', gulp.parallel(buildCss));

gulp.task('watch', gulp.parallel(watch_files, browser_sync));


/**********COMMENTS SECTION
 * So there is 2 particular options to add error logging for sass but the one used in the code is better
 * than that one:
 * 
 * sass({
        errLogToConsole: true,
    }))
    .on('error', console.error.bind(console)
    
 * This one has too much output in the console
 * 
 * there is no difference between *.scss and having main file selected
 * There is no difference between .pipe(cssMin()) package and sass({outputStyle: 'compressed'})
 * 
 * package.json has browser list property to address browsers responsively
 * so its pretty cool. to read more go to gulp-autoprefixn, 
 * 
 * Sourcemaps allows to find where our css came from
 * so its good in dev, but in prod... may be not?
 * 
 * 
 * How to position all this stuff? Okay so
 * 1. gulp.src
 * 2. sourcemap init
 * 3. sassing shmassing :)
 * 4. prefixing
 * 5. renaming
 * 6. sourcemap write
 * 7. gulp.dest
 * 
 * npm outdated - check which packages are outdated
 * 
 * npm update - updates minor upgrades
 * 
  
 */