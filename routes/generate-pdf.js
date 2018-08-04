var express = require('express');
var router = express.Router();
const pug = require('pug');
var pdf = require('html-pdf');
var fs = require('fs');
var gst_template_a_data = require('../gst_template_a.data');

const config = {
    header: {
        height: '110px'
    },
    footer: {
        height: '80px'
    },
    // format: 'A4',
    // width: '8.5in',
    zoomFactor: '1',
    httpHeaders: {
        // e.g.
        Authorization: 'Bearer ACEFAD8C-4B4D-4042-AB30-6C735F5BAC8B'
    },
}

function getByteArray(filePath) {
    let fileData = fs.readFileSync(filePath).toString('hex');
    let result = []
    for (var i = 0; i < fileData.length; i+=2)
      result.push('0x'+fileData[i]+''+fileData[i+1])
    return result;
    // return fs.readFileSync(filePath);
}

router.get('/', function(req, res, next) {
    // { fontFamilyPath: 'https://fonts.googleapis.com/css?family=Roboto:100' }
    const compiledFunction = pug.compileFile('views/gst_template_c.pug');
    // const data = req.body;
    const data = { fontFamilyName: 'Roboto', fontFamilyPath: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700' };
    gst_template_a_data.context.billingAddress = gst_template_a_data.context.billingAddress[0].split(",");
    gst_template_a_data.context.shippingAddress = gst_template_a_data.context.shippingAddress[0].split(",");
    // let merged = {...data, ...gst_template_a_data };
    let merged = Object.assign({}, data, gst_template_a_data);
    const html = compiledFunction(merged);

    // pdf.create(html, config).toFile('./businesscard.pdf', function(err, response) {
    //   if (err) return console.log(err);
    //   // result = getByteArray('./businesscard.pdf');
    //   // console.log('the result is :', result);
    //   // res.send(result);
    //   res.download('./businesscard.pdf', 'A new name.pdf'); // { filename: '/app/businesscard.pdf' }
    // });
    console.log(html);
    pdf.create(html, config).toStream((err, stream) => {
        if (err) return res.end(err.stack);
        res.setHeader('Content-type', 'application/pdf');
        stream.pipe(res);
    });

    // pdf.create(html).toStream(function(err, stream){
    //   res.send(stream);
    // });

    // pdf.create(html).toBuffer(function(err, buffer){
    //   res.send(buffer);
    // });

});

router.post('/', function(req, res, next) {

    const compiledFunction = pug.compileFile('views/gst_template_a.pug');
    const data = req.body;
    data.fontFamilyName = 'Roboto';
    data.fontFamilyPath = 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700';
    gst_template_a_data.context.billingAddress = gst_template_a_data.context.billingAddress[0].split(",");
    gst_template_a_data.context.shippingAddress = gst_template_a_data.context.shippingAddress[0].split(",");

    let merged = Object.assign({}, data, gst_template_a_data);
    const html = compiledFunction(merged);

    pdf.create(html, config).toFile('./invoice.pdf', function(err, response) {
      if (err) return console.log(err);
      result = getByteArray('./invoice.pdf');
      res.send(result);
    });
    
    // pdf.create(html, config).toStream((err, stream) => {
    //     if (err) return res.end(err.stack);
    //     res.setHeader('Content-type', 'application/pdf');
    //     stream.pipe(res);
    // });

    // pdf.create(html).toStream(function(err, stream){
    //   res.send(stream);
    // });

    // pdf.create(html).toBuffer(function(err, buffer){
    //   res.send(buffer);
    // });

});

router.post('/two', function(req, res, next) {

    const compiledFunction = pug.compileFile('views/gst_template_a.pug');
    const data = req.body;
    data.fontFamilyName = 'Roboto';
    data.fontFamilyPath = 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700';
    gst_template_a_data.context.billingAddress = gst_template_a_data.context.billingAddress[0].split(",");
    gst_template_a_data.context.shippingAddress = gst_template_a_data.context.shippingAddress[0].split(",");

    let merged = Object.assign({}, data, gst_template_a_data);
    const html = compiledFunction(merged);

    // pdf.create(html, config).toFile('./invoice.pdf', function(err, response) {
    //   if (err) return console.log(err);
    //   result = getByteArray('./invoice.pdf');
    //   res.send(result);
    // });
    
    pdf.create(html, config).toStream((err, stream) => {
        if (err) return res.end(err.stack);
        res.setHeader('Content-type', 'application/pdf');
        stream.pipe(res);
    });

    // pdf.create(html).toStream(function(err, stream){
    //   res.send(stream);
    // });

    // pdf.create(html).toBuffer(function(err, buffer){
    //   res.send(buffer);
    // });

});

router.post('/three', function(req, res, next) {

    const compiledFunction = pug.compileFile('views/gst_template_a.pug');
    const data = req.body;
    data.fontFamilyName = 'Roboto';
    data.fontFamilyPath = 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700';
    gst_template_a_data.context.billingAddress = gst_template_a_data.context.billingAddress[0].split(",");
    gst_template_a_data.context.shippingAddress = gst_template_a_data.context.shippingAddress[0].split(",");

    let merged = Object.assign({}, data, gst_template_a_data);
    const html = compiledFunction(merged);

    // pdf.create(html, config).toFile('./invoice.pdf', function(err, response) {
    //   if (err) return console.log(err);
    //   result = getByteArray('./invoice.pdf');
    //   res.send(result);
    // });
    
    // pdf.create(html, config).toStream((err, stream) => {
    //     if (err) return res.end(err.stack);
    //     res.setHeader('Content-type', 'application/pdf');
    //     stream.pipe(res);
    // });

    pdf.create(html).toStream(function(err, stream){
      res.send(stream);
    });

    // pdf.create(html).toBuffer(function(err, buffer){
    //   res.send(buffer);
    // });

});

router.post('/four', function(req, res, next) {

    const compiledFunction = pug.compileFile('views/gst_template_a.pug');
    const data = req.body;
    data.fontFamilyName = 'Roboto';
    data.fontFamilyPath = 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700';
    gst_template_a_data.context.billingAddress = gst_template_a_data.context.billingAddress[0].split(",");
    gst_template_a_data.context.shippingAddress = gst_template_a_data.context.shippingAddress[0].split(",");

    let merged = Object.assign({}, data, gst_template_a_data);
    const html = compiledFunction(merged);

    // pdf.create(html, config).toFile('./invoice.pdf', function(err, response) {
    //   if (err) return console.log(err);
    //   result = getByteArray('./invoice.pdf');
    //   res.send(result);
    // });
    
    // pdf.create(html, config).toStream((err, stream) => {
    //     if (err) return res.end(err.stack);
    //     res.setHeader('Content-type', 'application/pdf');
    //     stream.pipe(res);
    // });

    // pdf.create(html).toStream(function(err, stream){
    //   res.send(stream);
    // });

    pdf.create(html).toBuffer(function(err, buffer){
      res.send(buffer);
    });

});

module.exports = router;