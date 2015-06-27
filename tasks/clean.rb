def clean
  rm_rf "game/js/gen"
  rm_rf "game/css"

  rm_rf "dist"
end

def remove_original files
  files.each do |f|
    rm f
  end
end
