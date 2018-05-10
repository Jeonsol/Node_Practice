var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(urlencodedParser);
app.locals.pretty = true;
app.set('views', './views');
app.set('view engine', 'jade');
app.get('/topic/new', function(req, res) {
  res.render('new');
});
app.get(['/topic','/topic/:id'], function(req, res) {
  fs.readdir('data', function(err, files) {
    if(err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }

    var id = req.params.id;

    if(id) {
      fs.readFile('data/'+id, 'utf-8', function(err, data) {
        if(err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
        }
        res.render('view', {topics: files, title: id, description: data})
      })
    }

    else {
      res.render('view', {topics: files, title: 'Welcome', description: 'Hello!'})
    }
  })
})
app.post('/topic', function(req, res) {
  var title = req.body.title;
  var description = req.body.description;

  fs.writeFile('data/'+title, description, function(err) {
    if(err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.redirect('/topic/'+title);
  })
});
app.listen(8888, function() {
  console.log('Connected, 8888 port!');
});
