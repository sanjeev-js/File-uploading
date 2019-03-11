var express = require('express');
var app = express();
var fs = require("fs");
app.use(express.json());


// Task 1

app.get('/courses', function(req,res){
// First read the exisiting courses.

fs.readFile(__dirname + '/courses.json',(err,data)=>{
  let courses = JSON.parse(data.toString());
  return res.json(courses);
  });
})

// Task 2

app.post('/courses', function (req, res) {
// Create New course.
  var courses = req.body;
  fs.readFile( __dirname + "/courses.json", function(err, data){
    if(err){
      return res.json({"errMsg": "Check your json file"});
    }else{
      raw = JSON.parse( data );
      courses['id'] = raw.length + 1;
      if(courses.hasOwnProperty('name') && courses.hasOwnProperty('description')){
        raw.push(courses);
        var myJSON = JSON.stringify(raw);
        fs.writeFile(__dirname + "/courses.json", myJSON, function(err,data){
          return res.json(courses)
        });
      }else{
        return res.json({errorMsg:'Json File check karo'})
      }
    };
  });
})

// Task 3

app.get('/courses/:id', function(req,res,next){
  fs.readFile( __dirname + "/courses.json", function(err,data){
    coursesList = JSON.parse(data)
    for(var course of coursesList){
      if(course['id'] === parseInt(req.params.id)){
      var check = true;
      break;
      }
      else{
        var flag = false
      }
    }
    if(flag == true){
      return res.json(course);
    }
    else if(flag == false){
      return res.json({
      errMsg:"Di gayi courseId ko check karo. Galat hai."
      });
    }
  })
})

//Task 4
app.put('/courses/:id', function(req,res){
  fs.readFile(__dirname + "/courses.json", function(err,data){
    coursesList = JSON.parse(data)
    for(var course of coursesList){
      if(course['id'] === parseInt(req.params.id)){
        if(req.body.hasOwnProperty('name') == course.hasOwnProperty('name')){
          course['name'] = req.body['name']
        };
        if(req.body.hasOwnProperty('description') == course.hasOwnProperty('description')){
          course['description'] = req.body['description']
        };
      };
    };
      var myJSON = JSON.stringify(coursesList)
      fs.writeFile(__dirname + "/courses.json", myJSON, function(err,data){
      return res.json(coursesList[parseInt(req.params.id) -1])
    });
  });
});

// Task 5
// Read List of all excercises

app.get('/courses/:id/exercises',(req,res)=>{
  fs.readFile(__dirname + "/exercise.json", function(err,data){
  var newList = []
  var excercisesList = JSON.parse(data)
  for(var excercise of excercisesList){
    if(excercise['courseId'] == parseInt(req.params.id)){
    newList.push(excercise)
  }
}
  if(newList.length === 0){
    return res.json({errMsg:"Ye course available nahi hain."})
  }
    return res.json(newList)
  })
})

// Task 6
// Create excercise of corresponding excercises

app.post('/courses/:id/exercises', function(req,res){
  excercises = req.body
  fs.readFile(__dirname + "/exercise.json", function(err,data){
  if(err){
    return res.json({errorMsg:"Check your json file"})
  }else{
    var excercisesList = JSON.parse(data)
    excercises['id'] = excercisesList.length + 1
    excercises['courseId'] = parseInt(req.params.id);
    if(req.body.hasOwnProperty('name') && req.body.hasOwnProperty('description')){
      excercisesList.push(excercises)
      myJSON = JSON.stringify(excercisesList)
      fs.writeFile(__dirname + '/exercise.json', myJSON, function(err, data){
        return res.json(excercises)
      })
    }else{
      return res.json({errMsg:'Check your json file'})
      }
    }
  })
})

// Task 7
// Read excercises by id

app.get('/courses/:cid/exercises/:eid',function(req,res){
  fs.readFile(__dirname + '/exercise.json',function(err,data){
  excercisesList = JSON.parse(data)
  for(var excercise of excercisesList){
    if(excercise['courseId'] == parseInt(req.params.cid)){
      if(excercise['id'] == parseInt(req.params.eid)){
        return res.json(excercise)
        }
      } 
    }
  })
})

// Task 8

app.put('/courses/:cid/exercises/:pid', function(req,res){
  fs.readFile(__dirname + "/exercise.json",function (err,data){
  excercisesList = JSON.parse(data)
  for(var excercise of excercisesList){
    if(excercise['courseId'] == parseInt(req.params.cid)){
      if(excercise['id'] == parseInt(req.params.eid)){
        if(req.body.hasOwnProperty('name') || req.body.hasOwnProperty('description')){
          excercise['name'] = req.body['name'];
          excercise['description'] = req.body['description'];
        }
      }
    }
  }
var myJSON = JSON.stringify(excercisesList)
  fs.writeFile(__dirname + "/exercise.json", myJSON, function(err,data){
    return res.json(excercisesList[parseInt(req.params.eid) -1])
    });
  });
});

// Task 9
// submission

app.get("/courses/:cid/exercises/:eid/submissions", function (req,res){
  fs.readFile(__dirname + "/submission.json" , function(err, data){
    submissionList = JSON.parse(data); 
    return res.send(submissionList);
  })
})

// Task 10
// Creating submission

app.post("/courses/:cid/exercises/:eid/submissions", function(req, res){
  submission = req.body;
  fs.readFile(__dirname + "/submission.json", function(err,data){
    submissionList = JSON.parse(data);
    submission['id'] = submissionList.length + 1;
    submission["courseid"] = parseInt(req.params.cid);
    submission["exerciseid"] = parseInt(req.params.eid);
    submissionList.push(submission);

    myJson = JSON.stringify(submissionList,null,2);
    fs.writeFile(__dirname + "/submission.json", myJson, function(err,data){
      return res.json (submissionList);
    })
  })
})


app.listen(2000,()=>{
console.log("Server Working Properly")
})
