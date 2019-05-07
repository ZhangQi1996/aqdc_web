<template>
	<iframe class="mana-iframe" :src="mana_url" frameborder="0"></iframe>
</template>

<script>
 
	export default {
		name: 'Vmana',
		data() {
			return {
				mana_url: this.$store.getters.xadminBaseUrl,
				i_height: document.documentElement.clientHeight,
			};
		},
		mounted() {
			//将uri提交
			this.$store.commit('mut_updateNavItemActive', this.$route.path.split('/')[2]);
		},
		methods: {
			changeFrameHeight(){
				let ifm= document.getElementById("iframepage"); 
				ifm.height=document.documentElement.clientHeight;
			
			}
		}
	}
</script>

<style scoped>
	.mana-iframe {
		width: 100%;
		height: 800px;
	}
</style>

