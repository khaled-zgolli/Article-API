const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');


const app=express();

app.set('View engine','ejs');

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema={
    title : String,
    content : String
};

const Article = mongoose.model('Article',articleSchema);

//  all  articles
app.route('/articles')
.post(function(req,res){

    const article=new Article({
        title:req.body.title ,
        content:req.body.content
    });

    article.save(function(err){
        if(!err){
            res.send('Success');
        }
        else{
            res.rend(err)
        }
    });
})
.get(function(req,res){
    Article.find(function(err,foundArtciles){
        if(!err){
            console.log(foundArtciles);
        }
        else{
            console.log(err);
        }
    }); 
})
.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!    err){
            res.send('delete success');
        }
        else{
            res.send(err);
        }
    });
});

// specific article

app.route('/articles/:articleTitle')
.get(function(req,res){
    console.log(req.params.articleTitle);
    Article.findOne({title :req.params.articleTitle},function(err,foundArticle){
            if(!err){
                res.send(foundArticle);
            }
            else{
                res.send('no article matching that title was found ');
            }
    })
})
.put(function(req,res){
    Article.update(
        {title :req.params.articleTitle},
        {title :req.body.title , content:req.body.content},
        {overwrite: true},
        function(err){
            if(!err){
                res.send('article updated');
            }
            else{
                res.send('error');
            }
        }


    );
})
.patch(function(req,res){
    Article.update(
        {title:req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send('updated');
            }
            else{
                res.send('error');
            }
        }
    )
})
.delete(function(req,res){
    Article.deleteOne(
        {title : req.params.articleTitle},
        function(err){
            if(!err){
                res.send('article deleted');
            }
            else{
                res.send(err);  
            }
        }
    )
});






app.listen('3000',function(){
    console.log('server started on port 3000');
});
