
let request = require('request-promise');
let cheerio = require('cheerio');
let express = require('express');
let app = express();

app.use(express.static('public'));

let post = {
  title: "der titel",
  imgurl: "blob:https://gomix.com/aeaa3db8-3765-4976-8452-d0c25658a362"
}

app.get("/", function (req, resp) {
  resp.sendFile(__dirname + '/views/index.html')
})

app.get("/post", function (req, resp) {
  resp.send(post)
})

app.get("/post-now", function (req, resp) {
  request('http://devhumor.com/random', (error, response, body) => {
    if (!error && response.statusCode == 200) {
      $ = cheerio.load(body)
      let title = "-"
      let imgurl = ""
      $(".item-title a").each((_, elem) => {
        title = elem.attribs.alt
        console.log("title:", post.title) 
      })
      $(".single-media").each((_, elem) => {
        imgurl = elem.attribs.src
        console.log("img:", post.imgurl) 
      })
      resp.send({ title: title, imgurl: imgurl })
    }
  })
})

function loadPost() {
  request({ 
    uri: "http://devhumor.com/random", 
    transform: (body) => cheerio.load(body) 
  }).then($ => {
    $(".item-title a").each((_, elem) => {
      post.title = elem.attribs.alt
      console.log("title:", post.title) 
    })
    $(".single-media").each((_, elem) => {
      post.imgurl = elem.attribs.src
      console.log("img:", post.imgurl) 
    })
  })
  .catch(err => console.error("could not get infos from devhumor.com", err))
} 

loadPost()

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
 