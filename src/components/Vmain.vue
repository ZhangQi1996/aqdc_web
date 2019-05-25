<template>
	<div>
		<!-- active-name==谁，谁就被选中 -->
		<Menu mode="horizontal" theme="dark" :active-name="navItemActive">
			<Row class='container'>
				<li>
					<a href="/" class="header-nav-logo">
						<img src="../../static/img/header-nav-logo.png">
					</a>
				</li>
				<MenuItem name="home" :to="{name:'Vhome'}">
					<Icon type="ios-home" />
					首页
				</MenuItem>
				<!-- 
					TODO:
					点击时调用ip检测返回对应ip所在地城市的city_info, 这里可以绑定
					默认地址为local，意思是显示当地的空气信息
					1.跳转到city_info页面，先检测路由city_name参数是否为local
					2.为local时，再次跳转到本IP对应的地级城市的页面，要是对应的城市不再展示数据的城市列表中时，
					  则展示本省会的数据。若省都没有则显示北京的数据
					3.不为local时，对应展示
					4.error
				 -->
				<MenuItem name="info" :to="{name:'Vcity_info', params: {city_name: 'local'}}">
					<Icon type="ios-information-circle-outline" />
					空气质量信息
				</MenuItem>
				<MenuItem name="mana" :to="{name:'Vmana'}">
					<Icon type="md-settings" />
					数据管理
				</MenuItem>
				<MenuItem name="predict" :to="{name:'Vpredict'}">
					<Icon type="ios-pulse" />
					空气质量预测
				</MenuItem>
				<div class='header-nav-search'>
					<AutoComplete
						v-model="search_val"
						icon="ios-search"
						@on-change="changeHandler"
						placeholder="输入查询的省/市/地区..."
						size='large'>
						<!-- value用作框中显示的值 -->
						<Option v-for="item in search_data_list" :value="item.name" key='item.name'>
							<router-link :to="newUrl(item)">{{item.name}}</router-link>
						</Option>
					</AutoComplete>
				</div>
			</Row>
		</Menu>
		<!-- 路由路径不复用，解决路径变化而页面不变的问题 -->
		<router-view :key="$route.fullPath"/>
		<Vbacktop></Vbacktop>
		<Vfooter></Vfooter>
	</div>
</template>

<script>
	import Vbacktop from './Vbacktop.vue' //要记得挂载
	import Vfooter from './Vfooter.vue'
	export default {
		name: 'Vmain',
		data() {
			return {
				search_val: '',
				search_data_list: [],
			};
		},
		mounted() {
		},
		computed: {
			navItemActive() {
				return this.$store.getters.navItemActive;
			}
		},
		methods: {
			changeHandler(value) { //输入的值
				/**
				 * 将与输入的value相关的所有信息加入
				 * 1.相关的省份，以及省份下的所有城市地区
				 * 2.直接定位到具体城市地区
				 * 注意：最多显示15条记录
				*/
				this.search_data_list = [];
				if(value === '') return;
				let provs = this.$store.getters.provs;
				let i = 0;
				let count = 0;
				for(i = 0; i < provs.length; i++) { //查找省份
					let prov = provs[i];
					if(prov.indexOf(value) != -1) {
						this.search_data_list.push({name: prov, type: 'prov'});
						count++;
						if(count >= 15) 
							return;
					}
				}
				if(count == 0) { //直接查询地区
					for(let city in this.$store.getters.cityNameToCityCode) {
						if(city.indexOf(value) != -1) { 
							this.search_data_list.push({name: city, type: 'city'});
							count++;
						}
						if(count >= 15) return;
					}
				}
				if(this.search_data_list.length === 0) {
					this.search_data_list.push({name: `暂无${value}的数据`, type: 'error'});
				}
			},
// 			selectHandler(value) {
// 				let addr = null;
// 				for(let i = 0; i < this.search_data_list.length; i++) {
// 					let item = this.search_data_list[i];
// 					if(item.name === value) { //找到选中的项
// 						if(item.type === 'prov') {
// 							addr = this.$store.getters.appBaseUrlPrefix + "main/info/prov/" + item.name;
// 							this.$router.push(addr);
// 						}
// 						else if(item.type === 'city'){
// 							addr = this.$store.getters.appBaseUrlPrefix + "main/info/city/" + item.name;
// 							this.$router.push(addr);
// 						}
// 						else {
// 							this.search_val = '';
// 							return;
// 						}
// 					}
// 				}
// 			},
			newUrl(item) {
				if(item.type === 'prov') {
					return {
						name: 'Vprov_info',
						params: {
							prov_name: item.name,
						}
					};
				}
				else if(item.type === 'city'){
					return {
						name: 'Vcity_info',
						params: {
							city_name: item.name,
						}
					};
				}
				else {
					return {};
				}
			},
		},
		components: {
			Vbacktop,
			Vfooter,
		}
	}
	
	
</script>

<style scoped>
	.header-nav-logo {
		    height: 50px;
			margin-top: 8px;
			float: left;
	}
	
	.header-nav-logo img {
		height: 100%;
	}
	
	.header-nav-search {
		float: right;
	}
</style>

