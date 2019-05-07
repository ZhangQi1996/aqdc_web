<template>
	<div class='wel-main'>
		<div class="wel-wrapper">
			<div>
				<img src="../../static/img/wel-logo.png"/>
			</div>
			<div class="wel-slogan">
				<p>一个提供全国各地369座城市的空气质量数据的在线平台</p>
			</div>
			<Button type="primary" shape="circle" icon="md-apps" size='large' :to="{name:'Vhome'}">点击进入</Button>
			
		</div>
		<vue-particles
			color="#fff"
			:particleOpacity="0.7"
			:particlesNumber="60"
			shapeType="circle"
			:particleSize="4"
			linesColor="#fff"
			:linesWidth="1"
			:lineLinked="true"
			:lineOpacity="0.4"
			:linesDistance="150"
			:moveSpeed="2"
			:hoverEffect="true"
			hoverMode="grab"
			:clickEffect="true"
			clickMode="push"
			class="lizi"
		  >
		  </vue-particles>
		  
	</div>
</template>

<script>
	
	
	export default {
		name: 'Vwelcome',
		data() {
			return {
				
			};
		},
		mounted() {
			//将uri提交
			this.$store.commit('mut_updateNavItemActive', this.$route.path.split('/')[2]);
		},
	}
</script>

<style scoped>
	.wel-main {
		width: 100%;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		text-align: center;
		background-color: #141a48;
		background-image: url(../../static/img/bg.png);
		background-repeat: no-repeat;
		background-size: cover;
		overflow: hidden;
	}
	
	.wel-wrapper {
		position: absolute;
		top: 22%;
		text-align: center;
		left: 50%;
		margin-left: -210px;
	}
	
	.wel-slogan {
		font-size: 17px;
		color: white;
		margin-top: 10px;
		margin-bottom: 50px;
	}
</style>

