#!/bin/bash
files=(dist/js/*.js)

for file in "${files[@]}"; do
  min_name=${file/".js"/".min.js"}
  uglifyjs --compress --mangle -- $file | gzip > $min_name
  rm $file
done