// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'dev-52b67b'
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('calendars').add({
      data: {
        date: new Date(),
      }
    })
  } catch (e) {
    console.error(e)
  }
}