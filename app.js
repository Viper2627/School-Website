var express = require("express"),
bodyParser  = require("body-parser"),
mongoose    = require("mongoose"),
passport    = require("passport"),
multer      = require("multer"),
GridFsStorage = require("multer-gridfs-storage"),
Grid        = require("gridfs-stream"),
LocalStrategy = require("passport-local"),
User        = require("./models/user"),
MongoClient = require('mongodb').MongoClient,
app         = express();
var conn = mongoose.createConnection("mongodb+srv://rg:rg@cluster0.dqjv7.mongodb.net/mainpage?retryWrites=true&w=majority");
mongoose.connect("nodmongodb+srv://rg:rg@cluster0.dqjv7.mongodb.net/mainpage?retryWrites=true&w=majority",{ 
    useNewUrlParser: true,useUnifiedTopology: true });
 $ = require('jquery')
app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const path = require('path');
const { ppid } = require("process");
const { post } = require("jquery");
app.use(require("express-session")({
    secret:"ramesh is hero",
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);  
  gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
  url:"mongodb://localhost/mainpage" ,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
        const filename = file.originalname;
        const fileInfo = {
            title: "hero",
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
    });
  }
});

//header.create({

const upload = multer({ storage });
var anounce = new mongoose.Schema({
    inf : String,
    title: String,
    Created: {type:Date, default:Date.now}
})


app.post('/upload', upload.single('file'), (req, res) => {
  res.redirect('/gallery');
});
 
 
  
  //title:"hero"
  //})

var info = mongoose.model("info", anounce);

//info.create({
//inf: "hello"
//})


app.get('/gallery', (req, res) => {
    gfs.files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        res.render('gallery', { files: false });
      } else {
        files.map(file => {
          if (
            file.contentType === 'image/jpeg' ||
            file.contentType === 'image/png'
          ) {
            file.isImage = true;
          } else {
            file.isImage = false;
          }
        });
        res.render('gallery', { files: files });
      }
    });
  });
    
        

        

app.get("/info",function(req,res){
    res.render("detail");
})




app.post("/",function(req,res){
    info.create(req.body.infos,function(err,newindex){
        if(err){
            consolde.log("failed");
        }
        else{
            res.redirect("/");
        }
    })
    
})


app.get("/",function(req,res){
    info.find({},{},{sort:{'Created':-1}},function(err,infos){
        if(err){
            consolde.log("failed");
        }else{
            res.render("index",{infos: infos});
        }
    })
})

app.get("/register",function(req,res){
    res.render("register");
})

app.post("/register",function(req,res){
    var newuser = new User({username: req.body.username});
    User.register(newuser,req.body.password,function(err,user){
        if(err){
            res.render("register");
        }
        else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/");
            })
        }

    });

})

app.get("/auth",function(req,res){
    if(req.isAuthenticated()){
    
        res.render("user");
    }
else{
    console.log("login")
}
});
app.get("/login",function(req,res){
    res.render("login");
})
app.post("/login", passport.authenticate("local",{
    successRedirect:"/auth",
    failureRedirect: "/"
}),function(req,res){

   
})

app.get('/files/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
      // If File exists this will get executed
      const readstream = gfs.createReadStream(file.filename);
      return readstream.pipe(res);
    });
  });
  
  
  
  
  app.get('/image/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if the input is a valid image or not
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
  
      // If the file exists then check whether it is an image
      if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        // Read output to browser
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.status(404).json({
          err: 'Not an image'
        });
      }
    });
  });
  
  // delete function to remove the file from the database
  app.delete('/files/:id', (req, res) => {
    gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
      if (err) {
        return res.status(404).json({ err: err });
      }
  
      res.redirect('/');
    });
  });
  
  
app.get("/logout",function(req,res){
    req.logOut()
    res.redirect("/infos")
})

app.set( 'port', ( process.env.PORT || 3000 ));

app.get("/members", function(req,res){

res.render("facu");

}

)

app.get("/student",function(req,res){
  res.render("student")
})
var detail = new mongoose.Schema({
  Student : String,
  Guardian: String,
  number: String,
  City: String,
  Address: String,
  dob: String,
  Gender: String,
  Created: {type:Date, default:Date.now}
})

var registration = mongoose.model("registration", detail);
app.post("/student",function(req,res){
  var Student = req.body.Student;
  var Guardian = req.body.Guardian;
  var Address = req.body.Address;
  var number = req.body.number;
  var Gender = req.body.Gender;
  var dob = req.body.dob;
  var City = req.body.City;
  var newstudent = {Student :Student, Guardian: Guardian, Address: Address,number:number, Gender:Gender,dob:dob,City:City}
 registration.create(newstudent, function(err,newCreate){
     if (err){
         console.log(err);
     }
     else{
      res.redirect("/");
     }
 });
})

app.get("/auth/list",function(req,res){


  registration.find({},{},{sort:{'Created':-1}},function(err,registrations){
    if(err){
        consolde.log("failed");
    }else{
        res.render("list",{registrations: registrations});
    }
})
})
app.get("/auth/anouncedelete",function(req,res){
  if(req.user){
  res.render("announ");
}})
app.get("/about",function(req,res){
  res.render("about")
})

//server
app.post("/download",function(req,res){
  const fs = require('fs');
  const MongoClient = require('mongodb').MongoClient;
  const url = "mongodb+srv://rg:rg@cluster0.dqjv7.mongodb.net/mainpage?retryWrites=true&w=majority";
  const excel = require('exceljs');
   
  // Create a connection to the MongoDB database
  MongoClient.connect("mongodb+srv://rg:rg@cluster0.dqjv7.mongodb.net/mainpage?retryWrites=true&w=majority", { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    
    let dbo = db.db("mainpage");
    
    dbo.collection("registrations").find({}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
    /**
      [ { _id: 1, name: 'Jack Smith', address: 'Massachusetts', age: 23 },
        { _id: 2, name: 'Adam Johnson', address: 'New York', age: 27 },
        { _id: 3, name: 'Katherin Carter', address: 'Washington DC', age: 26 },
        { _id: 4, name: 'Jack London', address: 'Nevada', age: 33 },
        { _id: 5, name: 'Jason Bourne', address: 'California', age: 36 } ]  
    */
    
    let workbook = new excel.Workbook(); //creating workbook
    let worksheet = workbook.addWorksheet('Students'); //creating worksheet
    
    //  WorkSheet Header
    worksheet.columns = [
      { header: 'Id', key: '_id', width: 10 },
      { header: 'Name', key: 'Student', width: 30 },
      { header: 'Address', key: 'Address', width: 30},
      { header: 'Gender', key: 'Gender', width: 10, outlineLevel: 1}
    ];
    
    // Add Array Rows
    worksheet.addRows(result);
    
    // Write to File
    workbook.xlsx.writeFile("C:/Users/Personal/Documents/student.xlsx")
      .then(function() {
  
      });
    
      db.close();
      res.redirect("/")
    
    });
  });
})

// Start node server
app.listen( app.get( 'port' ), function() {
  console.log( 'Node server is running on port ' + app.get( 'port' ))
  
  });
    