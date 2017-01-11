<template>
	<section class="contact">
		<!-- FIXME: Contact form - complete layout/styling to fit project CSS framework {{{ -->
		<transition name="fade">
			<form v-if="!isSuccess" name="contactForm" method="POST" v-on:submit.prevent="submit">
				<div v-if="message" class="alert alert-error">{{ message }}</div>

				<input type="text" name="name" placeholder="Name" v-model="contactForm.name" required>
				<input type="email" name="email" placeholder="Email" v-model="contactForm.email" required>
				<textarea name="message" placeholder="Message" v-model="contactForm.message" required></textarea>
				<object type="image/svg+xml" data="/api/captcha"></object>
				<input id="contact-captcha" type="text" name="captcha" placeholder="Enter Captcha" v-model="contactForm.captcha" autocomplete="off" required>
				<button type="submit">Submit</button>
			</form>
		</transition>

		<transition name="fade">
			<div v-if="isSuccess && message" class="alert">{{ message }}</div>
		</transition>
		<!-- }}} -->
	</section>
</template>

<script>
export default {
	name: 'contact',
	data() {
		return {
			contactForm: {
				name: null,
				email: null,
				message: null,
				captcha: null
			},
			isSuccess: false, // Form successful submission flag
			isSending: false, // Indicate form submission is being sent to server
			message: null, // Response message
		}
	},
	methods: {
		/**
		 * Submits contact form data to server and handles response
		 */
		submit() {
			if (!this.contactForm.name || !this.contactForm.email || !this.contactForm.message || !this.contactForm.captcha) {
				this.message = 'Please fill out all fields and try again.';
				this.isSuccess = false;
				return;
			}

			this.isSending = true;
			this.$http.post('/api/contact', this.contactForm)
				.then(res => {
					if (res.body.status === 'OK') {
						this.isSuccess = true;
						this.message = res.body.message || "Thanks for getting in touch! We'll get back to you as soon as we can!";
					}
				})
				.catch(res => {
					if (res.body.status === 'FAIL') {
						this.message = res.body.message || 'Error submitting contact form, please try again.';
						this.isSuccess = false;
						console.error(res.body);
					}
				})
				.finally(() => this.isSending = false);
		}
	},
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity .5s
}
.fade-enter,
.fade-leave-active {
	opacity: 0
}

form {
	max-width: 50vw;
	text-align: center;
	margin: auto;
}

form input,
form textarea {
	display: block;
	width: 100%;
	margin-bottom: 10px;
}

.alert-error {
	color: red;
}
</style>
