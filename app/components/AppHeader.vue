<template>
	<nav class="nav">
		<router-link to="/" exact>Home</router-link>
		<router-link to="/tc">Terms</router-link>
	</nav>
</template>

<script>
export default {
	name: 'appHeader',

};
</script>

<style scoped>
.active {
	font-weight: bold;
}
</style>
