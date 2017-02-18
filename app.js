let randomstring = require("randomstring")
    , request = require('request')
    , async = require('async')
    , express = require('express')
    , bodyParser = require('body-parser')
    , cheerio = require('cheerio')
    , he = require('he');
// var sub= require('./sub');

var app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true}));
app.set('port', (process.env.PORT || 5000));

//For avoidong Heroku $PORT error
app.get('/', function (request, response) {
    let result = 'JavScreenShot is Online'
    response.send(result);
})

app.post('/jav', function (req, res) {

    let pre = req.body.prefix;
    let suf = req.body.suffix;
    let javfree = req.body.javfree


    if (javfree) {
        JavFree.fuck(pre, suf).then((cum) => {

                res.send(cum)

            },
            () => {
                res.status(500).send({error: 'Something failed!'});
            }
        ).catch(reason => {
            res.send(reason);
        })
    }


}).listen(app.get('port'), function () {
    console.log('App is running, server is listening on port ', app.get('port'));
});


var JavFree = {
    name: "JavFree",
    avCode: null,
    getSearchPageUrl: (pre, suf) => {
        this.avCode = pre + suf;

        return "http://javfree.me/?s=" + pre + suf;
    },
    getHtml: (path) => {
        console.log("[JavFree] Entry")
        return new Promise((resolve, reject) => {

            request(path, function (error, response, body) {
                if (!error) {
                    return resolve(body);
                } else return reject(error)
            })
        })
    },
    search: (html) => {
        let $ = cheerio.load(html)
        let list = []
        $('div[id="wrapper"]').find('div > div > div > div > ul > li > div > a').each(function (index, element) {
            list.push(
                {
                    link: $(element).attr('href'),
                    img: $(element).find('img').attr("src"),
                    title: $(element).find('img').attr("title"),

                });
        });
        console.log("List", list)
        let resultArray = list;
        if (resultArray.length === 0) return Promise.reject({msg: "NotFound"});
        let aTag = resultArray[0].link
        let imgTag = resultArray[0].img
        let title = resultArray[0].title
        return Promise.resolve({
            url: aTag,
            title: title,
            cover: imgTag
        });
    },
    findPhoto: (html) => {
        console.log('[Find Photo] Entry')
        let $ = cheerio.load(html)
        let imgArray = []
        $('div[id="wrapper"]').find('div > div > div > div > div > div > p > img').each(function (index, element) {
            imgArray.push(
                $(element).attr("data-original")
            );
        });

        let coverArray = [],
            screenshotArray = [],
            largeScreenshotArray = [];
        if (imgArray.length === 0) return Promise.reject({msg: "NotFound"});

        for (let i = 0, state = 0; i < imgArray.length; i++) {
            let imgSrc = imgArray[i];
            console.log(i, imgSrc.endsWith(".jpeg"), imgSrc);
            if (imgSrc.endsWith(".jpg") && state == 0) {
                coverArray.push(imgSrc);
                state = 1;
            }
            else if (imgSrc.endsWith(".jpeg")) {
                screenshotArray.push(imgSrc);
            }
            else if (state == 1 && imgSrc.endsWith(".jpg")) largeScreenshotArray.push(imgSrc);
        }

        let contentHtml = $('div[id="wrapper"]').find('div > div > div > div > div > div > p ').html()
        console.log(contentHtml)

        function findBetween(kw1) {
            let kw2 = "<br>";
            let len1 = kw1.length;
            let index1 = contentHtml.indexOf(kw1);
            let index2 = contentHtml.indexOf(kw2, index1 + len1);
            if (index1 === -1) return;
            if (index2 === -1) return contentHtml.substring(index1 + len1);
            else return he.decode(contentHtml.substring(index1 + len1, index2));
        };

        let info = {
            releaseDate: findBetween("&#x767A;&#x58F2;&#x65E5;&#xFF1A;"),
            duration: findBetween("&#x53CE;&#x9332;&#x6642;&#x9593;&#xFF1A;"),
            actor: findBetween("&#x51FA;&#x6F14;&#x8005;&#xFF1A;"),
            supervisor: findBetween("&#x76E3;&#x7763;&#xFF1A;"),
            series: findBetween("&#x30B7;&#x30EA;&#x30FC;&#x30BA;&#xFF1A;"),
            maker: findBetween("&#x30E1;&#x30FC;&#x30AB;&#x30FC;&#xFF1A;"),
            label: findBetween("&#x30EC;&#x30FC;&#x30D9;&#x30EB;&#xFF1A;"),
            genre: findBetween("&#x30B8;&#x30E3;&#x30F3;&#x30EB;&#xFF1A;"),
            partNumber: $(findBetween("&#x54C1;&#x756A;&#xFF1A;")).text(),
        };

        console.log(coverArray, screenshotArray, largeScreenshotArray, info)

        return Promise.resolve({
            cover: coverArray,
            screenshot: screenshotArray,
            screenshotL: largeScreenshotArray,
            info: info
        });

    },

    fuck: (pre, suf) => {
        return new Promise((resolve, reject) => {
                JavFree.getHtml(JavFree.getSearchPageUrl(pre, suf)).then((html) => {
                        console.log("Get HTML Success")
                        JavFree.search(html).then(function (suc) {
                            console.log('Search Suc!', suc)
                            JavFree.getHtml(suc.url).then(function (html2) {
                                JavFree.findPhoto(html2).then(function (suc) {
                                    console.log("FindPhoto", suc)
                                    resolve({JavFree: suc})
                                })
                            })
                        })
                    }
                )
            }
        )
    }
};


