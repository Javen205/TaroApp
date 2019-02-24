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

// 全局变量
import {
  get as getGlobalData
} from '../../global_data'

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
    this.db = getGlobalData("db")
    this.calendar = getGlobalData("calendar")
    this._ = this.db.command

    wx.cloud.callFunction({
        // 云函数名称
        name: 'getOpenId',
        // 传给云函数的参数
        data: {
          a: 1,
          b: 2,
        },
      })
      .then(res => {
        console.log('云函数结果:', res.result)
      })
      .catch(console.error)
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

  onDayClick(event) {
    console.log("onDayClick...", event.value)
    let that = this;
    let imageName = event.value + ".png"
    // 根据时间查询当日营销日历
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {

      let temp = event.value.split("-")
      //拼接大于时间
      var gtTime = new Date()
      gtTime.setFullYear(parseInt(temp[0]), parseInt(temp[1]) - 1, parseInt(temp[2]));
      gtTime.setHours(0, 0, 0)
      //拼接小于时间
      let ltTime = new Date()
      ltTime.setFullYear(parseInt(temp[0]), parseInt(temp[1]) - 1, parseInt(temp[2]));
      ltTime.setHours(23, 59, 59)

      //根据时间查询
      that.calendar.where({
          date: that._.gt(gtTime).and(that._.lt(ltTime)),
        })
        .get({
          success(res) {
            if (res.data.length <= 0) {
              that.showToast('无营销日历');
            } else {
              let current = 'https://6361-calendar-6c100-1258631622.tcb.qcloud.la/' + imageName
              Taro.previewImage({
                current: current, // 当前显示图片的http链接
                urls: [current] // 需要预览的图片http链接列表
              })
            }
          }
        })

    }
  }

  onDayLongClick(event) {
    console.log("onDayLongClick...", event.value)
  }

  getCalendarsByMonth(dateStr) {
    let self = this;
    let tempArry = [];
    //最多只能查看20条数据
    this.calendar
      .where({
        date: self._.gt(self.getMonthFirst(dateStr)).and(self._.lt(self.getMonthLast(dateStr))),
      }).count({
        success(res) {
          if (res.total <= 0) {
            return
          }
          if (res.total <= 20) {
            self.calendar
              .where({
                date: self._.gt(self.getMonthFirst(dateStr)).and(self._.lt(self.getMonthLast(dateStr))),
              })
              .get({
                success(res) {
                  if (res.data.length > 0) {
                    for (let index = 0; index < res.data.length; index++) {
                      let dateTemp = self.format("yyyy-MM-dd", res.data[index].date)
                      tempArry.push({
                        value: dateTemp
                      })
                    }
                    self.setState({
                      marks: tempArry
                    })
                  }
                }
              })
          } else {
            self.calendar
              .where({
                date: self._.gt(self.getMonthFirst(dateStr)).and(self._.lt(self.getMonthLast(dateStr))),
              })
              .get({
                success(res) {
                  if (res.data.length > 0) {
                    for (let index = 0; index < res.data.length; index++) {
                      let dateTemp = self.format("yyyy-MM-dd", res.data[index].date)
                      tempArry.push({
                        value: dateTemp
                      })
                    }
                    self.calendar
                      .where({
                        date: self._.gt(self.getMonthFirst(dateStr)).and(self._.lt(self.getMonthLast(dateStr))),
                      })
                      .skip(20)
                      .get({
                        success(res) {
                          if (res.data.length > 0) {
                            for (let index = 0; index < res.data.length; index++) {
                              let dateTemp = self.format("yyyy-MM-dd", res.data[index].date)
                              tempArry.push({
                                value: dateTemp
                              })
                            }
                            self.setState({
                              marks: tempArry
                            })
                          }
                        }
                      })
                  }
                }
              })
          }
        }
      })
  }

  showToast(msg) {
    Taro.showToast({
      title: msg,
      icon: 'none',
      duration: 1000
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
          <AtCalendar isVertical onDayClick={this.onDayClick} onDayLongClick={this.onDayLongClick} />
        </View>
      </View>
    )
  }
}
