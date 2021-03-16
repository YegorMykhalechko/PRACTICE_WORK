'use strict';

const { series, parallel, watch } = require('gulp');
const requireDir = require('require-dir');
const browserSync = require('browser-sync').create();

const tasks = requireDir('./gulp/tasks', { recurse: true });
const paths = require('./gulp/paths');

const serve = () => {
  return browserSync.init({
    server: 'build',
    notify: false,
    open: false,
    cors: true,
    ui: false,
    logPrefix: 'DevServer',
    host: 'localhost',
    port: process.env.PORT || 1234,
  });
};

const watcher = done => {
  watch(paths.watch.html).on(
    'change',
    series(tasks.html, tasks.inject, browserSync.reload),
  );
  watch(paths.watch.css).on('change', series(tasks.css, browserSync.reload));
  watch(paths.watch.js).on('change', series(tasks.scripts, browserSync.reload));
  watch(paths.watch.images, tasks.images);
  watch(paths.watch.fonts, tasks.fonts);

  done();
};

exports.start = series(
  tasks.clean,
  tasks.images,
  parallel(tasks.css, tasks.fonts, tasks.scripts, tasks.html),
  tasks.inject,
  watcher,
  serve,
);

exports.build = series(
  tasks.clean,
  tasks.images,
  parallel(tasks.css, tasks.fonts, tasks.scripts, tasks.html),
  tasks.inject,
);

var smartgrid = require('smart-grid');

/* It's principal settings in smart grid project */
var settings = {
    outputStyle: 'scss', /* less || scss || sass || styl */
    columns: 12, /* number of grid columns */
    offset: '20px', /* gutter width px || % || rem */
    mobileFirst: true, /* mobileFirst ? 'min-width' : 'max-width' */
    container: {
        maxWidth: '1200px', /* max-width оn very large screen */
        fields: '20px' /* side fields */
    },
    breakPoints: {
        lg: {
            width: '1100px', /* -> @media (max-width: 1100px) */
        },
        md: {
            width: '942px',
            fields: '10px'
        },
        sm: {
            width: '768px',
             /* set fields only if you want to change container.fields */
        },
        xs: {
            width: '560px',
        }
        /* 
        We can create any quantity of break points.

        some_name: {
            width: 'Npx',
            fields: 'N(px|%|rem)',
            offset: 'N(px|%|rem)'
        }
        */
    }
};

smartgrid('./src/sass', settings);
