app.locals.server = () =>{
    const fs = require('fs');
  const MongoClient = require('mongodb').MongoClient;
  const url = "mongodb+srv://ramesh:ramesh@cluster0.uz0za.mongodb.net/mainpage?retryWrites=true&w=majority";
  const excel = require('exceljs');
   
  // Create a connection to the MongoDB database
  MongoClient.connect("mongodb+srv://ramesh:ramesh@cluster0.uz0za.mongodb.net/mainpage?retryWrites=true&w=majority", { useNewUrlParser: true }, function(err, db) {
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
    
    });
  });
    
  }