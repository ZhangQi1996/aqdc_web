import Vue from 'vue'
import Router from 'vue-router'
import Vwelcome from '@/components/Vwelcome'
import Vmain from '@/components/Vmain'
import Vhome from '@/components/Vhome'
import Vpredict from '@/components/Vpredict'
import Vmana from '@/components/Vmana'
import Vprov_info from '@/components/Vprov_info'
import Vcity_info from '@/components/Vcity_info'

Vue.use(Router)

export default new Router({
	mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Vwelcome',
      component: Vwelcome
    },
		 { 
				path: '/main', 
				component: Vmain,
				children: [
					{
						name: 'Vhome',
						path: 'home',
						component: Vhome
					},
					{
						name: 'Vpredict',
						path: 'predict',
						component: Vpredict,
					},
					{
						name: 'Vmana',
						path: 'mana',
						component: Vmana,
					},
					//*******以下是info********
					{
						name: 'Vprov_info',
						path: 'info/prov/:prov_name',
						component: Vprov_info,
					},
					{
						name: 'Vcity_info',
						path: 'info/city/:city_name',
						component: Vcity_info,
					},
					//***********以上是info**************
					{ 
						path: '', 
						redirect: '/main/home',
					},//空路由
					{ 
						path: '*', 
						redirect: '/main/home',
					}, //空路由
				]
    },
		{ path: '*', redirect: '/' } //空路由
  ]
})



// WEBPACK FOOTER //
// ./src/router/index.js