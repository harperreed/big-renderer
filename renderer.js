/**
 * Copyright 2017 Harper Rules, LLC. All rights reserved.
 *
 */

'use strict';

const puppeteer = require('puppeteer');
const fileUrl = require('file-url');
const optionDefinitions = [
  { name: 'height', type: Number, alias: 'h',  defaultValue: 1080 },
  { name: 'width', type: Number, alias: 'w',  defaultValue: 1920 },
  { name: 'presentationFile', type: String, alias: 'f' },
  { name: 'slideDir', type: String, defaultValue: "slides" },
]

const commandLineArgs = require('command-line-args')
const options = commandLineArgs(optionDefinitions)

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

const height = options['height']
const width = options['width'];
const slideDir = options['slideDir'];

var presentationFile = ""

if ('presentationFile' in options){
  presentationFile = fileUrl(options['presentationFile'])
}else{
  throw "presentationFile argument required"
}

console.log("Rendering presentation. This may take a minute.");

(async() => {
  
  var timer = "Rendering presentation"
  console.time(timer)
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.setViewport({width: width, height: height});
  await page.goto(presentationFile, {
                waitUntil: 'networkidle2',
                timeout: 0
            });
  console.timeEnd(timer)
  timer = "output slides"
  var slideCount = await page.evaluate(function() { return big.length; });
  var output = "slide"

  console.log('Loaded! Ready to render ' + slideCount + " slides");
  slideRenderDuration = .7
  renderDuration = slideCount * slideRenderDuration
  console.log(renderDuration)

  console.time(timer)
  for (var i = 0; i < slideCount; i++) { 

  	var output_filename = slideDir + "/" + output+pad((i+1),4) + '.png';

  	console.log('Rendering '+output_filename);
  	
    await page.screenshot({path: output_filename, fullPage: true});

  	await page.evaluate(() => {
  		document.querySelector('div').click();
	  });

  }
  console.timeEnd(timer)
  
  await browser.close();
})();

