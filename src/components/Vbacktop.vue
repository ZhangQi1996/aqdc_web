<style scoped>
    .top{
        padding: 10px;
        background: #373d41;
        color: #fff;
        text-align: center;
        border-radius: 2px;
    }
</style>
<template>
    <BackTop :height="100" :bottom="200">
        <div class="top">返回顶端</div>
    </BackTop>
</template>
<script>
    export default {
        name: 'Vbacktop',
		data() {
			return {
				
			};
		},
    }
</script>

