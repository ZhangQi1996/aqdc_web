<template>
	<div style="background-color: #F3F3F3;">
		<div class="container" style="padding-top: 40px; padding-bottom: 40px;">
			<Card style="padding-top: 40px; padding-bottom: 40px;">
				<div style="text-align:center">
					<img style="width:400px; margin-bottom: 15px;" src="../../static/img/predict_logo.jpg">
					<h2 style="margin-bottom: 5px;">一个基于RNN采用 <a href="https://keras.io/" target="_blank">Keras</a>+<a href="https://tensorflow.google.cn/" target="_blank">TensorFlow</a> 技术实现对郑州区域空气质量预测的模型</h2>
					<p style="margin-bottom: 3px;"><i>输入郑州过去历史24h的AQ数据，以及周边城市(新乡、洛阳、许昌)过去历史3h的AQ数据到<a href="../../static/img/aq_predict_model.png" target="_blank">AQPredict模型</a>中，</i></p>
					<p style="margin-bottom: 3px;"><i>通过历史数据以及周围城市与郑州的关系，预测得出郑州接下来4h的AQ信息。</i></p>
				</div>
				<Breadcrumb style="float: left; margin-left: 80px; margin-top: 40px; margin-bottom: 10px;">
					<BreadcrumbItem>
						<Icon type="ios-cloud" /> 过去+预测的空气质量指数-AQI
					</BreadcrumbItem>
				</Breadcrumb>
				<Divider />
				<ECharts :options="aqi_option" style="margin: auto; margin-top: 40px; width: 1000px; height: 500px;"></ECharts>
				<Breadcrumb style="float: left; margin-left: 80px; margin-bottom: 10px;">
					<BreadcrumbItem>
						<Icon type="ios-cloud" /> 过去+预测的空气质量信息-PM2.5 (μg/立方米)
					</BreadcrumbItem>
				</Breadcrumb>
				<Divider />
				<ECharts :options="pm2_5_option" style="margin: auto; margin-top: 40px; width: 1000px; height: 500px;"></ECharts>
				<Breadcrumb style="float: left; margin-left: 80px; margin-bottom: 10px;">
					<BreadcrumbItem>
						<Icon type="ios-cloud" /> 过去+预测的空气质量信息-PM10 (μg/立方米)
					</BreadcrumbItem>
				</Breadcrumb>
				<Divider />
				<ECharts :options="pm10_option" style="margin: auto; margin-top: 40px; width: 1000px; height: 500px;"></ECharts>
				<Breadcrumb style="float: left; margin-left: 80px; margin-bottom: 10px;">
					<BreadcrumbItem>
						<Icon type="ios-cloud" /> 过去+预测的空气质量信息-二氧化硫SO2 (μg/立方米)
					</BreadcrumbItem>
				</Breadcrumb>
				<Divider />
				<ECharts :options="so2_option" style="margin: auto; margin-top: 40px; width: 1000px; height: 500px;"></ECharts>
				<Breadcrumb style="float: left; margin-left: 80px; margin-bottom: 10px;">
					<BreadcrumbItem>
						<Icon type="ios-cloud" /> 过去+预测的空气质量信息-二氧化氮NO2 (μg/立方米)
					</BreadcrumbItem>
				</Breadcrumb>
				<Divider />
				<ECharts :options="no2_option" style="margin: auto; margin-top: 40px; width: 1000px; height: 500px;"></ECharts>
				<Breadcrumb style="float: left; margin-left: 80px; margin-bottom: 10px;">
					<BreadcrumbItem>
						<Icon type="ios-cloud" /> 过去+预测的空气质量信息-一氧化碳CO (mg/立方米)
					</BreadcrumbItem>
				</Breadcrumb>
				<Divider />
				<ECharts :options="co_option" style="margin: auto; margin-top: 40px; width: 1000px; height: 500px;"></ECharts>
				<Breadcrumb style="float: left; margin-left: 80px; margin-bottom: 10px;">
					<BreadcrumbItem>
						<Icon type="ios-cloud" /> 过去+预测的空气质量信息-臭氧O3 (μg/立方米)
					</BreadcrumbItem>
				</Breadcrumb>
				<Divider />
				<ECharts :options="o3_option" style="margin: auto; margin-top: 40px; width: 1000px; height: 500px;"></ECharts>
			</Card>
			
		</div>
	</div>
</template>

<script>
	import ECharts from 'vue-echarts'
	
	
	function aqPredHandler(data_list) {
		let aqi = []
		let pm2_5 = []
		let pm10 = []
		let so2 = []
		let no2 = []
		let co = []
		let o3 = []
		let time = []
		for(let i in data_list) {
			aqi.push(data_list[i].aqi)
			pm2_5.push(data_list[i].pm2_5)
			pm10.push(data_list[i].pm10)
			so2.push(data_list[i].so2)
			no2.push(data_list[i].no2)
			co.push(data_list[i].co)
			o3.push(data_list[i].o3)
			time.push(data_list[i].time)
		}
		return {
			'aqi': aqi,
			'pm2_5': pm2_5,
			'pm10': pm10,
			'so2': so2,
			'no2': no2,
			'co': co,
			'o3': o3,
			'time': time,
		}
	}
	
	//创建一个大小为len的每个元素为fill_stuff的array
	function getFilledArray(len, fill_stuff) {
		let array = new Array(len);
		for(let i = 0; i < len; i++) {
			array[i] = fill_stuff;
		}
		return array;
	}
	
	export default {
		name: 'Vpredict',
		data() {
			return {
				aqi_option: null,
				pm2_5_option: null,
				pm10_option: null,
				so2_option: null,
				no2_option: null,
				co_option: null,
				o3_option: null,
			};
		},
		mounted() {
			//将uri提交
			this.$store.commit('mut_updateNavItemActive', this.$route.path.split('/')[2]);
			let data = this.$store.getters.getAqPredZZ;
			let zz_past_28_obj = aqPredHandler(data.zz_past_28)
			let xx_past_7_obj = aqPredHandler(data.xx_past_7)
			let ly_past_7_obj = aqPredHandler(data.ly_past_7)
			let xc_past_7_obj = aqPredHandler(data.xc_past_7)
			let zz_future_pred_4_obj = aqPredHandler(data.zz_future_pred_4)
			let zz_past_pred_4_obj = aqPredHandler(data.zz_past_pred_4)
			
			let x_axis_data = zz_past_28_obj.time.slice(21, 28).concat(zz_future_pred_4_obj.time)
			
			//aqi
			let zz_past_7_aqi = zz_past_28_obj.aqi.slice(21, 28).concat(['-', '-', '-', '-'])
			let xx_past_7_aqi = xx_past_7_obj.aqi.concat(['-', '-', '-', '-'])
			let ly_past_7_aqi = ly_past_7_obj.aqi.concat(['-', '-', '-', '-'])
			let xc_past_7_aqi = xc_past_7_obj.aqi.concat(['-', '-', '-', '-'])
			let zz_pred_8_aqi = getFilledArray(3, '-').concat(zz_past_pred_4_obj.aqi).concat(zz_future_pred_4_obj.aqi)
			this.aqi_option = {
				tooltip : {
					trigger: 'axis'
				},
				legend: {
					data:['郑州过去7h','新乡过去7h','洛阳过去7h','许昌过去7h','郑州8h预测']
				},
				toolbox: {
					show : true,
					feature : {
						mark : {show: true},
						dataView : {show: true, readOnly: false},
						magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
						restore : {show: true},
						saveAsImage : {show: true}
					}
				},
				calculable : true,
				xAxis : [
					{
						type : 'category',
						boundaryGap : false,
						data : x_axis_data.map(function(x) {
							let _ = x.split('T');
							let date = _[0].split('-');
							let time = _[1].split(':');
							return date[0] + '年' + date[1] + '月' + date[2] + '日' + time[0] + '时'
						})
					}
				],
				yAxis : [
					{
						type : 'value'
					}
				],
				series : [
					{
						name: '郑州过去7h',
						type: 'line',
						smooth:true,
						data: zz_past_7_aqi,
						lineStyle: {
							width: 6 //default value:2
						}
					},
					{
						name: '新乡过去7h',
						type: 'line',
						smooth:true,
						data: xx_past_7_aqi,
					},
					{
						name: '洛阳过去7h',
						type: 'line',
						smooth:true,
						data: ly_past_7_aqi,
					},
					{
						name: '许昌过去7h',
						type: 'line',
						smooth:true,
						data: xc_past_7_aqi,
					},
					{
						name: '郑州8h预测',
						type: 'line',
						smooth:true,
						data: zz_pred_8_aqi,
						lineStyle: {
							width: 6 //default value:2
						}
					},
				]
			};
			
			
			//pm2.5
			let zz_past_7_pm2_5 = zz_past_28_obj.pm2_5.slice(21, 28).concat(['-', '-', '-', '-'])
			let xx_past_7_pm2_5 = xx_past_7_obj.pm2_5.concat(['-', '-', '-', '-'])
			let ly_past_7_pm2_5 = ly_past_7_obj.pm2_5.concat(['-', '-', '-', '-'])
			let xc_past_7_pm2_5 = xc_past_7_obj.pm2_5.concat(['-', '-', '-', '-'])
			let zz_pred_8_pm2_5 = getFilledArray(3, '-').concat(zz_past_pred_4_obj.pm2_5).concat(zz_future_pred_4_obj.pm2_5)
			this.pm2_5_option = {
				tooltip : {
					trigger: 'axis'
				},
				legend: {
					data:['郑州过去7h','新乡过去7h','洛阳过去7h','许昌过去7h','郑州8h预测']
				},
				toolbox: {
					show : true,
					feature : {
						mark : {show: true},
						dataView : {show: true, readOnly: false},
						magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
						restore : {show: true},
						saveAsImage : {show: true}
					}
				},
				calculable : true,
				xAxis : [
					{
						type : 'category',
						boundaryGap : false,
						data : x_axis_data.map(function(x) {
							let _ = x.split('T');
							let date = _[0].split('-');
							let time = _[1].split(':');
							return date[0] + '年' + date[1] + '月' + date[2] + '日' + time[0] + '时'
						})
					}
				],
				yAxis : [
					{
						type : 'value'
					}
				],
				series : [
					{
						name: '郑州过去7h',
						type: 'line',
						smooth:true,
						data: zz_past_7_pm2_5,
						lineStyle: {
							width: 6 //default value:2
						}
					},
					{
						name: '新乡过去7h',
						type: 'line',
						smooth:true,
						data: xx_past_7_pm2_5,
					},
					{
						name: '洛阳过去7h',
						type: 'line',
						smooth:true,
						data: ly_past_7_pm2_5,
					},
					{
						name: '许昌过去7h',
						type: 'line',
						smooth:true,
						data: xc_past_7_pm2_5,
					},
					{
						name: '郑州8h预测',
						type: 'line',
						smooth:true,
						data: zz_pred_8_pm2_5,
						lineStyle: {
							width: 6 //default value:2
						}
					},
				]
			};
			
			//pm10
			let zz_past_7_pm10 = zz_past_28_obj.pm10.slice(21, 28).concat(['-', '-', '-', '-'])
			let xx_past_7_pm10 = xx_past_7_obj.pm10.concat(['-', '-', '-', '-'])
			let ly_past_7_pm10 = ly_past_7_obj.pm10.concat(['-', '-', '-', '-'])
			let xc_past_7_pm10 = xc_past_7_obj.pm10.concat(['-', '-', '-', '-'])
			let zz_pred_8_pm10 = getFilledArray(3, '-').concat(zz_past_pred_4_obj.pm10).concat(zz_future_pred_4_obj.pm10)
			this.pm10_option = {
				tooltip : {
					trigger: 'axis'
				},
				legend: {
					data:['郑州过去7h','新乡过去7h','洛阳过去7h','许昌过去7h','郑州8h预测']
				},
				toolbox: {
					show : true,
					feature : {
						mark : {show: true},
						dataView : {show: true, readOnly: false},
						magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
						restore : {show: true},
						saveAsImage : {show: true}
					}
				},
				calculable : true,
				xAxis : [
					{
						type : 'category',
						boundaryGap : false,
						data : x_axis_data.map(function(x) {
							let _ = x.split('T');
							let date = _[0].split('-');
							let time = _[1].split(':');
							return date[0] + '年' + date[1] + '月' + date[2] + '日' + time[0] + '时'
						})
					}
				],
				yAxis : [
					{
						type : 'value'
					}
				],
				series : [
					{
						name: '郑州过去7h',
						type: 'line',
						smooth:true,
						data: zz_past_7_pm10,
						lineStyle: {
							width: 6 //default value:2
						}
					},
					{
						name: '新乡过去7h',
						type: 'line',
						smooth:true,
						data: xx_past_7_pm10,
					},
					{
						name: '洛阳过去7h',
						type: 'line',
						smooth:true,
						data: ly_past_7_pm10,
					},
					{
						name: '许昌过去7h',
						type: 'line',
						smooth:true,
						data: xc_past_7_pm10,
					},
					{
						name: '郑州8h预测',
						type: 'line',
						smooth:true,
						data: zz_pred_8_pm10,
						lineStyle: {
							width: 6 //default value:2
						}
					},
				]
			};
			
			//so2
			let zz_past_7_so2 = zz_past_28_obj.so2.slice(21, 28).concat(['-', '-', '-', '-'])
			let xx_past_7_so2 = xx_past_7_obj.so2.concat(['-', '-', '-', '-'])
			let ly_past_7_so2 = ly_past_7_obj.so2.concat(['-', '-', '-', '-'])
			let xc_past_7_so2 = xc_past_7_obj.so2.concat(['-', '-', '-', '-'])
			let zz_pred_8_so2 = getFilledArray(3, '-').concat(zz_past_pred_4_obj.so2).concat(zz_future_pred_4_obj.so2)
			this.so2_option = {
				tooltip : {
					trigger: 'axis'
				},
				legend: {
					data:['郑州过去7h','新乡过去7h','洛阳过去7h','许昌过去7h','郑州8h预测']
				},
				toolbox: {
					show : true,
					feature : {
						mark : {show: true},
						dataView : {show: true, readOnly: false},
						magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
						restore : {show: true},
						saveAsImage : {show: true}
					}
				},
				calculable : true,
				xAxis : [
					{
						type : 'category',
						boundaryGap : false,
						data : x_axis_data.map(function(x) {
							let _ = x.split('T');
							let date = _[0].split('-');
							let time = _[1].split(':');
							return date[0] + '年' + date[1] + '月' + date[2] + '日' + time[0] + '时'
						})
					}
				],
				yAxis : [
					{
						type : 'value'
					}
				],
				series : [
					{
						name: '郑州过去7h',
						type: 'line',
						smooth:true,
						data: zz_past_7_so2,
						lineStyle: {
							width: 6 //default value:2
						}
					},
					{
						name: '新乡过去7h',
						type: 'line',
						smooth:true,
						data: xx_past_7_so2,
					},
					{
						name: '洛阳过去7h',
						type: 'line',
						smooth:true,
						data: ly_past_7_so2,
					},
					{
						name: '许昌过去7h',
						type: 'line',
						smooth:true,
						data: xc_past_7_so2,
					},
					{
						name: '郑州8h预测',
						type: 'line',
						smooth:true,
						data: zz_pred_8_so2,
						lineStyle: {
							width: 6 //default value:2
						}
					},
				]
			};
			
			//no2
			let zz_past_7_no2 = zz_past_28_obj.no2.slice(21, 28).concat(['-', '-', '-', '-'])
			let xx_past_7_no2 = xx_past_7_obj.no2.concat(['-', '-', '-', '-'])
			let ly_past_7_no2 = ly_past_7_obj.no2.concat(['-', '-', '-', '-'])
			let xc_past_7_no2 = xc_past_7_obj.no2.concat(['-', '-', '-', '-'])
			let zz_pred_8_no2 = getFilledArray(3, '-').concat(zz_past_pred_4_obj.no2).concat(zz_future_pred_4_obj.no2)
			this.no2_option = {
				tooltip : {
					trigger: 'axis'
				},
				legend: {
					data:['郑州过去7h','新乡过去7h','洛阳过去7h','许昌过去7h','郑州8h预测']
				},
				toolbox: {
					show : true,
					feature : {
						mark : {show: true},
						dataView : {show: true, readOnly: false},
						magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
						restore : {show: true},
						saveAsImage : {show: true}
					}
				},
				calculable : true,
				xAxis : [
					{
						type : 'category',
						boundaryGap : false,
						data : x_axis_data.map(function(x) {
							let _ = x.split('T');
							let date = _[0].split('-');
							let time = _[1].split(':');
							return date[0] + '年' + date[1] + '月' + date[2] + '日' + time[0] + '时'
						})
					}
				],
				yAxis : [
					{
						type : 'value'
					}
				],
				series : [
					{
						name: '郑州过去7h',
						type: 'line',
						smooth:true,
						data: zz_past_7_no2,
						lineStyle: {
							width: 6 //default value:2
						}
					},
					{
						name: '新乡过去7h',
						type: 'line',
						smooth:true,
						data: xx_past_7_no2,
					},
					{
						name: '洛阳过去7h',
						type: 'line',
						smooth:true,
						data: ly_past_7_no2,
					},
					{
						name: '许昌过去7h',
						type: 'line',
						smooth:true,
						data: xc_past_7_no2,
					},
					{
						name: '郑州8h预测',
						type: 'line',
						smooth:true,
						data: zz_pred_8_no2,
						lineStyle: {
							width: 6 //default value:2
						}
					},
				]
			};
			
			//co
			let zz_past_7_co = zz_past_28_obj.co.slice(21, 28).concat(['-', '-', '-', '-'])
			let xx_past_7_co = xx_past_7_obj.co.concat(['-', '-', '-', '-'])
			let ly_past_7_co = ly_past_7_obj.co.concat(['-', '-', '-', '-'])
			let xc_past_7_co = xc_past_7_obj.co.concat(['-', '-', '-', '-'])
			let zz_pred_8_co = getFilledArray(3, '-').concat(zz_past_pred_4_obj.co).concat(zz_future_pred_4_obj.co)
			this.co_option = {
				tooltip : {
					trigger: 'axis'
				},
				legend: {
					data:['郑州过去7h','新乡过去7h','洛阳过去7h','许昌过去7h','郑州8h预测']
				},
				toolbox: {
					show : true,
					feature : {
						mark : {show: true},
						dataView : {show: true, readOnly: false},
						magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
						restore : {show: true},
						saveAsImage : {show: true}
					}
				},
				calculable : true,
				xAxis : [
					{
						type : 'category',
						boundaryGap : false,
						data : x_axis_data.map(function(x) {
							let _ = x.split('T');
							let date = _[0].split('-');
							let time = _[1].split(':');
							return date[0] + '年' + date[1] + '月' + date[2] + '日' + time[0] + '时'
						})
					}
				],
				yAxis : [
					{
						type : 'value'
					}
				],
				series : [
					{
						name: '郑州过去7h',
						type: 'line',
						smooth:true,
						data: zz_past_7_co,
						lineStyle: {
							width: 6 //default value:2
						}
					},
					{
						name: '新乡过去7h',
						type: 'line',
						smooth:true,
						data: xx_past_7_co,
					},
					{
						name: '洛阳过去7h',
						type: 'line',
						smooth:true,
						data: ly_past_7_co,
					},
					{
						name: '许昌过去7h',
						type: 'line',
						smooth:true,
						data: xc_past_7_co,
					},
					{
						name: '郑州8h预测',
						type: 'line',
						smooth:true,
						data: zz_pred_8_co,
						lineStyle: {
							width: 6 //default value:2
						}
					},
				]
			};
			
			//o3
			let zz_past_7_o3 = zz_past_28_obj.o3.slice(21, 28).concat(['-', '-', '-', '-'])
			let xx_past_7_o3 = xx_past_7_obj.o3.concat(['-', '-', '-', '-'])
			let ly_past_7_o3 = ly_past_7_obj.o3.concat(['-', '-', '-', '-'])
			let xc_past_7_o3 = xc_past_7_obj.o3.concat(['-', '-', '-', '-'])
			let zz_pred_8_o3 = getFilledArray(3, '-').concat(zz_past_pred_4_obj.o3).concat(zz_future_pred_4_obj.o3)
			this.o3_option = {
				tooltip : {
					trigger: 'axis'
				},
				legend: {
					data:['郑州过去7h','新乡过去7h','洛阳过去7h','许昌过去7h','郑州8h预测']
				},
				toolbox: {
					show : true,
					feature : {
						mark : {show: true},
						dataView : {show: true, readOnly: false},
						magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
						restore : {show: true},
						saveAsImage : {show: true}
					}
				},
				calculable : true,
				xAxis : [
					{
						type : 'category',
						boundaryGap : false,
						data : x_axis_data.map(function(x) {
							let _ = x.split('T');
							let date = _[0].split('-');
							let time = _[1].split(':');
							return date[0] + '年' + date[1] + '月' + date[2] + '日' + time[0] + '时'
						})
					}
				],
				yAxis : [
					{
						type : 'value'
					}
				],
				series : [
					{
						name: '郑州过去7h',
						type: 'line',
						smooth:true,
						data: zz_past_7_o3,
						lineStyle: {
							width: 6 //default value:2
						}
					},
					{
						name: '新乡过去7h',
						type: 'line',
						smooth:true,
						data: xx_past_7_o3,
					},
					{
						name: '洛阳过去7h',
						type: 'line',
						smooth:true,
						data: ly_past_7_o3,
					},
					{
						name: '许昌过去7h',
						type: 'line',
						smooth:true,
						data: xc_past_7_o3,
					},
					{
						name: '郑州8h预测',
						type: 'line',
						smooth:true,
						data: zz_pred_8_o3,
						lineStyle: {
							width: 6 //default value:2
						}
					},
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

