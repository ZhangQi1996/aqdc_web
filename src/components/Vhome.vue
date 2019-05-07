<template>
	<div style="background-color: #000; padding-bottom: 20px;">
		<div class="container">
			<ECharts :options="option" :auto-resize="true" @click='echartsClickHandler' class='map'></ECharts>
			<Drawer :closable="true" width="500" v-model='drawer' :scrollable='true'> <!-- 使用v-model进行双向绑定 -->
				<Vdrawler_inner :drawer_data='drawer_data' />
			</Drawer>
		</div>
	</div>
</template>

<script>
	import ECharts from 'vue-echarts'
	import {JSONToExcelConvertor} from '../../static/js/excel.js'
	import Vdrawler_inner from './Vdrawler_inner'
	
	export default {
		name: 'Vhome',
		data() {	
			return {
				drawer: false,
				drawer_data: {},
				option: null,
			} 
		},
		computed: {
		},
		methods: {
			//将数据渲染到option中
			renderMap(map_name, cities_data) {
				let data = this.$store.getters.convertCitiesDataToSeriesData(cities_data);
				let $this = this;
				this.option = {
					backgroundColor: '#000',
					title: {
						text: '\n\n全国主要城市实时空气质量',
						subtext: '更新时间：' + this.$store.getters.updateTime,
						left: 'center',
						textStyle: {
							color: '#fff'
						}
					},
					toolbox: {
						show: true,
						orient: 'vertical',
						right: '30px',
						top: 'center',
						feature: {
							restore: {},
							saveAsImage: {},
							myExcel: {
								show: true,
								title: '数据导出为Excel',
								icon: 'image://' + this.$store.getters.appBaseUrlPrefix + 'static/img/export.png',
								onclick: function (){
									//先将Array：data转为json
									let d = [];
									
									for (let i = 0; i < data.length; i++) {
										d.push({
											'城市': data[i][0], 
											'经度': data[i][1], 
											'纬度': data[i][2], 
											'AQI': data[i][3], 
											'PM2.5': data[i][4], 
											'PM10': data[i][5], 
											'二氧化硫': data[i][6], 
											'二氧化氮': data[i][7], 
											'一氧化碳': data[i][8], 
											'臭氧': data[i][9], 
											'首要污染物': data[i][10]
										})
									}
									JSONToExcelConvertor(d,
														 "全国主要城市实时空气质量-" + $this.$store.getters.updateTime,
														 ['城市', '经度', '纬度', 'AQI', 'PM2.5', 'PM10', '二氧化硫', '二氧化氮', '一氧化碳', '臭氧', '首要污染物']
														 );
								}
							},
						},
						iconStyle:{
							normal:{
								color:'#fff'
							}
						}
					},
					legend: {
						orient: 'vertical',
						y: 'bottom',
						x:'right',
						data:['空气质量'],
						textStyle: {
							color: '#fff'
						}
					},
					visualMap: {
						pieces: [
							{min: 300, label: '空气质量级别为六级，空气质量状况属于严重污染。'}, // 不指定 max，表示 max 为无限大（Infinity）。
							{min: 200, max: 300, label: '空气质量级别为五级，空气质量状况属于重度污染。'},
							{min: 150, max: 200, label: '空气质量级别为四级，空气质量状况属于中度污染。'},
							{min: 100, max: 150, label: '空气质量级别为三级，空气质量状况属于轻度污染。'},
							{min: 50, max: 100, label: '空气质量级别为二级，空气质量状况属于良。'},
							{min: 0, max: 50, label: '空气质量级别为一级，空气质量状况属于优。'},     // 不指定 min，表示 min 为无限大（-Infinity）。
						],
						dimension: 3,
						color: ['#d94e5d','#eac736','#50a3ba'],
						textStyle: {
							color: '#fff'
						}
					},
					geo: {
						map: 'china',	//必须是china否则不显示南海小地图
						label: {
							emphasis: {
								show: true,
								textStyle:{
									color:'#fff',
									fontSize:15
								}
							}
						},
						roam: true,
						itemStyle: {
							normal: {
								areaColor: '#323c48',
								borderColor: '#111'
							},
							emphasis: {
								areaColor: '#2a333d'
							}
						}
					},
					tooltip : {
						trigger: 'item',
						textStyle:{		
							align:'left',
						},
					},
					series : [
						{
							name: '空气质量',
							type: 'scatter',
							coordinateSystem: 'geo',
							data: data,
							symbolSize: function (val) {
								return (val[3] === null ? 30 : val[3]) / 8;
							},
							dimensions: ['城市', '经度', '纬度', 'AQI', 'PM2.5', 'PM10', '二氧化硫', '二氧化氮', '一氧化碳', '臭氧', '首要污染物'],
							encode: {
								seriesName: '城市',
								itemId: '城市',
								lng: '经度',      // 表示维度 0 映射到 x 轴。
								lat: '纬度',              // 表示维度1 映射到 y 轴。
								tooltip:  ['城市', '经度', '纬度', 'AQI', 'PM2.5', 'PM10', '二氧化硫', '二氧化氮', '一氧化碳', '臭氧', '首要污染物'], // 表示维度 0 1 2 会在 tooltip 中显示。
							},
							label: {
								normal: {
									formatter: '{@城市}',
									position: 'right',
									show: false
								},
								emphasis: {
									show: true
								}
							},
							itemStyle: {
								normal: {
									color: '#ddb926'
								}
							}
						},
						{
							name: 'Top 10',
							type: 'effectScatter',
							coordinateSystem: 'geo',
							data: data.sort(function (a, b) {
								return (b[3] === null ? 30 : b[3]) - (a[3] === null ? 30 : a[3]);
							}).slice(0, 10),
							symbolSize: function (val) {
								return (val[3] === null ? 30 : val[3]) / 8;
							},
							showEffectOn: 'render',
							rippleEffect: {
								brushType: 'fill'
							},
							hoverAnimation: true,
							dimensions: ['城市', '经度', '纬度', 'AQI', 'PM2.5', 'PM10', '二氧化硫', '二氧化氮', '一氧化碳', '臭氧', '首要污染物'], // 表示维度 0 1 2 会在 tooltip 中显示。
							encode: {
								seriesName: '城市',
								itemId: '城市',
								lng: '经度',      // 表示维度 0 映射到 x 轴。
								lat: '纬度',              // 表示维度1 映射到 y 轴。
								tooltip:  ['城市', '经度', '纬度', 'AQI', 'PM2.5', 'PM10', '二氧化硫', '二氧化氮', '一氧化碳', '臭氧', '首要污染物'], // 表示维度 0 1 2 会在 tooltip 中显示。
							},
							label: {
								normal: {
									formatter: '{@城市}',
									position: 'right',
									show: false
								},
								emphasis: {
									show: true
								}
							},
							itemStyle: {
								normal: {
									color: '#f4e925',
									shadowBlur: 10,
									shadowColor: '#333'
								}
							},
							zlevel: 1
						}
					]
				}
			},
			
			echartsClickHandler(params) {
				//更新drawler的html
				let cities = this.$store.getters.citiesOfProv(params.name);
				let drawler_data = {
					prov_name: params.name,
					update_time: this.$store.getters.updateTime,
					json_data: this.$store.getters.convertCitiesDataToJsonData(cities),
					jump_url: null, //TODO
				};
				
				this.drawer_data = drawler_data;
				this.drawer = true;
			},
			
			
		},
		created() {
			this.$store.commit('mut_setCurData');
		},
		mounted() {
			//将uri提交
			this.$store.commit('mut_updateNavItemActive', this.$route.path.split('/')[2]);
			//直辖市和特别行政区-只有二级地图，没有三级地图
			let $this = this;
			//绘制全国地图
			$this.$http.get('/static/map/china.json', {})
			.then(rsp => {
				let main_cities = $this.$store.getters.mainCities;
				//注册地图
				ECharts.registerMap('china', rsp.data);
				//绘制地图
				$this.renderMap('china', main_cities);
			}).catch(err => {
				alert('内部错误');
				console.log(err);
			});
		},
		components: {
			ECharts,
			Vdrawler_inner,
		},
	}
	
	
</script>

<style scoped>
	.map {
		width: 100%;
		height: 800px;
		overflow: hidden;
	}
</style>

