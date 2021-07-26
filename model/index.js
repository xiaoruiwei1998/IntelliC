var MongoClient = require('mongodb').MongoClient

var url = 'mongodb+srv://Dev-Ruiwei:Xrw1998!!!@bbq.3sexy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

var dbName = 'bbq'

// DB Connectinng Method
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
