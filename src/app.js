import Taro, {
  Component
} from '@tarojs/taro'
import Index from './pages/index'

import './app.scss'
// 引入组件样式
import 'taro-ui/dist/style/index.scss'

// 全局变量
import {
  set as setGlobalData
} from './global_data'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/time/time',
      'pages/native/native',
      'pages/calendar/calendar'    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    cloud: true,
    plugins: {
        calendar: {
            version: '1.1.3',
            provider: 'wx92c68dae5a8bb046'
        }
    }
  }

  componentDidMount() {
    // 多平台适配
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      wx.cloud.init({
        env: 'calendar-6c100', // 默认统一环境
        traceUser: true
      })
      // 或者 
      // wx.cloud.init({
      //   env: {
      //     database: 'dev-52b67b', // 数据库 API 默认环境配置
      //     storage: 'dev-52b67b', // 存储 API 默认环境配置
      //     functions:'dev-52b67b' // 云函数 API 默认环境配置
      //   },
      //   traceUser: true
      // })

      // 数据库的初始化
      this.db = wx.cloud.database({
        env: 'calendar-6c100'
      })

      // 连接数据库
      this.calendar = this.db.collection('calendar')
      this.admin = this.db.collection('admin')
      this.others = this.db.collection('others')
      // 设置全局变量
      setGlobalData('db', this.db)
      setGlobalData('calendar', this.calendar)
      setGlobalData('admin', this.admin)
      setGlobalData('others', this.others)

      console.log('初始化完成...');

    }
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return ( <
      Index / >
    )
  }
}

Taro.render( < App / > , document.getElementById('app'))
