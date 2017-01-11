<template>
	<div class="page">
		<h1>Home</h1>
		<gallery></gallery>
		<hr/>
		<contact></contact>
	</div>
</template>

<script>
import Gallery from './Gallery.section.vue';
import Contact from './Contact.section.vue';

export default {
	name: 'home',
	components: {
		Contact,
		Gallery
	}
};
</script>
