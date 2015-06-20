def browserify
  entry_points = game[:js].join(' ')
  targets = game[:js].map{|f| f.gsub('game', dist[:root])}.join(' -o ')

  puts "ensemblejs client entrypoints: #{entry_points}"
  puts "ensemblejs dist files: #{targets}"

  command = "browserify -d #{entry_points} -p [ factor-bundle -o #{targets} ] -o #{dist[:root]}/js/common.js"

  puts command
  system "#{command}"
end

def sass files
  files.each do |f|
    css_f = f.gsub('game/scss/', '').gsub('.scss', '')

    command = "sass #{f} #{dist[:root]}/css/#{css_f}.css"
    puts command
    system "bundle exec #{command}"
  end
end