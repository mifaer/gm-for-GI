var gm = require('gm');
var dir = __dirname + '/imgBig';
var fs = require('fs');
var ce = require('colour-extractor');
var request = require('request');

// var imgURL = 'http://drop.ndtv.com/TECH/product_database/images/622201751000PM_635_karbonn_aura_note_2.jpeg';
// var imgURL = 'https://i.gadgets360cdn.com/large/miui9_main_1500964803951.jpg?output-quality=80';
var imgURL = 'https://i.gadgets360cdn.com/large/moleskine_smart_william_penn_1500960959569.jpg?output-quality=80';
// var imgURL = 'https://i.gadgets360cdn.com/large/uber_infotainment_system_lead_245617_165646_8699_1500895660127.jpg?output-quality=80';
// var imgURL = 'https://i.gadgets360cdn.com/large/jiophone_main_1500632417692.jpg?output-quality=80';
// var imgURL = 'http://drop.ndtv.com/TECH/product_database/images/742017125141PM_635_karbonn_k9_kavach_4g_gadgets360.jpeg';
// var imgURL = 'https://i.gadgets360cdn.com/large/bingo_f1_f2_1500875226739.jpg?output-quality=80';


var params = {
    title: 'ipgine4',
    url: imgURL,
    blureBG:  true
}

function genNameImg(title, prefix) {
    return `${dir}/${title}_${prefix}.jpg`
}

function download(params, dest) {
    url = params.url;
    title = params.title;
	return new Promise(function(resolve){
        // var name = dir + '/simple.jpg';
        var name = genNameImg(title, 'simple');
        var file = fs.createWriteStream(name);
        request(url).pipe(file);
        file
        .on('finish', function(){
            file.close(() => resolve(name));
        })
        .on('error', function(err) {
            fs.unlink(name);
            reject(err);
        });
	});
}

function createFrontImg() {
    return new Promise((resolve, reject) => {
    var name = genNameImg(title, 'resize');
    var simpleImg = genNameImg(title, 'simple');
        gm(simpleImg)
        .resize(294, 194)
        .write(name, function(err){
            if (err)  reject(err);
            resolve(name);
        })
    });
}

function createBackImg() {
    return new Promise((resolve, reject) => {
    var name = genNameImg(title, 'resize_font');
    var simpleImg = genNameImg(title, 'simple');
        gm(simpleImg)
        .resize(300, 200, "!")
        .blur(30, 20)
        .write(name, function(err){
            if (err)  reject(err);
            resolve(name);
        })
    });
}

function genImgWithBlurBG() {
    return new Promise(function(resolve, reject){
        Promise.all([createFrontImg(), createBackImg()]).then((data) => {
            // console.log('data', data);
            var name = genNameImg(title, 'resize_texture');
            // Наложение уменьшенной картинки на фон
            gm(data[1])
            .gravity('Center')
            .composite(data[0])
            .write(name, function(err){
                if (err) reject(err)
                resolve(name)
            });
        })
    });
}

function genImgWithWhiteBG() {
    return new Promise(function(resolve, reject) {
        createFrontImg().then((data) => {
            var name = genNameImg(title, 'resize_white');
            gm(data)
            .gravity('Center')
            .background('white')
            .extent(300, 200)
            .write(name, function(err){
                if (err) reject(err)
                resolve(name)
            });
        })
    });
}

function identifyBG() {
    return new Promise(function(resolve, reject){
        var simpleImg = genNameImg(title, 'simple');
        gm(simpleImg)
        .identify(function(err, val){
            resolve(val['Background Color']);
        });
        })
}

(async () => {
    try {
        await download(params);
        let colorBG = await identifyBG();
        console.log(colorBG);
        let name;
        if (colorBG == 'white')
            name = await genImgWithWhiteBG();
        else
            name = await genImgWithBlurBG();
    }  catch (err) {
        console.log(9,err);
    }

})()