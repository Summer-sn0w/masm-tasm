//clean files
const del = require('del');
const cleanTask = function () {
	return del(['out/**', 'dist/**', 'package.nls.*.json', 'masm-tasm*.vsix']);
};

//build nls
const gulp = require('gulp');
const filter = require('gulp-filter');
const ts = require('gulp-typescript');
const typescript = require('typescript');
const sourcemaps = require('gulp-sourcemaps');
const nls = require('vscode-nls-dev');
const tsProject = ts.createProject('./tsconfig.json', { typescript });
const languages = [
	{ id: "zh-cn", folderName: "chs", transifexId: "zh-hans" }];
const generateAdditionalLocFiles = () => {
	return gulp.src(['package.nls.json'])
		.pipe(nls.createAdditionalLanguageFiles(languages, 'i18n'))
		.pipe(gulp.dest('.'));
};
// Generates ./dist/nls.bundle.<language_id>.json from files in ./i18n/** *//<src_path>/<filename>.i18n.json
// Localized strings are read from these files at runtime.
const generateSrcLocBundle = () => {
	// Transpile the TS to JS, and let vscode-nls-dev scan the files for calls to localize.
	return tsProject.src()
		.pipe(sourcemaps.init())
		.pipe(tsProject()).js
		.pipe(nls.createMetaDataFiles())
		.pipe(nls.createAdditionalLanguageFiles(languages, "i18n"))
		.pipe(nls.bundleMetaDataFiles('xsro.masm-tasm', 'dist'))
		.pipe(nls.bundleLanguageFiles())
		.pipe(filter(['**/nls.bundle.*.json', '**/nls.metadata.header.json', '**/nls.metadata.json']))
		.pipe(gulp.dest('dist'));
};
gulp.task('clean', cleanTask);
gulp.task('translations-generate', gulp.series(generateSrcLocBundle, generateAdditionalLocFiles));