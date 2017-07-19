<template>
	<section class="gallery">
		<div class="image" v-for="(img, index) in images" v-bind:key="index" v-once>
			<a v-bind:href="img.src">
				<img v-bind:src="img.thumb || img.src">
			</a>
		</div>
	</section>
</template>

<script>
// Import gallery images {{{
var images = [];

/**
* Imports both original and thumbnail versions of an image, given a Webpack require-context
* The following filename convention is required for this function, for example:
* ORIGINAL: 'foo.jpg', THUMBNAIL: 'foo.thumb.jpg'
*/
function importImages(r) {
	// Extract thumbnail images
	var thumbs = r.keys().filter(img => img.match(/.+\.thumb\..+/));

	// If no thumbnails found, only import original image files
	if (!thumbs || !thumbs.length) {
		return r.keys().forEach(img => images.push({src: r(img)}));
	}

	// Given thumbnail name, find original image and add both to the image collection
	thumbs.forEach(thumb => {
		// Remove '.thumb.' from thumbnail filename to get original image filename
		let img = r.keys().find(i => i === thumb.replace(/\.thumb\./, '.'));
		images.push({src: r(img), thumb: r(thumb)});
	});
}

// https://webpack.js.org/guides/dependency-management/#require-context
importImages(require.context('../assets/gallery', true, /\.(jpe?g|png)$/));
// }}}

export default {
	name: 'gallery',
	data() {
		return {
			images: images, // E.g. [{ src: "foo.jpg", thumb: "foo.thumb.jpg" }]
		}
	}
}
</script>

<style scoped>
.image,
.image img {
	width: 100px;
	margin: 5px;
	display: inline-block;
}
</style>
