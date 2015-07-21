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
    min_f = f.gsub('.css', '.min.css')

    command = "cssnano < #{f} > #{min_f}"
    puts command
    system command
  end
end