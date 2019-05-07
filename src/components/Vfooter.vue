<template>
	<div style="background-color: #373d41;">
		<Row class='container footer-row'>
			<Col span="12" class="footer-col-left">
				<a href="/" class="footer-logo">
					<img src="../../static/img/footer-logo.png">
				</a>
			</Col>
			<Col span="12" class="footer-col-right">
				<div class="copy">
					<p class="footer-right">
						<a >关于我们  </a><span>|</span>
						<a >  用户服务  </a><span>|</span>
						<a >  服务条款  </a><span>|</span>
						<a >  网站导航  </a><span>|</span>
						<a >  意见反馈</a>
					</p>
					<p class="footer-right">
						<span>© Copyright 全国空气质量在线平台2019 POWERD BY <a href="" style="color: #e3e5e8;">Infinity Group</a></span>
					</p>
					<p class="footer-right">
						<span><a href="http://www.miitbeian.gov.cn" style="color: #e3e5e8;" target="_blank">赣ICP备19002164号-1</a></span>
						<span><a href="http://www.beian.gov.cn" style="color: #e3e5e8;" target="_blank">赣公网安备36092602000007号</a></span>
					</p>
					<p class="footer-right">
						<span class="sep span">违法和不良信息举报电话：+86-18239961260</span>
						<span class="span">举报邮箱：</span><a style="color: #e3e5e8;" href="mailto:358929931@qq.com">358929931@qq.com</a>
					</p>
				</div>
			</Col>
		</Row>
	</div>
</template>

<script>
	export default {
		name: 'Vfooter',
		data() {
			return {
				
			};
		}
	}
</script>

<style scoped>
	.footer-row {
		padding-top: 15px;
		padding-bottom: 20px;
	}
	.footer-logo {
	}
	.footer-logo img {
		height: 80px;
	}
	.footer-col-left {
		border-right-width: 1px;
		border-right-style: solid;
		border-right-color: #454a4e;
	}
	.footer-col-right {
		padding-top: 10px;
		border-left-width: 1px;
		border-left-style: solid;
		border-left-color: #454a4e;
	}
	.footer-right {
		margin-bottom: 5px;
		color: #e3e5e8;
	}
</style>

