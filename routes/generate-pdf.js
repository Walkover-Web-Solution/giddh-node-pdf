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
    for (var i = 0; i < fileData.length; i += 2)
        result.push('0x' + fileData[i] + '' + fileData[i + 1])
    return result;
    // return fs.readFileSync(filePath);
}

router.get('/', function(req, res, next) {
    // { fontFamilyPath: 'https://fonts.googleapis.com/css?family=Roboto:100' }
    // const compiledFunction = pug.compileFile('views/gst_template_c.pug');
    // // const data = req.body;
    // const data = { fontFamilyName: 'Roboto', fontFamilyPath: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700' };
    // gst_template_a_data.context.billingAddress = gst_template_a_data.context.billingAddress[0].split(",");
    // gst_template_a_data.context.shippingAddress = gst_template_a_data.context.shippingAddress[0].split(",");
    // // let merged = {...data, ...gst_template_a_data };

    // gst_template_a_data = formatData(gst_template_a_data);

    // let merged = Object.assign({}, data, gst_template_a_data);
    // const html = compiledFunction(merged);


    // New start
    const compiledFunction = pug.compileFile('views/gst_template_c.pug');
    // const fontData = { fontFamilyName: 'Roboto', fontFamilyPath: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700' };

    // console.log('the typeof data received form test server is :', gst_template_a_data);

    if (gst_template_a_data && gst_template_a_data.invoice && gst_template_a_data.invoice[0]) {

        // console.log('before conversion the typeof data received form test server is :', typeof gst_template_a_data[0]);


        gst_template_a_data = JSON.parse(gst_template_a_data.invoice[0]);

        // console.log('after conversion the typeof data received form test server is :', typeof gst_template_a_data);
        // console.log('after conversion the data received form test server is :', gst_template_a_data);
    }

    gst_template_a_data = formatData(gst_template_a_data);

    gst_template_a_data.fontFamilyName = 'Roboto';
    gst_template_a_data.fontFamilyPath = 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700';

    if (gst_template_a_data.context.billingAddress && gst_template_a_data.context.billingAddress.length) {
        gst_template_a_data.context.billingAddress = gst_template_a_data.context.billingAddress[0].split(",");
    }
    if (gst_template_a_data.context.billingAddress && gst_template_a_data.context.billingAddress.length) {
        gst_template_a_data.context.shippingAddress = gst_template_a_data.context.shippingAddress[0].split(",");
    }



    let merged = Object.assign({}, gst_template_a_data);
    const html = compiledFunction(merged);
    // New end

    // pdf.create(html, config).toFile('./businesscard.pdf', function(err, response) {
    //   if (err) return console.log(err);
    //   // result = getByteArray('./businesscard.pdf');
    //   // console.log('the result is :', result);
    //   // res.send(result);
    //   res.download('./businesscard.pdf', 'A new name.pdf'); // { filename: '/app/businesscard.pdf' }
    // });
    // console.log(html);
    pdf.create(html, config).toStream((err, stream) => {
        if (err) return res.end(err.stack);
        res.setHeader('Content-type', 'application/pdf');
        stream.pipe(res);
    });

    // pdf.create(html).toStream(function(err, stream){
    //   res.send(stream);
    // });

    // pdf.create(html).toBuffer(function(err, buffer){
    //   var base64 = buffer.toString('base64');
    //   res.send(base64);
    // });

});

router.post('/', function(req, res, next) {

    const compiledFunction = pug.compileFile('views/gst_template_c.pug');
    // const fontData = { fontFamilyName: 'Roboto', fontFamilyPath: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700' };

    var gst_template_a_data = req.body;

    console.log('the typeof data received form test server is :', gst_template_a_data);

    if (gst_template_a_data && gst_template_a_data.invoice && gst_template_a_data.invoice[0]) {

        console.log('before conversion the typeof data received form test server is :', typeof gst_template_a_data[0]);


        gst_template_a_data = JSON.parse(gst_template_a_data.invoice[0]);

        console.log('after conversion the typeof data received form test server is :', typeof gst_template_a_data);
        console.log('after conversion the data received form test server is :', gst_template_a_data);
    }

    gst_template_a_data = formatData(gst_template_a_data);

    gst_template_a_data.fontFamilyName = 'Roboto';
    gst_template_a_data.fontFamilyPath = 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700';

    if (gst_template_a_data.context.billingAddress && gst_template_a_data.context.billingAddress.length) {
        gst_template_a_data.context.billingAddress = gst_template_a_data.context.billingAddress[0].split(",");
    }
    if (gst_template_a_data.context.billingAddress && gst_template_a_data.context.billingAddress.length) {
        gst_template_a_data.context.shippingAddress = gst_template_a_data.context.shippingAddress[0].split(",");
    }



    let merged = Object.assign({}, gst_template_a_data);
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

    pdf.create(html).toBuffer(function(err, buffer) {
        if (err) {
            res.send({
                status: 'error',
                data: err
            });
        } else {

            var base64 = buffer.toString('base64');

            res.send({
                status: 'success',
                data: base64
            });
        }
    });

});

function formatData(inputJson) {

    var data = inputJson;

    var category = 'other';

    var foundTax = 0;
    var tempTax = 0;
    var taxRate = 0;
    var txTotal = 0;
    var totalTaxRateToShow = 0;
    var taxableTotal = 0;

    data.context.entries.forEach((function(entry, indx) {
        entry.transactions.forEach(function(trxn, trxnIndx) {

            // Serial number
            trxn.srNumber = indx + 1;

            // Item
            if (data.context.label.item) {
                if (trxn.stockDetails && trxn.stockDetails.name) {
                    trxn.itemToShow = trxn.stockDetails.name;
                }
                if (trxn.accountName) {
                    trxn.accountNameToShow = trxn.accountName;
                }
                if (trxn.stockDetails && trxn.description != trxn.stockDetails.name && trxn.description != trxn.accountName) {
                    trxn.showDescription = true;
                } else {
                    trxn.showDescription = false;
                }
            }

            // HSN/SAC
            if (data.context.label.hsnSac) {
                if (data.context.manageInventory) {
                    if (trxn.hsnNumber) {
                        trxn.hsnSacToShow = trxn.hsnNumber;
                        trxn.hsnSacType = 'H';
                    } else if (trxn.sacNumber) {
                        trxn.hsnSacToShow = trxn.sacNumber;
                        trxn.hsnSacType = 'S';
                    }
                }
            }

            // Taxes
            if (data.context.label.taxes) {

                foundTax = 0;
                tempTax = 0;
                taxRate = 0;
                txTotal = 0;
                totalTaxRateToShow = 0;

                data.context.gstTaxesTotal.forEach(function(taxWithTotal) {

                    data.context.taxes.forEach(function(tax) {
                        if (taxWithTotal.uniqueName == tax.accountUniqueName) {
                            foundTax = 1;
                            tempTax = tax.amount;
                            taxRate = tax.rate;
                            txTotal = txTotal + tempTax;
                        }
                    });

                    if (foundTax == 1 && trxn.category != category) {
                        totalTaxRateToShow = totalTaxRateToShow + taxRate;
                    }
                });

                trxn.totalTaxRateToShow = totalTaxRateToShow;

            }

            // Discount total
            if (trxn.discounts && trxn.discounts.length) {
                trxn.discountTotal = 0;
                trxn.discounts.forEach(function(discount) {
                    if (trxn.category != category) {
                        trxn.discountTotal = trxn.discountTotal.discountTotal + discount.amount
                    }
                });
            }

            // taxableValue
            if (trxn.category != category) {
                trxn.trWithDist = trxn.amount - trxn.discountTotal;
                taxableTotal = Number(taxableTotal) + Number(trxn.trWithDist);
            }


            trxn.amountToShow = trxn.amount;

            // console.log('the trxn is :', trxn);

        });
    }));

    data.taxableTotal = taxableTotal;

    return data;
}

module.exports = router;