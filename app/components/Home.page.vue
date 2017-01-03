<template>
	<div class="page">
		<h1>Home</h1>
		<gallery></gallery>
		<hr/>
		<contact></contact>
	</div>
</template>

<script>
import Gallery from './Gallery.vue';
import Contact from './Contact.vue';

export default {
	name: 'home',
	components: {
		Contact,
		Gallery
	}
};
</script>
