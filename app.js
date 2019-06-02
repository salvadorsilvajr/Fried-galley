var express = require("express"),
    app = express(), 
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    serveStatic = require('serve-static'),
    nodemailer = require('nodemailer')
    
app.use(express.static('public')) 
mongoose.connect("mongodb://salvador:gaby8321@ds143588.mlab.com:43588/pictures", {useNewUrlParser: true});
// mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true});
app.use (bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// SCHEMA SETUP

var pictureSchema = new mongoose.Schema({
    name: String(),
    image: String(),
    description: String()
});

var Picture = mongoose.model("Picture", pictureSchema);

// INDEX ROUTE show all campgrounds !!
app.get("/index", function(req, res){
    // get all campgrouds from DB:

});

app.get("/", function(req, res){
        Picture.find({}, function(err, allPictures){
            if(err){
                console.log(err);
            } else {
                res.render("index", {pictures:allPictures});  
            }
        });
 });


// CREATE -- add new pictures to DB:
app.post("/", function(req, res){
  // get data from a form and add to pictures array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newpicture = {name: name, image: image, description: desc};
  // create a new picture and save to a DB:
  Picture.create(newpicture, function(err, newlycreated){
      if(err){
          console.log(err)
      } else {
          //redirect to pictures page
            res.redirect("/");   
      }
  })
});

app.get("/coment", function(req, res){
   res.render("coment.ejs");
});

app.post("/coment", function(req, res){
  var name = req.body.name;
  var phone = req.body.phone;
  var email = req.body.email;
  var coment = req.body.coment;
  var newcoment = {name: name, phone: phone, enail: email, coment: coment};
  console.log(newcoment);

    let transporter = nodemailer.createTransport({
        service:"gmail",
        secure: false,
        port: 25,
        auth: {
            user: "ssilvasweb@gmail.com",
            pass: "Fried@3306"
        },
        tls :{
            rejectUnauthorarized: false
        }
    })
    let HelperOptions = {
        from: '"salvadorform" <ssilvasweb@gmail.com> ',
        to: "ssilvasweb@gmail.com",
        subject: "test from my form",
        text: " A new Coment from app",
        html: "<p><h1> nombre " + name + "</h1></P><p><h2>cellphone "  + phone +"</h2> </p> <p><h3> Comentario" + coment+ "</h3></P>"
    
    };
    transporter.sendMail(HelperOptions, (error, info) =>{
        if(error){
            return console.log(error);
        }
        console.log("the message has sended it"),
        console.log(info);
        res.render("coment.ejs");
    });
});    
    

// NEW -- show form to create a new campground 
app.get("/new", function(req, res){
   res.render("new.ejs");
});

// SHOW -- show more info about one campground
app.get("/:id", function(req, res) {
    //find the picture with the provided ID
    Picture.findById(req.params.id, function(err, foundpicture){
        if(err){
            console.log("err");
        } else{
            // render show template with that campground
            res.render("show", {picture: foundpicture});
        }
    })
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The PortFolio server has started !!!"); 
});