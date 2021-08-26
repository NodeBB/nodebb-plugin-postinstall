'use strict';

const cproc = require('child_process');
const util = require('util');

const nconf = require('nconf');
const winston = require.main.require('winston');

const plugin = {};

const supportedPackageManagerList = require.main.require('../cli/package-install').supportedPackageManager;
const packageManager = supportedPackageManagerList.indexOf(nconf.get('package_manager')) >= 0 ? nconf.get('package_manager') : 'npm';
let packageManagerExecutable = packageManager;
if (process.platform === 'win32') {
	packageManagerExecutable += '.cmd';
}

function runPostinstall(callback) {
	cproc.execFile(packageManagerExecutable, [
		'run',
		'postinstall',
	], (err, stdout) => {
		if (err) {
			return callback(err);
		}

		winston.verbose(`[nodebb-plugin-postinstall] ${stdout}`);
		callback();
	});
}

const runPostinstallAsync = util.promisify(runPostinstall);

plugin.runPostinstall = async () => {
	await runPostinstallAsync();
};

module.exports = plugin;
