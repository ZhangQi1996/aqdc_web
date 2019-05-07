<template>
	<div style="background-color: #F3F3F3; padding-bottom: 20px;">
		<div class="container">
			<Breadcrumb style="float: left; margin-left: 80px; margin-top: 40px; margin-bottom: 10px;">
				<BreadcrumbItem>
					<Icon type="ios-information-circle-outline" /> 空气质量信息
				</BreadcrumbItem>
				<BreadcrumbItem>
					<Icon type="ios-locate" /> 区域：{{city_name}}
				</BreadcrumbItem>
				<BreadcrumbItem>
					<Icon type="ios-cloud" /> 实时空气质量信息
				</BreadcrumbItem>
			</Breadcrumb>
			<Divider />
			<ECharts :options="pp_option" style="margin: auto; margin-top: 40px; width: 1000px; height: 500px;"></ECharts>
			<Row style="margin: 10px 50px;">
				<Col span="12">
					<ECharts :options="aqi_pm_option" style="margin: auto; margin-top: 40px;"></ECharts>
				</Col>
				<Col span="12"><ECharts :options="others_option" style="margin: auto; margin-top: 40px;"></ECharts></Col>
			</Row>
			<Breadcrumb style="float: left; margin-left: 80px; margin-bottom: 10px;">
				<BreadcrumbItem>
					<Icon type="ios-information-circle-outline" /> 空气质量信息
				</BreadcrumbItem>
				<BreadcrumbItem>
					<Icon type="ios-locate" /> 区域：{{city_name}}
				</BreadcrumbItem>
				<BreadcrumbItem>
					<Icon type="ios-cloud" /> 过去数天的AQI信息
				</BreadcrumbItem>
			</Breadcrumb>
			<Divider />
			<ECharts :options="aqi_option" style="margin: auto; margin-top: 40px; width: 1000px;"></ECharts>
		</div>
	</div>
</template>

<script>
	import ECharts from 'vue-echarts'
	import {JSONToExcelConvertor} from '../../static/js/excel.js'
	
	export default {
		name: 'Vcity_info',
		data() {
			return {
				city_name: null,
				aqi_option: null,
				pp_option: null,
				aqi_pm_option: null,
				others_option: null,
			};
		},
		created() {
			this.city_name = this.$route.params.city_name;
			//若参数为city_name==='local'
			if(this.city_name === 'local') {
				let data = this.$store.getters.getIpInfo;
				if(data && data.province !== '') {
					let provs = this.$store.getters.provs;
					let prov = null;
					for(let i in provs) {
						if(data.province.indexOf(provs[i]) != -1) {
							prov = provs[i];
							break;
						}
					}
					let cities = this.$store.getters.citiesOfProv(prov);
					if(data.city !== '') {
						for(let i in cities) {
							if(cities[i] === data.city) {
								this.$router.push({name:'Vcity_info',params:{city_name: data.city}}); 
								return;
							}
						}
					}
					else;//返回该省省会
					this.$router.push({name:'Vcity_info',params:{city_name: cities[0]}});
					return;
				}
				else {//为空时也返回北京
					this.$router.push({name:'Vcity_info',params:{city_name: '北京市'}}); 
				}
				return;
			}
			//若输入的地址不在有效数据内时返回主页
			if(!this.$store.getters.isAInB(this.city_name, this.$store.getters.getAllCitiesName).bool)
				this.$router.push({name:'Vwelcome'});
			this.$store.commit('mut_setCurData');
		},
		mounted() {
			//将uri提交
			this.$store.commit('mut_updateNavItemActive', this.$route.path.split('/')[2]);
			if(this.city_name === 'local') return;
			let city_code = this.$store.getters.cityNameToCityCode[this.city_name];
			//城市当前的数据
			this.$store.commit('mut_setCurData'); //解决数据老化
			let city_cur_data = this.$store.getters.getCertainCityCurDataByCityCode(city_code);
			//城市的过去aqi数据
			let city_passed_aqi = this.$store.getters.getCertainCitySeveralDaysAqiInfoByCityCode(city_code);
			let aqi_pm_data = [city_cur_data.aqi, city_cur_data.pm2_5, city_cur_data.pm10];
			let others_data = [city_cur_data.co, city_cur_data.so2, city_cur_data.o3, city_cur_data.no2];
			let city_name = this.city_name;
			let size = 5;
			let pp_data = [
				{value:5, name: 'PM2.5'},
				{value:5, name: 'PM10'},
				{value:5, name: 'SO2'},
				{value:5, name: 'CO'},
				{value:5, name: 'O3'},
				{value:5, name: 'NO2'},
				{value:5, name: '无'},
			];
			for(let i in pp_data) {
				if(city_cur_data.pri_pollutant.indexOf(pp_data[i].name) != -1) {
					pp_data[i].value = ++size;
				}
			}
			if(size === 5)
				pp_data[6].value = ++size;
			this.aqi_option = {
				title: {
					text: '过去数天的AQI信息',
				},
				xAxis: {
					data: city_passed_aqi.map(function (item) {
						return item.date;
					})
				},
				yAxis: {
					splitLine: {
						show: true
					}
				},
				grid: {
					width: '80%', //画布占echarts的百分比
					left: '5%', //画布距离echarts左边的距离
				},
				toolbox: {
					left: 'center',
					feature: {
						dataZoom: {
							yAxisIndex: 'none'
						},
						restore: {},
						saveAsImage: {},
						myExcel: {
							show: true,
							title: '数据导出为Excel',
							icon: 'image://' + this.$store.getters.appBaseUrlPrefix + 'static/img/export_black.png',
							onclick: function (){
								//先将Array：data转为json
								let d = [];
								
								for (let i = 0; i < city_passed_aqi.length; i++) {
									d.push({
										'城市': city_name,
										'城市编码': city_passed_aqi[i].city_code,
										'时间': city_passed_aqi[i].date, 
										'首要污染物': city_passed_aqi[i].pri_pollutant, 
										'AQI': city_passed_aqi[i].aqi, 
									})
								}
								JSONToExcelConvertor(d,
													 city_name + "过去数天AQI数据",
													 ['城市', '城市编码', '时间', '首要污染物', 'AQI']
													 );
							}
						},
					}
				},
				visualMap: {
					top: 10,
					right: 0,
					pieces: [{
						gt: 0,
						lte: 50,
						color: '#096'
					}, {
						gt: 50,
						lte: 100,
						color: '#ffde33'
					}, {
						gt: 100,
						lte: 150,
						color: '#ff9933'
					}, {
						gt: 150,
						lte: 200,
						color: '#cc0033'
					}, {
						gt: 200,
						lte: 300,
						color: '#660099'
					}, {
						gt: 300,
						color: '#7e0023'
					}],
					outOfRange: {
						color: '#999'
					}
				},
				tooltip : {
					trigger: 'item',
					textStyle:{		
						align:'left',
					},
				},
				series: {
					name: '数据',
					type: 'line',
					data: city_passed_aqi.map(function (item) {
						return [city_name, item.date, item.pri_pollutant, item.aqi];
					}),
					dimensions: ['城市', '日期', '首要污染物', 'AQI',],
					encode: {
						x: '日期',
						y: 'AQI',
						tooltip: ['城市', '日期', '首要污染物', 'AQI',],
					},
					label: {
						normal: {
							formatter: '{@日期}',
							position: 'right',
							show: false
						},
						emphasis: {
							show: true
						}
					},
					markLine: {
						silent: true,
						data: [{
							yAxis: 50
						}, {
							yAxis: 100
						}, {
							yAxis: 150
						}, {
							yAxis: 200
						}, {
							yAxis: 300
						}]
					}
				}
			};
			this.pp_option = {
				title: {
					text: city_name + '实时大气首要污染物',
					subtext: '更新时间：' + this.$store.getters.updateTime,
					left: 'center'
				},
				legend: {
					bottom: 10,
					left: 'center',
					data: ['PM2.5', 'PM10','SO2','CO','O3', 'NO2', '无']
				},
				series : [
					{
						type: 'pie',
						radius : '65%',
						center: ['50%', '50%'],
						top: '5%',
						roseType: 'radius',
						data: pp_data,
						dimensions: ['PM2.5', 'PM10','SO2','CO','O3', 'NO2', '无'],
						itemStyle: {
							emphasis: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						}
					}
				]
			};
			this.aqi_pm_option = {
				title: {
					text: city_name + '实时AQI/PM2.5/PM10',
					subtext: '更新时间：' + this.$store.getters.updateTime,
					left: 'center'
				},
				tooltip : {
					trigger: 'axis',
					axisPointer : {            // 坐标轴指示器，坐标轴触发有效
						type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
					}
				},
				grid: {
					width: '70%',
					center: ['50%', '50%'],
					containLabel: true
				},
				xAxis : [
					{
						type : 'category',
						data : ['AQI', 'PM2.5', 'PM10'],
						axisTick: {
							alignWithLabel: true
						}
					}
				],
				yAxis : [
					{
						type : 'value'
					}
				],
				series : [
					{
						name: '数值',
						type: 'bar',
						barWidth: '60%',
						data: aqi_pm_data,
						itemStyle: {
							normal: {
								//每根柱子颜色设置
								color: function(params) {
									let colorList = [
										"#c23531",
										"#2f4554",
										"#61a0a8",
									];
									return colorList[params.dataIndex];
								}
							}
						},
					}
				]
			};
			this.others_option = {
				title: {
					text: city_name + '实时CO/SO2/O3/NO2',
					subtext: '更新时间：' + this.$store.getters.updateTime,
					left: 'center'
				},
				tooltip : {
					trigger: 'axis',
					axisPointer : {            // 坐标轴指示器，坐标轴触发有效
						type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
					}
				},
				grid: {
					width: '70%',
					center: ['50%', '50%'],
					containLabel: true
				},
				xAxis : [
					{
						type : 'category',
						data : ['一氧化碳', '二氧化硫', '臭氧', '二氧化氮'],
						axisTick: {
							alignWithLabel: true
						}
					}
				],
				yAxis : [
					{
						type : 'value'
					}
				],
				series : [
					{
						name: '数值',
						type: 'bar',
						barWidth: '60%',
						data: others_data,
						itemStyle: {
							normal: {
								//每根柱子颜色设置
								color: function(params) {
									let colorList = [
										"#4BABDE",
										"#FFDE76",
										"#E43C59",
										"#37A2DA"
									];
									return colorList[params.dataIndex];
								}
							}
						},
					}
				]
			};
		},
		components: {
			ECharts,
		}
	}
</script>

<style scoped>

</style>

