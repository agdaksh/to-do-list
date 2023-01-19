const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
//const date = require(__dirname + "/date.js")
app.use(express.static("css"));
app.use(bodyParser.urlencoded({extended:true}));

//var inputs =[];
//var workInput = [];

app.set('view engine', 'ejs');

    main().catch(err => console.log(err));
async function main() {
   await mongoose.connect("mongodb://0.0.0.0:27017/todolistDB");
    //Item.deleteMany([{name:"item2"},{name:"item3"}],function(err){});
}
const itemSchema = {
   name:String
};
const Item = mongoose.model('item',itemSchema);
const item1 = new Item({name:"item1"});
const item2 = new Item({name:"item2"});
const item3 = new Item({name:"item3"});
const defaultItems = [item1,item2,item3];
const listSchema = {
    name:String,
    item : [itemSchema]
}
const List = mongoose.model("list",listSchema);


 
app.get("/",function(req,res){
    //const day = date.getDate();
   
     Item.find({},function(err,foundItems){

     if(foundItems.length === 0){
        Item.insertMany(defaultItems,function(err,docs){});
        res.redirect("/");
     }else{
        res.render("list", {listTitle : "today" , newItems : foundItems});
     }
     });
});
app.get("/:customListName",function(req,res)
{
        const params = _.capitalize(req.params.customListName);
        List.findOne({name : params},function(err,foundList){
            if(!err){
                if(!foundList){
                   //create new list
                    const list = new List({
                        name: params,
                        item: defaultItems
                    })
                List.create(list);
                res.redirect("/"+params);
                }else{
                    //show existing list
                    res.render("list",{listTitle:foundList.name, newItems : foundList.item});
                }
            }
        });
        
});

app.post("/delete",function(req,res){
    const checkedItemID = req.body.checkbox;
    const listName =req.body.listName;

    if(listName === "today")
    {
        
        Item.findByIdAndRemove(checkedItemID,function(err){
             res.redirect("/");
        });
   
    }else
    {
        List.findOneAndUpdate({name:listName},{$pull:{item:{_id:checkedItemID}}},function(err,foundList){
            res.redirect("/"+listName);
        });
        
    }
   
});

app.post("/",function(req,res){
   const itemName = req.body.item; 
   const listName = req.body.list;
   
   const newItem = new Item({name:itemName});
   if(listName === "today"){
    Item.create(newItem);
    res.redirect("/");
   }else{
    List.findOne({name:listName},function(err,foundList){
        foundList.item.push(newItem);
        List.create(foundList);
        res.redirect("/"+listName);
    });
   }
  
   
});

app.listen(3000,function(){
    console.log("hello");
})