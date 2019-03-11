var express = require('express')
var app = express()
var fs = require('fs')
app.use(express.json())

var d = new Date()
var dd = d.getDate()
var mm = d.getMonth()
var yy = d.getFullYear()

var TodayDate = dd.toString() + "-" + mm.toString() + "-" + yy.toString()

// This api for Devlopers
app.get('/allerrors',(req,res)=>{
  fs.readFile( __dirname + '/errorCache.json',(err,data)=>{
    if(err){
      return res.json({"errorMsg":"Check your Json file"})
    }else{
      var allErrors = JSON.parse(data.toString)
      return res.json(allErrors)
    }
  })
})

// This api for Devlopers
app.put('/allerrors/:lang/:err',(req,res)=>{
  errorDict = req.body
  console.log(errorDict)
  fs.readFile( __dirname + '/errorCache.json',(err,data)=>{
    if(err){
      return res.json({"errorMsg":"Check your Json file"})
    }else{
      var allErrors = JSON.parse(data)
      for(var error of allErrors[req.params.lang]){
        if(error['errorName'] === req.params.err){
          if(req.body.hasOwnProperty('example')){
            error['example'] = req.body.example
          }
          if(req.body.hasOwnProperty('url')){
            error['url'] = req.body.url
          }
          break
        }
      }
      var myJSON = JSON.stringify(allErrors,null,2)
      fs.writeFile(__dirname + '/errorCache.json', myJSON, (err,data)=>{
        return res.json(error)
      })
    }
    // return res.json({"errorMsg":"Enter valid error name"})
  })
})

// From here all api's for users.
app.get('/errorDetails/:lang',(req,res)=>{
  fs.readFile( __dirname + '/errorCache.json',(err,data)=>{
    if(err){
      return res.json({"errorMsg":"Check your Json file"})
    }else{
      var allErrors = JSON.parse(data)
      if(allErrors.hasOwnProperty(req.params.lang)){
        return res.json(allErrors[req.params.lang])
      }
      return res.json({"errorMsg":"Enter valid language name"})
    }
  })
})

app.get('/errorDetails/:lang/:err',(req,res)=>{
  var userName = req.query.username
  fs.readFile(__dirname + "/userdetailsCache.json",(err,data)=>{
    if(err){
      return res.json({"errorMsg":"Check your json file"})
    }
    else{
        var allusers = JSON.parse(data.toString())
        var errordict = {'errorName':req.params.err,'date':TodayDate}
        if(allusers.hasOwnProperty(userName)){
          allusers[userName].push(errordict)
        }else{
        allusers[userName] = []
        allusers[userName].push(errordict)
      }
    }
    var myJSON = JSON.stringify(allusers,null,2)
    fs.writeFile(__dirname + "/userdetailsCache.json",myJSON,(err,data)=>{
      if(err){return res.json({"errorMsg":"check your json file."})}else{
        fs.readFile(__dirname + "/errorCache.json", (err, data)=>{
          if(err){
            return res.json(err)
          }else{
            var allErrors = JSON.parse(data.toString())
            var megaDict = {'details':'','pairs':[]}
            for(var exception of allErrors[req.params.lang]){
              if(exception['errorName'] == req.params.err){
                megaDict['details'] = exception
              }
            }
            fs.readFile(__dirname + "/userdetailsCache.json",(err,data)=>{
              var allusersdict = JSON.parse(data.toString())
              for(var user in allusersdict){
                console.log(user)
                if(user !== userName){
                  for(var errorDict of allusersdict[user]){
                    for(var errorcheck of allusersdict[userName]){
                      if(errorDict['errorName'] == errorcheck['errorName'] && errorDict['date'] == errorcheck['date']){
                        if(!megaDict['pairs'].includes(user)){
                          megaDict['pairs'].push(user)

                        }
                      }
                    }

                  }
                  return res.json(megaDict)
                }
              }
            })
          }
        })
      }
    })
  })
})

app.listen(8081,()=>{
  console.log("Server is working proper")
})

// app.get('/errorDetails/:lang/:err',(req,res)=>{
//   var userName = req.query.username
//   fs.readFile(__dirname + "/data/userdetailsCache.json",(err,data)=>{
//     if(err){
//       return res.json({"errorMsg":"Check your json file"})
//     }
//     else{
//         var allusers = JSON.parse(data.toString())
//         var errordict = {'errorName':req.params.err,'date':TodayDate}
//         if(allusers.hasOwnProperty(userName)){
//           allusers[userName].push(errordict)
//         }else{
//         allusers[userName] = []
//         allusers[userName].push(errordict)
//       }
//     }
//     var myJSON = JSON.stringify(allusers,null,2)
//     fs.writeFile(__dirname + "/data/userdetailsCache.json",myJSON,(err,data)=>{
//       if(err){return res.json({"errorMsg":"check your json file."})}else{
//         fs.readFile(__dirname + "/data/errorCache.json", (err, data)=>{
//           if(err){
//             return res.json(err)
//           }else{
//             var allErrors = JSON.parse(data.toString())
//             for(var exception of allErrors[req.params.lang]){
//               if(exception['errorName'] == req.params.err){
//                 return res.json(exception)
//               }
//             }
//           }
//         })
//       }
//     })
//   })
//
// })
