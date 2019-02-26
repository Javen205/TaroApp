import Taro, {
  Component
} from '@tarojs/taro'
import {
  View,
  Image
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

import {
  formatTime,
  format,
  getMonthLastDate,
  getMonthFirstDate
} from '../../utils/util'

export default class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      // marks: [ { value: '2019-02-13' } ]
      marks: [],
      tips: "有圆点标记的日期才有营销日历，点击日期显示营销日历，营销日历贴图版权为「小马宋」所有，小程序开发作者 By Javen，开源项目:https://gitee.com/javen205",
    }
  }

  config = {
    navigationBarTitleText: '营销日历'
  }

  onShareAppMessage() {
    return {
      title: '小马宋的营销日历',
      path: '/pages/index/index',
      imageUrl: 'https://6361-calendar-6c100-1258631622.tcb.qcloud.la/logo.png'
    }
  }

  // 组件即将挂载
  componentWillMount() {
    console.log("index componentWillMount...");

  }
  // 组件挂载
  componentDidMount() {
    console.log("index componentDidMount...");
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      this.db = getGlobalData("db")
      this.calendar = getGlobalData("calendar")
      this.others = getGlobalData("others")
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

      this.getCalendarsByMonth(format("yyyy-MM-dd", new Date()))
      this.getTips();
    }


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

      // wx.cloud.callFunction({
      //     // 云函数名称
      //     name: 'getCalendar',
      //     // 传给云函数的参数
      //     data: {
      //       gtDate: formatTime(gtTime),
      //       ltDate: formatTime(ltTime),
      //     },
      //   })
      //   .then(res => {
      //     console.log('getCalendar 云函数结果:', res.result)
      //       if (res.result.data.length <= 0) {
      //         that.showToast('无营销日历');
      //       } else {
      //         let current = 'https://6361-calendar-6c100-1258631622.tcb.qcloud.la/' + imageName
      //         Taro.previewImage({
      //           current: current, // 当前显示图片的http链接
      //           urls: [current] // 需要预览的图片http链接列表
      //         })
      //       }

      //   })
      //   .catch(console.error)
    }
  }

  onDayLongClick(event) {
    console.log("onDayLongClick...", event.value)
    // wx.cloud.callFunction({
    //     // 云函数名称
    //     name: 'addCalendar'
    //   })
    //   .then(res => {
    //     console.log('addCalendar 云函数结果:', res.result)
    //   })
    //   .catch(console.error)

    // Taro.chooseImage().then(res => {
    //   let tempFile = res.tempFilePaths[0]
    //   console.log(tempFile)

    //   wx.cloud.callFunction({
    //     name: 'uploadFile',
    //     data:{
    //       filePath:tempFile,
    //       cloudPath:"xxxxx.png"
    //     }
    //   })
    //   .then(res => {
    //     console.log(res)
    //   })
    //   .catch(error => {
    //     console.log(error)
    //   })
    // })


  }


  getTips() {
    let self = this;
    this.others.where({
        type: 0,
        isShow: true
      })
      .get({
        success(res) {
          if (res.data.length > 0) {
            self.setState({
              tips: res.data[0].tip
            })
          }
        }
      })
  }

  // 查询指定日期当月中所有的营销日历
  getCalendarsByMonth(dateStr) {
    let that = this;
    let tempArry = [];

    // 由于每次查询最多只能返回20条数据，所以这里需要使用分页查询

    let gtDate = getMonthFirstDate(dateStr)
    let ltDate = getMonthLastDate(dateStr)
    this.calendar
      .where({
        date: that._.gt(gtDate).and(that._.lt(ltDate)),
      }).count({
        success(res) {
          if (res.total <= 0) {
            return
          }
          if (res.total <= 20) {
            // 少于20 就查询所有
            that.calendar
              .where({
                date: that._.gt(gtDate).and(that._.lt(ltDate)),
              })
              .get({
                success(res) {
                  if (res.data.length > 0) {
                    for (let index = 0; index < res.data.length; index++) {
                      let dateTemp = format("yyyy-MM-dd", res.data[index].date)
                      tempArry.push({
                        value: dateTemp
                      })
                    }
                    that.setState({
                      marks: tempArry
                    })
                  }
                }
              })
          } else {
            // 大于20 就先查询前20 再查询剩余(一个月最多31天)
            that.calendar
              .where({
                date: that._.gt(gtDate).and(that._.lt(ltDate)),
              })
              .get({
                success(res) {
                  if (res.data.length > 0) {
                    for (let index = 0; index < res.data.length; index++) {
                      let dateTemp = format("yyyy-MM-dd", res.data[index].date)
                      tempArry.push({
                        value: dateTemp
                      })
                    }
                    //查询 20 以后的数据
                    that.calendar
                      .where({
                        date: that._.gt(gtDate).and(that._.lt(ltDate)),
                      })
                      .skip(20)
                      .get({
                        success(res) {
                          if (res.data.length > 0) {
                            for (let index = 0; index < res.data.length; index++) {
                              let dateTemp = format("yyyy-MM-dd", res.data[index].date)
                              tempArry.push({
                                value: dateTemp
                              })
                            }
                            that.setState({
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

  onMonthChange(event) {
    console.log("onMonthChange...", event)
    this.getCalendarsByMonth(event);
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
            {this.state.tips}
          </AtNoticebar>
        </View>

        <View className='page-content'>
          <AtCalendar isVertical marks={this.state.marks} onDayClick={this.onDayClick} onDayLongClick={this.onDayLongClick} onMonthChange={this.onMonthChange}/>
        </View>
      </View>
    )
  }
}
