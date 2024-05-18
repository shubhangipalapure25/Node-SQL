const express = require("express");
const app = express();
// const { faker } = require('@faker-js/faker');
const mysql = require("mysql2");
const path = require("path");
const methodoverride = require("method-override");
const {v4: uuidv4} = require("uuid");

app.set("view engine" ,"ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(methodoverride("_method"));
app.use(express.urlencoded({extended:true}));


const con = mysql.createConnection({
    host:"localhost",
    user:"root",
    database:"delta_app",
    password:"Vedha@123"
});
// home route
app.get("/",(req,res)=>{
  let q = `select count(*) from user`;
  try{
    con.query(q,(err,result)=>{
      if(err) throw err;
      let userCount=(result[0]["count(*)"]);
      res.render("home.ejs",{userCount});
    });
  }catch(error){
    console.log(error);
    res.send("some error is came in DB");
  }  
});

//Show route
app.get("/user",(req,res) =>{
  try{
    let q =`SELECT * FROM user`;
    con.query(q,(err,result) =>{
      if(err) throw err;
      // console.log(result);
      const users= result;
      res.render("showusers.ejs",{users});
    })
   
  }catch(error){
    console.log(error);
  }
});

//edit route
app.get("/user/:id/edit",(req,res) =>{
  const{id} = req.params;
  // console.log(id);
  try{
   let q=`select * from user where id='${id}'`;
    con.query(q,(err,result) =>{
      if(err) throw err;
      // console.log(result);
      const user = result[0];
      res.render("edit.ejs",{user});
    });
  }catch(error){
    console.log(error);
    res.send("some error in DB");
  }
});

//update route
app.patch("/user/:id", (req,res) =>{
  const {id}= req.params;
  console.log(id);
  const {username:newusername,password:formpwd} = req.body;
  console.log(newusername);
  console.log(formpwd);
  try{
   let q=`select * from user where id='${id}'`
    con.query(q,(err,result) =>{
      if(err) throw err;
      // console.log(result);
      let user = result[0];
      // console.log(user);
      if(formpwd != user.password){
        res.send("Password incorrect...");
      }
      else{
        let q= `UPDATE user SET username='${newusername}' where id='${id}'`;
        con.query(q,(err,result) =>{
          if(err) throw err;
          res.redirect("/user");
        });
      }
    });
      }
  catch(error){
    console.log(error);
    res.send("some error in DB");
  }

});
//create route
app.get("/user/add", (req,res) =>{
  res.render("adduser.ejs");
})
//Add route
app.post("/user", (req,res) =>{
  const {username, email,password} =req.body;
  try{
  let q = `insert into user(id,username,email,password) values(?,?,?,?)`;
  let id= uuidv4();
  console.log(id);
  const user =[id,username,email,password];
  con.query(q,user,(err,result) =>{
    if(err) throw err;
    res.redirect("/user");
  });

  }
  catch(error){
    console.log(error);
    res.send("some error in DB");
  }
  });

  //delete route
  app.delete("/user/:id/delete",(req,res) =>{
    let{id} = req.params;
    try{
      let q=`delete from user where id='${id}'`;
      con.query(q,(err,result) =>{
        if(err) throw err;
        console.log(result);
        res.redirect("/user");
      });
      }catch(error){
      console.log(error);
      res.send("Some error in DB");
    }
  });

app.listen("8080",()=>{
  console.log("listening on port...");
});

// con.end();
// function getRandomUser() {
//   return [
//     faker.string.uuid(),
//     faker.internet.userName(),
//     faker.internet.email(),
//     faker.internet.password(),
//       ];
// }

//  let q= "insert into user (id,username,email,password)values ?";
// // let user=[[3,'rashi','rashi@gmail.com','rashi@123'],[4,'vedika','vedika@gmail.com','vedu@123']];
// try{
//   con.query(q,[data],(err,result)=>{
//     if(err) throw err;
//     console.log(result);
//   });
// }
// catch(err){
//   console.log(err);
// }

// try{
//     con.query("select * from user",(err,result) =>{
//         if(err) throw err;
//     console.log(result);
//     })
// }catch(error){
//     console.log(error);
// }

  


