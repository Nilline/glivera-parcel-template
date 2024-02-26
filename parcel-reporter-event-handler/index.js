/* eslint-disable quotes */
/* eslint-disable indent */
/* eslint-disable default-case */
const { Reporter } = require('@parcel/plugin');
const watcher = require('@parcel/watcher');
const fs = require('fs');
const path = require('path');
const { exec, execSync } = require('child_process');

const triggerBundle = () => {
	const triggerFile = path.resolve(process.cwd(), './.parcelrc');

	const fileContent = fs.readFileSync(triggerFile, {
		encoding: 'utf8',
	});
	fs.writeFileSync(triggerFile, fileContent);
};

const handleDevError = () => {
	let once = false;

	const subscription = watcher.subscribe(process.cwd(), (err, events) => {
		if (once) return;
		once = true;

		triggerBundle();

		process.stdout.write(`reload successfully`);
	});

	return subscription;
};

const handleFatalError = () => {
	process.stdout.write(` ❌ Fatal error. Rebuilding... \n`);
	const ls = execSync(
		'node ./dev-scripts/prebuild.mjs && parcel serve ./src/pug/pages/*.pug --no-cache --port=8080',
		(error, stdout, stderr) => {
			if (error) {
				console.error(`Ошибка при запуске нового скрипта: ${error}`);
				return;
			}
			console.log(`Стандартный вывод: ${stdout}`);
			console.error(`Стандартный поток ошибок: ${stderr}`);
		},
	);
	console.log('2'); //!

	process.exit();
};

module.exports = new Reporter({
	async report({ event, options }) {
		// console.log(module.hot); //!
		process.stdout.write(`${event.type}...\n`);

		// console.log(`Starting directory: ${cwd()}`);
		// try {
		// 	chdir(process.cwd());
		// 	console.log(`New directory: ${cwd()}`);
		// } catch (err) {
		// 	console.error(`chdir: ${err}`);
		// }
		// if (event.type === 'buildProgress') {
		// 	switch (event.phase) {
		// 		case 'transforming':
		// 			process.stdout.write(`Transforming ${event.filePath}...\n`);
		// 			break;
		// 		case 'resolving':
		// 			process.stdout.write(`Resolving ${event.dependency.specifier}...\n`);
		// 			break;
		// 		case 'bundling':
		// 			process.stdout.write('Bundling...\n');
		// 			break;
		// 		case 'packaging':
		// 			process.stdout.write(`Packaging ${event.bundle.displayName}...\n`);
		// 			break;
		// 		case 'optimizing':
		// 			process.stdout.write(`Optimizing ${event.bundle.displayName}...\n`);
		// 			break;
		// 		default:
		// 			break;
		// 	}
		// }
		// if (event.type === 'buildSuccess') {
		// 	let bundles = event.bundleGraph.getBundles();
		// 	process.stdout.write(`✨ Built ${bundles.length} bundles in ${event.buildTime}ms!\n`);
		// }
		// console.log(event); //!
		// if (event.type === 'watchStart') {
		// 	process.stdout.write(`Watching started\n`);
		// } else if (event.type === 'watchEnd') {
		// 	process.stdout.write(`Watching ended\n`);
		// }

		if (this.subs?.unsubscribe) {
			this.subs.unsubscribe();
		}

		if (event.type === 'buildFailure') {
			// this.subs = await handleDevError();

			console.log(event.diagnostics?.message); //!
			if (event.diagnostics[0]?.message?.includes('Expected content key')) {
				handleFatalError();
				console.log('1'); //!
			}
			// process.stdout.write(`🚨 Build failed with ${event.diagnostic.message} errors.\n`);
			// console.log(event.diagnostic); //!

			// 'utf8',
			// 	(err, data) => {
			// 		if (err) {
			// 			return console.log(err);
			// 		}
			// 		const result = data.concat('\n');
			// 		return null;
			// 	};
			// this.subscription.unsubscribe();
			// process.stdout.write(`🚨 Build failed with ${event.diagnostics.length} errors.\n`);
			// console.log(module);
			// console.log(module.hot);
		}
		if (event.type === 'log') {
			switch (event.level) {
				case 'warn':
					process.stdout.write(`⚠️ ${event?.diagnostics?.[0]?.message}\n`);
					break;
				case 'error':
					process.stdout.write(`🚨 ${event?.diagnostics?.[0]?.message}\n`);
					break;
			}
		}
		// if (event.type === 'buildStart') {
		// 	process.stdout.write('Started build!\n');
		// }
	},
});
