let app  = require("express")()
let http = require("http").Server(app);
let io   = require("socket.io")(http)

app.get("/", function (req, res) {
  res.sendFile(__dirname.replace("server", "front") + '/index.html')
})

let socket = []  //socket数组  每个元素代表一个client与server的socket对象
let queue = []   //还未找到对手的队列

io.on("connection", function (socket) {
  let username = ""
  socket.emit('successconn')
  console.log("a user connected!")

  socket.on("disconnect", function () {
    console.log("a user disconnected!")
    delete queue[username]
    delete socket[username]
  })

  socket.on("register", function (data){
    username = data.username
    socket[username] = socket
    queue.push(username)
    socket.emit('finding')
    console.log("user " + username + " joined!")
    //开始查找对手
    let timer = setInterval(function () {
      findOpponent(queue, username, function (res) {
        console.log("start find")
        
        if(!res){
          console.log("没有找到对手，2秒后重新查找")
          return
        }
        console.log("找到对手：" + res)
        socket.emit("found", {opponent: res})
        clearInterval(timer)
      })
    }, 2000)
  })


})

http.listen(3000, function () {
  console.log("Server listening on localhost:3000")
})

function findOpponent(que, name, cb) {
  //查找对手
  if(que.length == 0) {
    cb(null)
    return
  }
  let res = ""
  for(var i in que){
    if(que[i] != name) {
      res = que[i]
      break
    }
  }
  cb(res)
}
