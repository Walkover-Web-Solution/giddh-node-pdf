var express = require('express');
var router = express.Router();
const pug = require('pug');
var pdf = require('html-pdf');
var fs = require('fs');
var gst_template_a_data = require('../gst_template_a.data');
var request = require('request');

const config = {
    header: {
        height: '130px'
    },
    footer: {
        height: '80px'
    },
    // format: 'A4',
    // width: '8.5in',
    zoomFactor: '0',
    httpHeaders: {
        // e.g.
        Authorization: 'Bearer ACEFAD8C-4B4D-4042-AB30-6C735F5BAC8B'
    },
}

function processDataAndGenerateInvoice(res, invoiceData, method) {

    var compiledFunction = null;
    
    if (invoiceData.templateUniqueName) {
        if (invoiceData.templateUniqueName === 'gst_template_c') {
            compiledFunction = pug.compileFile('views/gst_template_c.pug');
        } else {
            compiledFunction = pug.compileFile('views/gst_template_a.pug');
        }
    } else {
        compiledFunction = pug.compileFile('views/gst_template_a.pug');
    }

    invoiceData = formatData(invoiceData);

    invoiceData.fontFamilyName = 'Roboto';
    invoiceData.fontFamilyPath = 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700';

    if (invoiceData.context.billingAddress && invoiceData.context.billingAddress.length) {
        invoiceData.context.billingAddress = invoiceData.context.billingAddress[0].split(",");
    }
    if (invoiceData.context.billingAddress && invoiceData.context.billingAddress.length) {
        invoiceData.context.shippingAddress = invoiceData.context.shippingAddress[0].split(",");
    }

    let merged = Object.assign({}, invoiceData);
    const html = compiledFunction(merged);

    if (method === 'POST') {
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
    } else if (method === 'GET') {
        // console.log(html);
        pdf.create(html, config).toStream((err, stream) => {
            if (err) return res.end(err.stack);
            res.setHeader('Content-type', 'application/pdf');
            stream.pipe(res);
        });
    }
}

function getDataAndStartProcess(res, gst_template_data, request_method) {

    if (gst_template_data && gst_template_data.invoice && gst_template_data.invoice[0]) {
        gst_template_data = JSON.parse(gst_template_data.invoice[0]);
    }

    if (gst_template_data.context.showlogo && gst_template_data.context.logopath) {

        request.get(gst_template_data.context.logopath, { encoding: 'base64' }, function(err, response, body) {

            if (err) {
                console.log('the eerrrr is :', err);
            }
            if (response && response.statusCode !== 200) {
                console.log('the response code erro is :', res);
            }

            if (!err && response && response.statusCode === 200) {
                var base64data = body.toString('base64')
                gst_template_data.context.logopath = base64data;
            }

            processDataAndGenerateInvoice(res, gst_template_data, request_method);
        });
    } else {
        processDataAndGenerateInvoice(res, gst_template_data, request_method);
    }
}

router.get('/', function(req, res, next) {
    getDataAndStartProcess(res, gst_template_a_data, 'GET');
});

router.post('/', function(req, res, next) {
    getDataAndStartProcess(res, req.body, 'POST');
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
    var subTotal = 0;


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
            subTotal += Number(trxn.amount);
            // console.log('the trxn is :', trxn);

        });
    }));

    data.taxableTotal = taxableTotal;
    data.subTotal = subTotal;

    return data;
}

module.exports = router;