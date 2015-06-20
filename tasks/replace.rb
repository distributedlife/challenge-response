def assert_envvars_set! vars
  vars.each do |k|
    if ENV[k].nil? || ENV[k] == ""
      raise "Missing value for #{k}"
    end
  end
end

def replace_in_files vars, files
  files.each do |filename|
    contents = File.read(filename)

    vars.each { |k| contents.gsub!("process.env.#{k}", "'#{ENV[k]}'") }

    File.write(filename, contents)
  end
end