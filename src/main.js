// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import '../static/css/style.css';
import Vuex from 'vuex'
import axios from 'axios'
import $ from 'jquery'
import VueParticles from 'vue-particles'  

 


Vue.config.productionTip = false;

Vue.use(iView);
Vue.use(Vuex);
Vue.use(VueParticles);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    next();
});

router.afterEach(route => {
    iView.LoadingBar.finish();
});

Vue.prototype.$http = axios;


const store = new Vuex.Store({
	state: {
	  
		//注册全局变量
		settings: require('./settings.js'),
		update_time: null, //时类似"2019-02-08T20:00:00"的时间

		nav_item_active: 'home',
		cur_data: null,	//当前367座城市的实时数据
		//	db_aqi_info: null,	//
		cur_data_update_time: null, //当前数据ajax的更新时间
	},
	mutations: { //同步操作

		// 用于维护导航条的显示问题
		mut_updateNavItemActive (state, nav_item_active) {
		  state.nav_item_active = nav_item_active;
		},

		mut_setCurData(state) {
			// 由于axios不支持同步操作
			/**
			 * 更新实时数据
			 */
			if(!this.getters.isExpiredForCurData)
				return;
			$.ajax({
				url: this.getters.apiCurDataAll,
				type:'GET', //GET
				async:false,    //或false,是否异步
				timeout:2000,    //超时时间
				dataType:'json',    //返回的数据格式：
				beforeSend:function(xhr){
				},
				success:function(data,textStatus,jqXHR){
					state.cur_data = data;
					state.update_time = data[0].time;
					state.cur_data_update_time = new Date().getTime(); //更新
				},
				error:function(xhr,textStatus){
					alert('内部错误');
					console.log(textStatus);
				},
				complete:function(){
				}
			})
		},
		
	},
    actions: { //异步操作 如ajax
	},
	//getters使用来获取属性
	getters: {
	
		xadminBaseUrl: state => {
			return state.settings.xadmin_base_url;
		},
	
		appBaseUrlPrefix: state => {
			return state.settings.app_base_url;
		},
		
		apiSuffix: state => {
			return state.settings.api_suffix;
		},
		
		apiProvAll: state => {
			return state.settings.api_url.prov_all;
		},
		
		apiProvOne: (state, pk) => {
			return state.settings.api_url.prov_one + pk + state.settings.api_suffix;
		},
		
		apiCityProvAll: state => {
			return state.settings.api_url.city_prov_all;
		},
		
		apiCityProvOne: (state, pk) => {
			return state.settings.api_url.city_prov_one + pk + state.settings.api_suffix;
		},
		
		apiCurDataAll: state => {
			return state.settings.api_url.cur_data_all;
		},
		
		apiCurDataOne: (state, pk) => {
			return state.settings.api_url.cur_data_one + pk + state.settings.api_suffix;
		},
		
		apiAqiInfoAll: state => {
			return state.settings.api_url.aqi_info_all;
		},
		
		apiAqiInfoOne: (state, pk) => {
			return state.settings.api_url.aqi_info_one + pk + state.settings.api_suffix;
		},
		
// 		apiProvs: (state) => {
// 			return state.settings.api_url.provs;
// 		},
			
		navItemActive: state => {
		  return state.nav_item_active; //可以附加函数功能
		},
		
		curData: state => {
			return state.cur_data;
		},
		
		provs: state => {
			return state.settings.provs;
		},
		
		provToCities: state => { //查询所有的省份到城市映射
			return state.settings.prov_to_cities;
		},
		
		cityNameToCoords: state => {
			return state.settings.city_name_to_coords;
		},
		
		mainCities: state => {
			return state.settings.main_cities;
		},
		
		//获取某省的全部市的地名
		citiesOfProv: state => prov_name => {
			let ret = state.settings.prov_to_cities[prov_name]
			if (ret) return ret;
			else {
				throw `省名输入非法!不存在省级区域名为:${prov_name}`
				return null;
			}
		},
		
		getCertainCityCurDataByCityCode: (state, getters) => city_code => {
			let cur_data = getters.curData;
			for (let i = 0; i < cur_data.length; i++) {
				if (cur_data[i].city_code === city_code)
					return cur_data[i];
			}
			return null; //返回null即暂无数据
		},
		
		convertCitiesDataToSeriesData: (state, getters) => cities_data => { //等价返回一个convertData函数
		/**
		 * 将['上海市',...]类型的城市数据转换成series_data 
		 * 在调用本函数前请确保已经保证state.cur_data有值
		 * return => Array ['城市', '经度', '纬度', 'AQI', 'PM2.5', 'PM10', '二氧化硫', '二氧化氮', '一氧化碳', '臭氧', '首要污染物']														 
		 * 若返回json版本的函数参见convertCitiesDataToJsonData
		 */
			let city_codes_data = []
			let series_data = [];
			let geoCoordMap = getters.cityNameToCoords //获取城市到坐标的map
			for (let i = 0; i < cities_data.length; i++) {
				city_codes_data.push(state.settings.city_name_to_city_code[cities_data[i]]);
				let geoCoord = geoCoordMap[cities_data[i]];
				if (geoCoord) {
					let cur_city = getters.getCertainCityCurDataByCityCode(city_codes_data[i])
					series_data.push([cities_data[i]].concat(geoCoord.concat(cur_city === null ? [null, null, null, null, null, null, null, null] : 
						[cur_city.aqi,  cur_city.pm2_5, cur_city.pm10, cur_city.so2, cur_city.no2, cur_city.co, cur_city.o3, cur_city.pri_pollutant])));
				}
			}
			return series_data;
		},
		
		
		convertCitiesDataToJsonData: (state, getters) => cities_data => { 
		/**
		 * return => json, Array版本参见convertCitiesDataToSeriesData
		 */
			let series_data = getters.convertCitiesDataToSeriesData(cities_data);
			if(series_data) {
				let ret = [];
				for(let i = 0; i < series_data.length; i++) {
					ret.push({
						city_name: series_data[i][0],
						longitude: series_data[i][1],
						latitude: series_data[i][2],
						aqi: series_data[i][3],
						pm2_5: series_data[i][4],
						pm10: series_data[i][5],
						so2: series_data[i][6],
						no2: series_data[i][7],
						co: series_data[i][8],
						o3: series_data[i][9],
						pri_pollutant: series_data[i][10],
					});
				}
				return ret;
			}
			return null;
		},
		
		updateTime: state => {
			//获取cur_time更新的时间
			if(state.update_time) {
				let data = state.update_time.split('T');
				let date = data[0].split('-');
				let time = data[1].split(':');
				return `${date[0]}年${date[1]}月${date[2]}日${time[0]}时`;
			}
			return null;
		},
		
		cityNameToCityCode: state => {
			return state.settings.city_name_to_city_code;
		},
		
		cityCodeToCityName: state => {
			return state.settings.city_code_to_city_name;
		},
		
		isExpiredForCurData: state => { //检测当前时间是否超时时间间隔为5分钟
			if(!state.cur_data_update_time)
				return true;
			if(new Date().getTime() - state.cur_data_update_time >= 5 * 60 * 1000)
				return true;
			return false;
		},
		
		getIpInfo: state => {
			let res = null;
			$.ajax({
				url: state.settings.api_url.ip_query_local,
				type:'GET', //GET
				async:false,    //或false,是否异步
				timeout:1000,    //超时时间
				dataType:'json',    //返回的数据格式：
				beforeSend:function(xhr){
				},
				success:function(data,textStatus,jqXHR){
					res = data;
				},
				error:function(xhr,textStatus){
					alert('内部错误');
					console.log(textStatus);
				},
				complete:function(){
				}
			})
			return res;
		},
		
		//获取郑州预测信息包含郑州过去28h的AQ，新乡，洛阳，许昌7h，郑州过去4h未来4h预测AQ
		getAqPredZZ: state => {
			let res = null;
			$.ajax({
				url: state.settings.api_url.aq_pred_zz,
				type:'GET', //GET
				async:false,    //或false,是否异步
				timeout:1500,    //超时时间
				dataType:'json',    //返回的数据格式：
				beforeSend:function(xhr){
				},
				success:function(data,textStatus,jqXHR){
					res = data;
				},
				error:function(xhr,textStatus){
					alert('内部错误');
					console.log(textStatus);
				},
				complete:function(){
				}
			})
			return res;
		},
		
		//默认30天，注意不足30天的情况
		getCertainCitySeveralDaysAqiInfoByCityCode: state => city_code => {
			let res = null;
			$.ajax({
				url: state.settings.api_url.aqi_info_one + city_code  + '/30/' + state.settings.api_suffix,
				type:'GET', //GET
				async:false,    //或false,是否异步
				timeout:1000,    //超时时间
				dataType:'json',    //返回的数据格式：
				beforeSend:function(xhr){
				},
				success:function(data,textStatus,jqXHR){
					res = data;
				},
				error:function(xhr,textStatus){
					alert('内部错误');
					console.log(textStatus);
				},
				complete:function(){
				}
			})
			return res;
		},
		
		//获取河南某城市的空气质量信息，默认24小时，注意不足24小时的情况
		getCertainCitySeveralHoursInfoByCityCode: state => city_code => {
			let res = null;
			$.ajax({
				url: state.settings.cur_data_one + city_code  + '/24/' + state.settings.api_suffix,
				type:'GET', //GET
				async:false,    //或false,是否异步
				timeout:1000,    //超时时间
				dataType:'json',    //返回的数据格式：
				beforeSend:function(xhr){
				},
				success:function(data,textStatus,jqXHR){
					res = data;
				},
				error:function(xhr,textStatus){
					alert('内部错误');
					console.log(textStatus);
				},
				complete:function(){
				}
			})
			if(res.details) {
				console.log(res.details);
				return null;
			}
			return res;
		},
		
		getAllCitiesName: state => {
			let res = []
			for(let key in state.settings.city_name_to_coords) {
				res.push(key);
			}
			return res;
		},
		
		//判断a是否存在b中
		isAInB: state => (a, b) => {
			for(let i in b) {
				if(a === b[i]) {
					return {bool: true, index: i};
				}
			}
			return {bool: false};
		},
	},
	
})

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router, //注册
	store, //注册
	components: { App },
	template: '<App/>'
})

