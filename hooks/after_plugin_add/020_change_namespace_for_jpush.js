#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var pluginsDir = path.resolve(__dirname, '../../plugins');
var root = path.resolve(__dirname, '../../');
var configxml = fs.readFileSync(path.join(root, 'config.xml')).toString();
var id, m;
if(m = configxml.match(/widget id="(.*?)"/)){
	id = m[1];
}
var sourcePath = path.join(pluginsDir, 'cn.jpush.phonegap.JPushPlugin/src/android/JPushPlugin.java');
var source = fs.readFileSync(sourcePath);

source = source.toString().replace(/^import (.*?)\.R;$/m, "import "+id+".R;\n");
fs.writeFileSync(sourcePath, source);