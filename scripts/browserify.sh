#!/bin/bash
entry_points=(game/js/*.js)
drop_path="game"
dist_path="dist"
dist_targets=()

join() {
    # $1 is return variable name
    # $2 is sep
    # $3... are the elements to join
    local retname=$1 sep=$2 ret=$3
    shift 3 || shift $(($#))
    printf -v "$retname" "%s" "$ret${@/#/$sep}"
}

for entry_point in "${entry_points[@]}"; do
  dist_name=${entry_point/$drop_path/$dist_path}
  dist_targets=(${dist_targets[@]} $dist_name)
done

echo "ensemblejs client entrypoints: ${entry_points[@]}"
echo "ensemblejs server hostname: $1"
echo "ensemblejs dist files: ${dist_targets[@]}"

join dist_target_string " -o " "${dist_targets[@]}"

browserify -d "${entry_points[@]}"  -t [ envify --ENSEMBLEJS_URL "$1" ] -p [ factor-bundle -o $dist_target_string ] -o dist/js/common.js