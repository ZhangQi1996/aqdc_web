<template>
	<div>
		<h1>区域：{{drawer_data.prov_name}} ({{drawer_data.update_time}})</h1>
		<Divider/>
		<Table :row-class-name="rowClassName" :columns="columns" :data="jsonData"></Table>
		<Row class='drawer-inner-btn-wrapper'>
			<Col span="12" class='drawer-inner-col'><Button type="primary" size='large' @click="clickHandler">导出为EXCEL</Button></Col>
			<Col span="12" class='drawer-inner-col'><Button type="primary" size='large' :to='moreInfoUrl()'>更多详情</Button></Col>
		</Row>
	</div>
</template>

<script>
	import {getPolInfo} from '../../static/js/pol_info.js'
	import {JSONToExcelConvertor} from '../../static/js/excel.js'
	
	export default {
		name: 'Vdrawler_inner',
		data() {
			return {
				columns: [
					{ title: '城市', key: 'city_name'},
				/* 	{ title: '经度', key: 'longitude'},
					{ title: '纬度', key: 'latitude'}, */
					{ title: 'AQI', key: 'aqi'},
					{ title: 'PM2.5', key: 'pm2_5'},
					{ title: 'PM10', key: 'pm10'},
			/* 		{ title: '二氧化硫', key: 'so2'},
					{ title: '二氧化氮', key: 'no2'},
					{ title: '一氧化碳', key: 'co'},
					{ title: '臭氧', key: 'o3'}, */
					{ title: '首要污染物', key: 'pri_pollutant'},
				],									 
			};
		},
		props: {
			drawer_data: {
				type: Object,
				required: true,
			}
		},
		mounted() {
		},
		methods: {
			rowClassName (row_data, index) {
				if(row_data && row_data.aqi) {
					let pol_data = getPolInfo(row_data.aqi);
					return 'table-level' + pol_data.level;
				}
                return 'table-error';				
            },
			
			moreInfoUrl() { //更多信息的跳转链接
				return {
					name: 'Vprov_info',
					params: {
						prov_name: this.drawer_data.prov_name,
					}
				}
			},
			
			clickHandler() {
				JSONToExcelConvertor(this.drawer_data.json_data, this.drawer_data.prov_name + '-' + this.drawer_data.update_time, [
					'城市', '经度', '纬度', 'AQI', 'PM2.5', 'PM10', '二氧化硫', '二氧化氮', '一氧化碳', '臭氧', '首要污染物'
				]);
			}
			
		},
		computed: {
			jsonData() {
				return this.drawer_data.json_data 
			}
		},
	}
</script>

<style> /* 注由于子组件的原因不能加scoped */

	
</style>
