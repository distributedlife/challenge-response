def uglify files
  files.each do |f|
    min_name = f.gsub(".js", ".min.js")

    uglify = "uglifyjs --compress --mangle -- #{f} > #{min_name}"
    puts uglify
    system "#{uglify}"

  end
end

def minify files
  files.each do |f|
    min_name = f.gsub(".css", ".min.css")

    cp f, min_name
  end
end