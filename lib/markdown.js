'use strict';


const internals = {};


exports = module.exports = internals.Reporter = function (options) {

    this.settings = options;
    this.count = 0;
    this.last = [];
};


internals.Reporter.prototype.start = function (notebook) {

    this.report('#Code Quality Report  \n');

    const d = new Date();
    this.report(d.toDateString() + ' ' + d.toTimeString()) + '  \n';
    this.report('  \n  \n##Tests\n  ');
};


internals.Reporter.prototype.test = function (test) {

    const check = '\u2714';
    const asterisk = '\u2716';
    const dash = '\u254D\u254D';

    for (let i = 0; i < test.path.length; ++i) {
        if (test.path[i] !== this.last[i]) {
            this.report('  \n**' + test.path[i] + '**  \n');
        }
    }

    this.last = test.path;

    if (test.err) {
        this.report(asterisk + ' ' + test.id + ') ' + test.relativeTitle + '  \n');
    }
    else if (test.skipped || test.todo) {
        this.report(dash + ' ' + test.id + ') ' + test.relativeTitle + '  \n');
    }
    else {
        this.report(check + ' ' + test.id + ') ' + test.relativeTitle + ' (' + test.duration + ' ms)  \n');
    }

};


internals.Reporter.prototype.end = function (notebook) {

    let output = internals.testsSummary(notebook);

    if (notebook.leaks) {
        output += internals.leaks(notebook.leaks);
    }

    if (notebook.coverage) {
        output += internals.coverage(notebook.coverage, this.settings);
    }

    if (notebook.lint) {
        output += internals.linting(notebook.lint, this.settings);
    }

    output += '  \n';

    this.report(output);
};



internals.filterFailures = function (test) {

    return !!test.err;
};


internals.filterNodeModules = function (line) {

    return !(/\/node_modules\//.test(line));
};


internals.filterSkipped = function (test) {

    return test.skipped;
};


internals.linting = function (lint, settings) {

    let output = '  \n  \n##Linting  \n';

    output += 'Warnings threshold: ' + settings['lint-warnings-threshold'] + '  \n';
    output += 'Errors threshold: ' + settings['lint-errors-threshold'] + '  \n';

    let hasErrors = false;
    lint.lint.forEach((entry) => {

        if (!entry.errors || !entry.errors.length) {
            return;
        }

        hasErrors = true;
        output += '  \n**' + entry.filename + '**  \n';
        entry.errors.forEach((err) => {

            output += 'Line ' + err.line + ': ' + err.message + '  \n';
        });
    });

    if (!hasErrors) {
        output += 'No issues  \n';
    }

    return output;

};


internals.coverage = function (coverage, settings) {

    let output = '  \n  \n##Coverage  \n';

    output += 'Threshold: ' + settings.threshold + '%  \n';

    const status = 'Coverage: ' + coverage.percent.toFixed(2) + '%';
    output += coverage.percent === 100 ? status : status + ' (' + (coverage.sloc - coverage.hits) + '/' + coverage.sloc + ')';
    output += '  \n';

    if (coverage.percent < settings.threshold) {

        output += '  \n';

        coverage.files.forEach((file) => {

            let missingLines;
            if (file.sourcemaps) {
                const missingLinesByFile = {};
                Object.keys(file.source).forEach((lineNumber) => {

                    const line = file.source[lineNumber];
                    if (line.miss) {
                        missingLines = missingLinesByFile[line.originalFilename] = missingLinesByFile[line.originalFilename] || [];
                        missingLines.push(line.originalLine);
                    }
                });

                const files = Object.keys(missingLinesByFile);
                if (files.length) {
                    output += '  \n' + file.filename + ' missing coverage from file(s):';
                    files.forEach((filename) => {

                        output += '  \n\t' + filename + ' on line(s): ' + missingLinesByFile[filename].join(', ');
                    });
                }
            }
            else {
                missingLines = [];
                Object.keys(file.source).forEach((lineNumber) => {

                    const line = file.source[lineNumber];
                    if (line.miss) {
                        missingLines.push(lineNumber);
                    }
                });

                if (missingLines.length) {
                    output += '  \n**' + file.filename + '**  \n';
                    output += 'Missing coverage on ' + (missingLines.length > 1 ? 'lines' : 'line') + ': ' + missingLines.join(', ');
                    output += '  \n';
                }
            }
        });

    }

    return output;

};


internals.leaks = function (leaks) {

    let output = '  \n  \n##Leaks  \n';

    if (leaks.length) {
        output += 'The following global variable leaks were detected:' + leaks.join(', ') + '  \n';
    }
    else {
        output += 'No global variable leaks detected' + '  \n';
    }

    return output;

};


internals.testsSummary = function (notebook) {

    const failures = notebook.tests.filter(internals.filterFailures);
    const skipped = notebook.tests.filter(internals.filterSkipped);

    let output = '';

    const errors = notebook.errors || [];
    if (errors.length) {
        output += 'Test script errors:  \n  \n';
        errors.forEach((err) => {

            output += err.message + '  \n';
            if (err.stack) {
                const stack = err.stack.slice(err.stack.indexOf('  \n') + 1)
                                       .replace(/^/gm, '  ')
                                       .split('  \n')
                                       .filter(internals.filterNodeModules)
                                       .slice(0, 5)
                                       .join('  \n');

                output += stack + '  \n';
            }

            output += '  \n';
        });
        output += 'There were ' + errors.length + ' test script error(s).' + '  \n  \n';
    }

    output += '  \n  \n';
    output += notebook.tests.length + (notebook.tests.length === 1 ? ' test' : ' tests') + '  \n';
    output += failures.length + (failures.length === 1 ? ' test' : ' tests') + ' failed  \n';
    output += skipped.length + (skipped.length === 1 ? ' test' : ' tests') + ' skipped  \n';

    output += '  \nTest duration: ' + notebook.ms + ' ms  \n';

    if (failures.length) {
        output += '  \n  \n**Failed tests**  \n  \n';

        for (let i = 0; i < failures.length; ++i) {
            const test = failures[i];

            output += test.id + ') ' + test.title + '  \n';
        }

    }

    if (skipped.length) {
        output += '  \n  \n**Skipped tests**  \n  \n';

        for (let i = 0; i < skipped.length; ++i) {
            const test = skipped[i];

            output += test.id + ') ' + test.title + '  \n';
        }

    }

    return output;

};
