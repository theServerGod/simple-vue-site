#!/bin/bash

# Generate thumbnails for images in current directory.
# NOTE: This script relies on `convert`, as provided by the ImageMagick library
#
# @author Jake Skoric <info@jakeskoric.com>

WIDTH=200 # Thumbnail width, in pixels
HEIGHT=100 # Thubmanil height, in pixels
IMAGE_EXTENSIONS=('jpg' 'jpeg' 'png')

# Generates thumbnails using `convert`, given an image extension - e.g. `genthumb 'jpg'`
genthumb() {
	# Provide default extension to search for, if no argument provided
	if test -z $1; then
		local ext='jpg';
	else
		local ext=$1
	fi

	# NOTE: Will NOT work for filenames with spaces, due to the way `find` creates its output
	for file in `find ./ -name "*.${ext}" ! -name "*.thumb.${ext}"`; do
		echo "*** Found $file"
		out=`echo "$file" | sed "s/\.${ext}$//"`;
		# Not using ! on `-resize` option to preserve aspect ratio
		convert "$file" -resize ${WIDTH}x${HEIGHT} "${out}.thumb.${ext}";
	done
}

# Removes thumbnail files in current directory
rmthumbs() {
	echo '*** Cleaning out old thumbnails ...'
	rm *.thumb.*
}


echo '*** Generating thumbnails ...'
rmthumbs
for ext in ${IMAGE_EXTENSIONS[*]}; do genthumb $ext; done
echo '*** Done!'
