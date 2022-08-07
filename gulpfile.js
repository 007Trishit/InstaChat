const gulp = require('gulp');
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const rev = require('gulp-rev');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify-es').default;
const del = require('del');

const fs = require('fs');
const path = require('path');

gulp.task('css',function(done){
    gulp.src('./assets/scss/*.scss')
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest('./assets/css/'));

    gulp.src('./assets/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd:'public',
        merge:true
    }))
    .pipe(gulp.dest('./public/assets'));

    done();
});

gulp.task('images',function(done){
    gulp.src('./assets/**/*.+(png|jpg|svg|jpeg)')
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd:'public',
        merge:true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});

gulp.task('js',function(done){
    gulp.src('./assets/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd:'public',
        merge:true
    }))
    .pipe(gulp.dest(('./public/assets')));

    done();
});

gulp.task('clean-assets',function(done){
    let flag = fs.existsSync(path.join(__dirname,'/public/assets'));
    if(flag){
        del.sync('./public/assets');
    }
    done();
});

gulp.task('build',gulp.series('clean-assets','css','js','images'),function(done){
    console.log("Building assets");
    done();
});