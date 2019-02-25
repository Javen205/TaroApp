export const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

export const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


export const getMonthFirstDate = dateStr => {
  let temp = dateStr.split("-");
  let date = new Date()
  date.setFullYear(parseInt(temp[0]), parseInt(temp[1]) - 1, 1);
  date.setHours(0, 0, 0)
  return date
}

export const getMonthLastDate = dateStr => {
  let temp = dateStr.split("-");
  let date = new Date();
  date.setFullYear(parseInt(temp[0]), parseInt(temp[1]) - 1, 1);
  let currentMonth = parseInt(date.getMonth())
  let nextMonth = ++currentMonth;
  let nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
  let oneDay = 1000 * 60 * 60 * 24;
  let lastTime = new Date(nextMonthFirstDay - oneDay);
  let day = lastTime.getDate();
  date.setFullYear(parseInt(temp[0]), parseInt(temp[1]) - 1, parseInt(day));
  date.setHours(23, 59, 59)
  return date
}

export const format = (fmt, data) => {
  let o = {
    "M+": data.getMonth() + 1, //月份   
    "d+": data.getDate(), //日   
    "h+": data.getHours(), //小时   
    "m+": data.getMinutes(), //分   
    "s+": data.getSeconds(), //秒   
    "q+": Math.floor((data.getMonth() + 3) / 3), //季度   
    "S": data.getMilliseconds() //毫秒   
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (data.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

export const add = (a, b) => {
  return a + b
}
