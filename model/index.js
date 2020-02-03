var MongoClient = require('mongodb').MongoClient

var url = 'mongodb://localhost:27017'

var dbName = 'IntelliC'

// Database Connectinng Method
function connect(callback) {
    MongoClient.connect(url, function(err, client) {
        if (err) {
            console.log('Database Connecting Error!', err)
        } else {
            var db = client.db(dbName)
            callback && callback(db)
            client.close()
        }
    } )
}

// 封装完成 connect 模块 🐂🍺！
module.exports = {
    connect
}