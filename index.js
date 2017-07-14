var gm = require('gm');
var dir = __dirname + '/imgBig';
var fs = require('fs');

// fs.readdir(dir, function(err, items)) {
//     items.forEach(function(item) {
//         gm(item)
//             .resize(294, 194)
//             .write(dir + '/' + item + '_resize.jpg', function(err){
//             if (err) return console.dir(arguments)
//                 console.log(this.outname + " created  ::  " + arguments[3])
//             });
//     }, this);
// });

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

Promise.all([createFrontImg, createBackImg]).then((data) => {
    console.log('data', data);
    // Наложение уменьшенной картинки на фон
        gm(data[1])
        .gravity('Center')
        .composite(data[0])
        .write(dir + '/resize_texture.jpg', function(err){
            if (err) return console.dir(arguments)
        });
    })