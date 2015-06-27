def config
  {
    vars: ['ENSEMBLEJS_URL']
  }
end

def game
  {
    js: Dir['game/js/*.js'],
    scss: Dir['game/scss/*.scss']
  }
end

def dist
  {
    root: 'dist',
    js: Dir['dist/js/*.js'],
    css: Dir['dist/css/*.css'],
    css_map: Dir['dist/css/*.css.map']
  }
end