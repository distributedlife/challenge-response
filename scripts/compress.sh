#!/bin/bash
files=(dist/js/*.js)

for file in "${files[@]}"; do
  min_name=${file/".js"/".min.js"}

  uglifyjs --compress --mangle -- $file > $min_name
  gzip -9k $min_name

  rm $file
done