// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'dev-52b67b'
})

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('calendars').where({
      date: _.gt(new Date(event.gtDate)).and(_.lt(new Date(event.ltDate)))
    }).get()
  } catch (e) {
    console.error(e)
  }
}