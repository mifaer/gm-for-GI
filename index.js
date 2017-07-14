var gm = require('gm');
var dir = __dirname + '/imgBig';
var fs = require('fs');
var request = require('request');

var imgURL = 'http://drop.ndtv.com/TECH/product_database/images/622201751000PM_635_karbonn_aura_note_2.jpeg';

var download = function(url, filename){
    request.head(url, function(){
        request(url).pipe(fs.createWriteStream(dir + '/' + filename));
    });
};

var downloadImg = new Promise((resolve, reject) => {
    download(imgURL, 'simple.jpg');
    resolve();
});

var createFrontImg = new Promise((resolve, reject) => {
    var name = dir + '/resize.jpg';
        gm(dir + '/simple.jpg')
        .resize(294, 194)
        .write(name, function(err){
            if (err)  console.dir(arguments);
            resolve(this.outname);
        });
    });

var createBackImg = new Promise((resolve, reject) => {
    var name = dir + '/resize_font.jpg';
        gm(dir + '/simple.jpg')
        .resize(300, 200, "!")
        .blur(30, 20)
        .autoOrient()
        .write(name, function(err){
            if (err)  console.dir(arguments);
            resolve(this.outname);
        });
    });

Promise.all([downloadImg, createFrontImg, createBackImg]).then((data) => {
    console.log('data', data);
    // Наложение уменьшенной картинки на фон
        gm(data[2])
        .gravity('Center')
        .composite(data[1])
        .write(dir + '/resize_texture.jpg', function(err){
            if (err) return console.dir(arguments)
        });
    })