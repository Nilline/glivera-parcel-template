// const path = require('path');
// const { Bundler } = require('@parcel/plugin');
const Bundler = require('@parcel/bundler-default');

const b = Bundler.default;
console.log(b[Symbol('parcel-plugin-config')]); //!

console.log('---------------------------------------------------'); //!
console.log('---------------------------------------------------'); //!
console.log('---------------------------------------------------'); //!
console.log('---------------------------------------------------'); //!
console.log('---------------------------------------------------'); //!
console.log('---------------------------------------------------'); //!
console.log('---------------------------------------------------'); //!

// class CustomBundler extends Bundler {
// 	// constructor() {
// 	// 	super();
// 	// }
// }

module.exports = Bundler;
