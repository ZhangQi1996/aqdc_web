<template>
	<div style="background-color: #000; padding-bottom: 20px;">
		<div class="container">
			<ECharts :options="option" :auto-resize="true" @click='echartsClickHandler' class='map'></ECharts>
		</div>
	</div>
</template>

<script>
	import {provinces} from '../../static/js/provinces.js'
	import ECharts from 'vue-echarts'
	import 'echarts' //直接全部导入
	import {JSONToExcelConvertor} from '../../static/js/excel.js'
	
	export default {
		name: 'Vprov_info',
		data() {
			return {
				prov_name: this.$route.params.prov_name,
				option: null, 
			};
		},
		created() {
			//更新全局的实时数据
			this.$store.commit('mut_setCurData');
			
		},
		methods: {
			echartsClickHandler() {
				
			},
			
			renderMap(map_name, cities_data) {
				let data = this.$store.getters.convertCitiesDataToSeriesData(cities_data);
				let $this = this;
				this.option = {
					backgroundColor: '#000',
					title: {
						text: `\n\n${$this.prov_name}实时空气质量`,
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
														 `${$this.prov_name}实时空气质量-` + $this.$store.getters.updateTime,
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
						map: this.prov_name,	//必须是china否则不显示南海小地图
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
							type: 'effectScatter',
							coordinateSystem: 'geo',
							data: data,
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
		},
		mounted() {
			//将uri提交
			this.$store.commit('mut_updateNavItemActive', this.$route.path.split('/')[2]);
			let $this = this;
			//绘制全国地图
			$this.$http.get(`/static/map/province/${provinces[$this.prov_name]}.json`, {})
			.then(rsp => {
				//注册地图
				ECharts.registerMap($this.prov_name, rsp.data);
				let cities_data = this.$store.getters.citiesOfProv($this.prov_name);
				//绘制地图
				$this.renderMap($this.prov_name, cities_data);
			}).catch(err => {
				alert(内部错误);
				console.log(err);
			});
		},
		components: {
			ECharts,
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
