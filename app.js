const express = require ('express');
const app = express();
const axios = require ('axios');
const path = require ('path');



const port = 8080;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
app.use(express.urlencoded({ extended: true }));

app.set('"views"', path.join(__dirname, "views"));
app.set("view engine", "ejs");


let nextpage = undefined;
let params = undefined;


app.get("/", async (req, res)=>{

  await axios.get(`https://newsdata.io/api/1/latest?apikey=pub_6057630df3729ef36b9943514e623a9674f5c&size=9&country=in&language=en`)
    .then(response =>{
      let data = response.data.results;
      for(object of data){
        if(object.image_url==null){
          object.image_url="https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1/"
        }
      }
      nextpage = response.data.nextPage;
   res.render("home", {data});
  }).catch (err => {
    console.log(err);
  })

} )

app.post("/search", async (req, res)=>{
    params = {
    qInMeta: req.body.qInTitle || undefined,
    country: req.body.country || undefined,
    category: req.body.category || undefined,
    language: req.body.language || undefined,

  }
  await axios.get("https://newsdata.io/api/1/latest?apikey=pub_6057630df3729ef36b9943514e623a9674f5c&size=9" , {params})
  .then(response =>{
    let data = response.data.results;
    for(object of data){
      if(object.image_url==null){
        object.image_url="https://images.pexels.com/photos/18287623/pexels-photo-18287623/free-photo-of-close-up-of-newspapers-on-wooden-table.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      }
    }
    nextpage = response.data.nextPage;
 res.render("search", {data , params});
}).catch (err => {
  console.log(err);
})
})

app.get("/next", async(req, res) => {

  await axios.get(`https://newsdata.io/api/1/latest?apikey=pub_6057630df3729ef36b9943514e623a9674f5c&size=9&country=in&language=en&page=${nextpage}`)
  .then(response =>{
    let data = response.data.results;
    for(object of data){
      if(object.image_url==null){
        object.image_url="https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1/"
      }
    }
    nextpage = response.data.nextPage;
 res.render("home", {data});
}).catch (err => {
  console.log(err);
})
  
})

app.get("/search/next", async(req, res)=>{
  await axios.get(`https://newsdata.io/api/1/latest?apikey=pub_6057630df3729ef36b9943514e623a9674f5c&size=9&page=${nextpage}`, {params})
  .then(response =>{
    let data = response.data.results;
    for(object of data){
      if(object.image_url==null){
        object.image_url="https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1/"
      }
    }
    nextpage = response.data.nextPage;
 res.render("search", {data , params});
}).catch (err => {
  console.log(err);
})

})



app.listen(port, ()=>{
  console.log("server is live");
})


