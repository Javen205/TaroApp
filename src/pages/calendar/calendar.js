const {
  get
} = require('../../global_data')

const {
  formatNumber
} = require('../../utils/util')

// calendar 插件 https://github.com/czcaiwj/calendar

Page({

  /**
   * 页面的初始数据
   */
  data: {
    year: new Date().getFullYear(), // 年份
    month: new Date().getMonth() + 1, // 月份
    day: new Date().getDate(),
    days_style: [],
    logo: "../../assets/images/logo.png"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    const days_count = new Date(this.data.year, this.data.month, 0).getDate();

    let days_style = new Array();
    for (let i = 1; i <= days_count; i++) {
      const date = new Date(this.data.year, this.data.month - 1, i);
      if (date.getDay() == 0) {
        days_style.push({
          month: 'current',
          day: i,
          color: '#f488cd'
        });
      } else {
        days_style.push({
          month: 'current',
          day: i,
          color: '#a18ada'
        });
      }
    }

    days_style.push({
      month: 'current',
      day: this.data.day,
      color: 'white',
      background: '#b49eeb'
    });

    this.setData({
      days_style
    });


    this.db = get("db");
    this.calendar = get("calendar");
    this._ = this.db.command;

  },

  next: function (event) {
    console.log(event.detail);
  },

  prev: function (event) {
    console.log(event.detail);
  },

  dateChange: function (event) {
    console.log(event.detail);
  },

  dayClick: function (event) {
    console.log(event.detail);

    let year = event.detail.year;
    let month = event.detail.month;
    let day = event.detail.day;

    let days_style = this.data.days_style;
    days_style.pop();
    days_style.push({
      month: 'current',
      day: day,
      color: 'white',
      background: '#b49eeb',
      bottomText: '已签到',
      fontSize: '20rpx'
    });
    this.setData({
      days_style
    });


    let that = this;
    let imageName = [year, month, day].map(formatNumber).join('-') + ".png";
    console.log("imageName:", imageName);
    // 根据时间查询当日营销日历

    //拼接大于时间
    let gtTime = new Date()
    gtTime.setFullYear(year, month - 1, day);
    gtTime.setHours(0, 0, 0)
    //拼接小于时间
    let ltTime = new Date()
    ltTime.setFullYear(year, month - 1, day);
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
            wx.previewImage({
              current: current, // 当前显示图片的http链接
              urls: [current] // 需要预览的图片http链接列表
            })
          }
        }
      })
  },

  showToast(msg) {
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 1000
    })
  }
})
