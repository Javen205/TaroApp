import Taro, {
  Component
} from '@tarojs/taro'

import {
  View,
  Picker,
  Image,
  Button
} from '@tarojs/components'

import {
  AtButton,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
} from 'taro-ui'

import './time.css'
import logoImg from '../../assets/images/logo.png'

import {
  formatTime,
  format
} from '../../utils/util'

import {
  get as getGlobalData
} from '../../global_data'


// 1.封装一个 Time 组件
export default class Time extends Component {
  constructor(props) {
    super(props)
    // 3.为类添加局部状态
    this.state = {
      date: new Date(),
      moadlOpen: false,
      dateSel: format("yyyy-MM-dd", new Date())
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

  componentWillMount() {
    console.log("componentWillMount...")
  }
  // 4.挂载组件完成中添加定时器来更新组件局部状态
  componentDidMount() {
    console.log("componentDidMount...")
    this.db = getGlobalData("db")
    this.calendar = getGlobalData("calendar")
    this.admin = getGlobalData("admin")

    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
  // 5.在卸载组件中移除定时器
  componentWillUnmount() {
    console.log("componentWillUnmount...")
    clearInterval(this.timerID)
  }

  componentDidShow() {
    console.log("componentDidShow...")
  }

  componentDidHide() {
    console.log("componentDidHide...")
  }
  // 更新组件局部状态
  tick() {
    this.setState({
      date: new Date(),
    });
  }

  toNative() {
    console.log("toNative...")
    Taro.navigateTo({
      url: '/pages/native/native'
    })
  }

  toCalendar(){
    console.log("toCalendar...")
    Taro.navigateTo({
      url: '/pages/calendar/calendar'
    })
  }

  upload() {
    console.log("upload...")
    this.setState({
      moadlOpen: true
    })
  }

  modalOnClick() {

    this.setState({
      moadlOpen: false
    })
    let date = this.state.dateSel;

    console.log("modalOnClick...", date);

    this.uploadFile(date);
  }

  onDateChange = e => {
    this.setState({
      dateSel: e.detail.value
    })
  }


  uploadFile(dateStr) {
    let self = this;

    let date = new Date();
    let tempDate = dateStr.split("-");
    date.setFullYear(parseInt(tempDate[0]),parseInt(tempDate[1])-1,parseInt(tempDate[2]));

    //获取openId
    wx.cloud.callFunction({
        name: 'getOpenId',
      })
      .then(res => {

        let openid = res.result.openid
        //查询是否有权限
        self.admin.where({
            opId: openid,
          })
          .get({
            success(res) {
              console.log(res.data)
              if (res.data.length > 0) {
                //上传营销日历
                Taro.chooseImage().then(res => {
                  console.log(res.tempFilePaths[0])

                  Taro.showLoading({
                      title: '上传中...'
                    })
                    .then(res => console.log(res))

                  // 将图片上传至云存储空间
                  wx.cloud.uploadFile({
                    // 指定上传到的云路径
                    cloudPath: dateStr + ".png",
                    // 指定要上传的文件的小程序临时文件路径
                    filePath: res.tempFilePaths[0],
                  }).then(res => {
                    // get resource ID
                    console.log("文件上传成功:", res.fileID)
                    let fileId = res.fileID
                    // 数据库中添加日历记录
                    self.calendar.add({
                      data: {
                        // date: self.db.serverDate()
                        date: date
                      }
                    }).then(res => {
                      console.log("插入数据成功:", res)
                      Taro.hideLoading()
                      self.showToast("上传成功")
                    }).catch(error => {
                      console.error("插入数据失败:", error)
                      Taro.hideLoading()
                      self.showToast("上传失败")
                      //删除上传的文件
                      wx.cloud.deleteFile({
                        fileList: [fileId]
                      }).then(res => {
                        // handle success
                        console.log(res.fileList)
                      }).catch(error => {
                        // handle error
                        console.log(error)
                      })
                    })
                  }).catch(error => {
                    // handle error
                    console.error("文件上传失败", error)
                    Taro.hideLoading()
                    self.showToast("上传失败")
                  })
                })
              } else {
                Taro.showModal({
                    title: '提示',
                    content: '暂无权限,请联系管理员',
                    showCancel: false
                  })
                  .then(res => {
                    //剪贴板
                    Taro.setClipboardData({
                      data: openid
                    }).then(res => {
                      console.log(res)
                    })
                  })
              }
            }
          })
      })
      .catch(console.error)
  }

  showToast(msg) {
    Taro.showToast({
      title: msg,
      icon: 'none',
      duration: 1000
    })
  }

  render () {
    return (
       <View className='page page-index'>
        <View className='logo'>
          <Image src={logoImg} className='img' mode='widthFix' />
        </View>
        <View className='page-title'>当前时间</View>
        <View className='page-title time'>{formatTime(this.state.date)}</View>
        <View className='page-title' onClick={this.toCalendar}>营销日历@小马宋</View>
        <View className='page-title' onClick={this.toNative}>作者 by Javen</View>
        <View className='page-title'>https://gitee.com/javen205</View>
        <AtButton className='upload' onClick={this.upload} type='primary'>上传营销日历</AtButton>

        <View className='page-title'>
          <AtModal isOpened={this.state.moadlOpen}>
            <AtModalHeader>请选择日期</AtModalHeader>
            <AtModalContent>
              <Picker mode='date' onChange={this.onDateChange}>
                <View className='page-title'>
                  {this.state.dateSel}
                </View>
              </Picker>
            </AtModalContent>
            <AtModalAction> <Button onClick={this.modalOnClick}>确定</Button> </AtModalAction>
          </AtModal>
        </View>
      </View>
    )
  }
}
