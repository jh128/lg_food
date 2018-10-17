var express = require('express');
var router = express.Router();
var http = require('http')

var proxy = require('http-proxy-middleware');

/* GET home page. */
router.get('/', function(reqeuest, response, next) {

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/douban/v2/movie/top250',
    method: 'GET'
  }

  const req = http.request(options, (res) => {
    let chunkData = ''
    res.on('data', (chunk) => {
      chunkData += chunk
    })
    res.on('end', () => {
      response.render('index', { data: JSON.parse(chunkData).subjects });
      // console.log(chunkData)
    })
  })

  req.end()

});
// router.get('/v2', proxy({target: 'https://api.douban.com', changeOrigin: true}))

module.exports = router;
