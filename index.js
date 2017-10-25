/* jslint node: true */
"use strict";

global.modulesCache = global.modulesCache || {};
if(global.modulesCache['json.crypt']){
  return;
} else {
	global.modulesCache['json.crypt'] = true;
}

var crypto = require('crypto');

JSON.cryptPassword = crypto.randomBytes(32);
JSON.cryptAlgorithm = 'AES-256-CBC';

JSON.encrypt = function(data, password, algorithm){
	password = password || JSON.cryptPassword;
	algorithm = algorithm || JSON.cryptAlgorithm;
	var iv = new Buffer(crypto.randomBytes(16));
	try {
		data = JSON.decycled(data);
		var cipher = crypto.createCipheriv(algorithm, password, iv);
		data = cipher.update(data, 'utf8', 'hex');
		data += cipher.final('hex');
	} catch(error){
		JSON.cryptError = error;
		return;
	}
	return iv.toString('hex') + ':' + data;
};

JSON.decrypt = function(data, password, algorithm){
	data = (data || '').split(':');
	var iv = new Buffer(data[0], 'hex');
	data = data[1];
	password = password || JSON.cryptPassword;
	algorithm = algorithm || JSON.cryptAlgorithm;
	var decipher = crypto.createDecipheriv(algorithm, password, iv);
	try {
		data = decipher.update(data, 'hex', 'utf8');
		data += decipher.final('utf8');
		data = JSON.revive(data);
	} catch(error){
		JSON.cryptError = error;
		return;
	}
	return data;
};