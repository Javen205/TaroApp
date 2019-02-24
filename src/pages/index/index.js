import Taro, {
  Component
} from '@tarojs/taro'
import {
  View,
} from '@tarojs/components'
import './index.scss'
import {
  AtNoticebar,
  AtCalendar
} from 'taro-ui'

import logoImg from '../../assets/images/logo.png'


export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }
  // 组件即将挂载
  componentWillMount() {
    console.log("index componentWillMount...");
  }
  // 组件挂载
  componentDidMount() {
    console.log("index componentDidMount...");
  }
  // 组件即将卸载
  componentWillUnmount() {
    console.log("index componentWillUnmount...");
  }
  // 显示组件
  componentDidShow() {
    console.log("index componentDidShow...");
  }
  // 隐藏组件
  componentDidHide() {
    console.log("index componentDidHide...");
  }

  onClickLogo() {
    console.log("onClickLogo...")
    Taro.navigateTo({
      url: '/pages/time/time'
    })
  }

  render() {
    return (
      <View className='page page-index'>
        <View className='logo'>
          <Image onClick={this.onClickLogo} src={logoImg} className='img' mode='widthFix'/>
        </View>
        <View className='page-title'>小马宋的营销日历</View>
        <View>
          <AtNoticebar marquee speed={50}  icon='volume-plus'  >
            有圆点标记的日期才有营销日历，点击日期显示营销日历，营销日历贴图版权为「小马宋」所有，小程序开发作者 By Javen，开源项目:https://gitee.com/javen205
          </AtNoticebar>
        </View>

        <View className='page-content'>
          <AtCalendar isVertical />
        </View>
      </View>
    )
  }
}
