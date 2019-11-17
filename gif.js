var asynk = require('async');
var Color = require('ascii-art-ansi/color');
var Image = require('ascii-art-image');

//Color.is256 = true; //also supports .isTrueColor if your terminal does
//Color.useDistance('closestByIntensity');
Color.useDistance('rankedChannel');

var GIFDecoder = require('gif-stream/decoder');
var decodeGIFs = function(){ return new GIFDecoder();}
var concat = require('concat-frames');
var fs = require('fs');

function AnsiGif(options){
    //todo: support URLs
    var options = typeof options === 'string'?{file:options}:(options || {});
    if(options['4bit'] || options.is16Color){
        Color.is256 = false;
        Color.isTrueColor = false;
    }
    if(options['8bit'] || options.is256Color){
        Color.is256 = true;
        Color.isTrueColor = false;
    }
    if(options['32bit'] || options.isTrueColor){
        Color.is256 = false;
        Color.isTrueColor = true;
    }
    if(options.colorMatching){
        Color.useDistance(options.colorMatching);
    }
    this.options = options;
    this.stream = fs.createReadStream(options.file);
}

AnsiGif.prototype.load = function(progress, complete){
    var ob = this;
    this.stream.pipe(decodeGIFs()).pipe(concat(function(frames){
        ob.frames = frames;
        var renderedFrames = [];
        progress(1,2);
        var count = 0;
        asynk.eachOfLimit(this.frames, 2, function(frame, index, done){
            var image = new Image({
                width : ob.options.width || 80,
                imagePixelFrame : frame,
                alphabet : ob.options.alphabet || 'variant4'
            });
            image.write(function(err, image){
                if(err) return console.log(err);
                renderedFrames[index] = image;
                count++;
                setTimeout(function(){
                    progress(count, ob.frames.length);
                }, 0);
                setTimeout(function(){
                    done();
                }, 0);
            });
        }, function(){
            ob.rendered = renderedFrames;
            if(complete) complete();
        });
    }));
}

AnsiGif.prototype.play = function(){
    //todo: check load
    var numLines = this.rendered[0]?this.rendered[0].split("\n").length:0;
    var frameNum = 0;
    var first = true;
    var ob = this
    //todo: play based on gif config
    setInterval(function(){
        ob.rendered[frameNum]?ob.rendered[frameNum].split("\n").length:0;
        if(first) first = false;
        else console.log('\033['+(numLines+1)+'Am');
        console.log(ob.rendered[frameNum]+'\033[0m');
        frameNum = (frameNum + 1) % ob.frames.length;
    }, 100);
}

module.exports = AnsiGif;
