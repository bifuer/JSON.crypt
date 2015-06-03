/* jslint node: true */
"use strict";

global.modulesCache = global.modulesCache || {};
if(global.modulesCache['json.crypt']){
  return;
} else {
	global.modulesCache['json.crypt'] = true;
}

var crypto = require('crypto');

JSON.cryptPassword = 'none';
JSON.cryptAlgorithm = 'aes-256-ctr';

JSON.encrypt = function(data,password,algorithm){
	password = password || JSON.cryptPassword;
	algorithm = algorithm || JSON.cryptAlgorithm;
	try {
		data = JSON.decycled(data);
		var cipher = crypto.createCipher(algorithm,password);
		data = cipher.update(data,'utf8','hex');
		data += cipher.final('hex');
	} catch(error){
		JSON.cryptError = error;
		return;
	}
	return data;
};

JSON.decrypt = function(data,password,algorithm){
	data = data || '';
	password = password || JSON.cryptPassword;
	algorithm = algorithm || JSON.cryptAlgorithm;
	var decipher = crypto.createDecipher(algorithm,password);
	try {
		data = decipher.update(data,'hex','utf8');
		data += decipher.final('utf8');
		data = JSON.revive(data);
	} catch(error){
		JSON.cryptError = error;
		return;
	}
	return data;
};