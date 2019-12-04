ansi-gif
========

[![NPM version](https://img.shields.io/npm/v/ansi-gif.svg)]()
[![npm](https://img.shields.io/npm/dt/ansi-gif.svg)]()

View gifs in your terminal. 100% JS, no ffmpeg.

![nyan-cat](Samples/nyan.gif)

Supports full frame and subframe rendering™

Given that this is a new library and there are many configurations of GIFs out there, we may not catch every edge case. Please save any example files you have with issues (and file them)!

As simple as: `ansi-gif <file or url>`

Installation
------------

`npm install -g ansi-gif`

Usage
-----

```bash
Usage: ansi-gif [options] <target>

Options:
  --version         Show version number                                [boolean]
  -a, --alphabet    The character set to use when rendering this gif
              [choices: "solid", "variant1", "variant2", "variant3", "variant4",
      "ultra-wide", "wide", "hatching", "bits", "binary", "greyscale", "blocks"]
  -b, --bit-depth   the number of colors to use              [choices: 4, 8, 32]
  -w, --width       the width of the output
  -d, --difference  the color difference algorithm to use in 8bit mode
    [choices: "euclideanDistance", "classic", "ratioDistance", "classicByValue",
             "CIE76Difference", "closestByIntensity", "rankedChannel", "simple",
                                                                     "original"]
  -h, --help        Show help                                          [boolean]

Examples:
  ansi-gif /path/to/my.gif                  render the gif
  ansi-gif  ~/Desktop/nyan.gif -b 4         4bit nyan cat on the desktop
  ansi-gif  ~/Desktop/nyan.gif -a           8bit nyan cat on the desktop
  ultra-wide -w 100 -b 8 -d rankedChannel
  ansi-gif  ~/Desktop/nyan.gif -b 32        32bit nyan cat on the desktop

©2019 - Abbey Hawk Sparrow
```

Examples
--------
try a few of the built in samples like:

`npm run mj-popcorn`

![thriller-popcorn](Samples/thriller-popcorn.gif)

`npm run mr-sparkle`

`npm run maxell`

`npm run nyan-cat`

![nyan-cat](Samples/nyan.gif)

`npm run beetlejuice-caseworker`

`npm run afro-ninja`

`npm run peanuts`

`npm run moon`

![moon](https://github.com/khrome/ansi-gif/raw/master/Samples/moon.gif)

`npm run geometry`

Enjoy,

- Abbey Hawk Sparrow
