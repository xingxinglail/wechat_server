const mysql = require('mysql')

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'zxc123741',
  database: 'wechat',
  multipleStatements: true
})

module.exports = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        reject(err)
      } else {
        // Use the connection
        connection.query(sql, values, (error, results) => {
          // And done with the connection.
          connection.release()
          // Handle error after the release.
          if (error) {
            reject(error)
          } else {
            resolve(results)
          }
        })
      }
    })
  })
}