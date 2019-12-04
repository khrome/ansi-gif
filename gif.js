var asynk = require('async');
var Color = require('ascii-art-ansi/color');
var Image = require('ascii-art-image');
var request = require('request');

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
    if(options.file.indexOf('http') === 0){
        this.stream = request.get(options.file)
    }else{
        this.stream = fs.createReadStream(options.file);
    }
}

AnsiGif.prototype.load = function(progress, complete){
    var ob = this;
    this.stream.pipe(decodeGIFs()).pipe(concat(function(frames){
        ob.frames = frames;
        var renderedFrames = [];
        progress(1,2);
        var count = 0;
        var last;
        var height;
        var width;
        asynk.eachOfLimit(this.frames, 1, function(frame, index, done){
            if(!height) height = frame.height;
            if(!width) width = frame.width;
            var last
            var image = new Image({
                width : ob.options.width || 80,
                alphabet : ob.options.alphabet || 'variant4',
                loader : function(image, setAspectRatio, Canvas, Image){
                    setAspectRatio(height/width);
                    if(frame.x || frame.y){
                        var canvas = new Canvas(height, width);
                        var context = canvas.getContext('2d');
                        if(last){
                            context.putImageData(
                                last, 0, 0
                            );
                        }
                        var imageData = context.getImageData(
                            (frame.x || 0),
                            (frame.y || 0),
                            (frame.width || undefined),
                            (frame.height || undefined)
                        );
                        var data = imageData.data;
                        var len = frame.width * frame.height;
                        var offset;
                        var pixset;
                        for (var i=0; i < len;i += 4) {
                            offset = i * 4;
                            pixset = i * 3;
                            data[offset] = frame.pixels.readUInt8(pixset);
                            data[offset+1] = frame.pixels.readUInt8(pixset+1);
                            data[offset+2] = frame.pixels.readUInt8(pixset+2);
                            data[offset+3] = 255;
                        }
                        context.putImageData(
                            imageData,
                            (frame.x || 0),
                            (frame.y || 0)
                        );
                        last = imageData;
                        return {context, canvas};
                    }else{
                        var canvas = new Canvas(frame.width, frame.height);
                        var context = canvas.getContext('2d');
                        var dataContext = context.getImageData(0,0,frame.width, frame.height);
                        var imageData = dataContext.data;
                        var len = frame.width * frame.height;
                        var offset;
                        var pixset;
                        for (var i=0; i < len;i += 4) {
                            offset = i * 4;
                            pixset = i * 3;
                            imageData[offset] = frame.pixels.readUInt8(pixset);
                            imageData[offset+1] = frame.pixels.readUInt8(pixset+1);
                            imageData[offset+2] = frame.pixels.readUInt8(pixset+2);
                            imageData[offset+3] = 255;
                        }
                        last = dataContext;
                        context.putImageData(dataContext, 0, 0);
                        return {context, canvas};
                    }
                }
            });
            image.write(function(err, image, context2d){
                last = context2d;
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
