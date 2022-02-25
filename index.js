const express = require("express");
const logger = require("morgan");
const crypto = require("crypto");
const axios = require("axios");
//var bodyParser = require('body-parser'); // to get raw body

const app = express();

// var options = {
//     inflate: true,
//     limit: '100kb',
//     type: 'application/octet-stream'
// };

//app.use(bodyParser.raw(options));
app.use(logger("dev"));

//custom middleware to get rawbody
app.use(function(req, res, next){
    var data = "";
    req.on('data', function(chunk){ data += chunk})
    req.on('end', function(){
       req.rawBody = data;
       next();
    })
 })

// app.get("/", (req, res, next) => {
//     return res.status(200).json({
//         message: "App is working",
//     });
// });

// app.get("/hello", (req, res, next) => {
//     return res.status(200).json({
//         message: "Hello from path!",
//     });
// });

// app.use((req, res, next) => {
//     return res.status(404).json({
//         error: "Not Found",
//     });
// });



function verifySignature(body, signature, secretKey) {

    console.log(`signature: ${signature}`);
    console.log(`body ${body}, signature ${signature}`)

    const digest = crypto
        .createHmac("sha1", secretKey)
        .update(body)
        .digest("hex");

    return signature === digest;
}

/*
function verifySignatureCololmbiaRed(body, signature) {
    console.log("signature:", signature);
    const digest = crypto
        .createHmac("sha1", "8cd6c2e8f13ba02942eb300f5a9fce7cad2dc28668a5ac9d3112fb5b81a2d1c9def0c278b1a586a006771c9f996604a3")
        .update(body)
        .digest("hex");

    return signature === digest;
}
*/

async function sendDataToBitrix24(req, res, secretKey) {
    if (!verifySignature(req.rawBody, req.headers["x-tawk-signature"], secretKey)) {
        console.log("verification failed");
        //res.send("verification failed");
    } else {
        console.log("verification OK!");
    }

    const requestBody = JSON.parse(req.rawBody);
    const event = requestBody.event;

    // body example
    // {
    //     "visitor": {
    //         "name":"Lina Palacios",
    //         "city":"unknown",
    //         "country":"CO"
    //     },
    //     "chatId":"898d1600-94e1-11ec-9798-b33a69d7199d",
    //     "message":{
    //         "sender":{
    //             "type":"visitor"
    //         },
    //         "text":"Nombre de La Empresa : Lina Palacios",
    //         "type":"msg"
    //     },
    //     "time":"2022-02-23T19:48:17.019Z",
    //     "event":"chat:start",
    //     "property":{
    //         "id":"5c659c297f688621d571cbb8",
    //         "name":"ColombiaRed.com.co"
    //     }
    // }


    // how to use Bitrix24 inbound webhook: https://training.bitrix24.com/rest_help/rest_sum/webhooks.php
    //const eventID = req.headers["X-Hook-Event-Id"];
    console.log(`Event ID: ${event}`);

    var payload = {};
    var result = {};

    const {message} = requestBody;

    switch (event) {
        case "chat:start":
            // get data from the tawk.to request
            payload = {
                fields: {
                    TITLE: requestBody.visitor.name,//requestBody.visitor.name,
                    UF_CRM_1625751580135: ["176"], // Servicio (176 = mensajeria),
                    //UF_CRM_1626274801587: ["192"], // ORIGEN DE CAMPAÑA
                    //UF_CRM_1626357192293: ["204"], // PROBABILIDAD DE COMPRA
                    UF_CRM_1638810416867: requestBody.visitor.email,
                    OPENED: "Y", //
                    ASSIGNED_BY_ID: 1,
                    CREATED_BY_ID: 1,
                    UTM_CONTENT: message.text == undefined ? "":message.text,
                    //PHONE: "1234567890",
                    EMAIL: requestBody.visitor.email //requestBody.visitor.email //"sailyvaro05@gmail.com",
                },
                params: {
                    REGISTER_SONET_EVENT: "Y",
                },
            };

            result = await axios.post(
                "https://colombiaredtelefoniaipsas.bitrix24.es/rest/548/an0wvpse3zzcex0a/crm.deal.add.json",
                payload
            );
            // res.send(result);
            //console.log("chat started");
            res.send("chat started");
            break;
        case "chat:end":

            // chat end payload example: 
            // {
            //     event: 'chat:end',
            //     chatId: '70fe3290-99ad-11e9-a30a-51567162179f',
            //     time: '2019-06-28T14:04:08.718Z',
            //     visitor: {
            //         name: 'V1561719148780935',
            //         email : 'hello@test.com',
            //         city: 'jelgava',
            //         country: 'LV'
            //     },
            //     property: {
            //         id: '58ca8453b8a7e060cd3b1ecb',
            //         name: 'Bobs Burgers'
            //     }
            // }

            payload = {
                fields: {
                    TITLE: requestBody.visitor.name,//requestBody.visitor.name,
                    UF_CRM_1625751580135: ["176"], // Servicio,
                    //UF_CRM_1626274801587: ["192"], // ORIGEN DE CAMPAÑA
                    //UF_CRM_1626357192293: ["204"], // PROBABILIDAD DE COMPRA
                    UF_CRM_1638810416867: requestBody.visitor.email,
                    OPENED: "Y", //
                    ASSIGNED_BY_ID: 1,
                    CREATED_BY_ID: 1,
                    UTM_CONTENT: message.text == undefined ? "":message.text,
                    PHONE: "1234567890",
                    EMAIL: requestBody.visitor.email
                },
                params: {
                    REGISTER_SONET_EVENT: "Y",
                },
            };

            result = await axios.post(
                "https://colombiaredtelefoniaipsas.bitrix24.es/rest/548/an0wvpse3zzcex0a/crm.deal.add.json",
                payload
            );
            // res.send(result);
            //console.log("chat end", result);
            res.send("chat started");
            break;
        case "ticket:create":

            // ticket payload example:
            // {
            //     event: 'ticket:create',
            //     time: '2019-06-28T14:07:13.512Z',
            //     property: {
            //         id: '58ca8453b8a7e060cd3b1ecb',
            //         name: 'Bobs Burgers'
            //     },
            //     requester: {
            //         name: 'Martins',
            //         email: 'martins@tawk.to',
            //         type: 'agent'
            //     },
            //     ticket: {
            //         id: '02598050-99ae-11e9-8887-97564881b95b',
            //         humanId: 3,
            //         subject: 'Testing',
            //         message: 'Once more through the breach'
            //     }
            // }

            payload = {
                fields: {
                    TITLE: requestBody.visitor.name,//requestBody.visitor.name,
                    UF_CRM_1625751580135: ["176"], // Servicio,
                    //UF_CRM_1626274801587: ["192"], // ORIGEN DE CAMPAÑA
                    //UF_CRM_1626357192293: ["204"], // PROBABILIDAD DE COMPRA
                    UF_CRM_1638810416867: requestBody.visitor.email,
                    OPENED: "Y", //
                    ASSIGNED_BY_ID: 1,
                    CREATED_BY_ID: 1,
                    UTM_CONTENT: message.text == undefined ? "":message.text,
                    PHONE: "1234567890",
                    EMAIL: requestBody.visitor.email
                },
                params: {
                    REGISTER_SONET_EVENT: "Y",
                },
            };

            result = await axios.post(
                "https://colombiaredtelefoniaipsas.bitrix24.es/rest/548/an0wvpse3zzcex0a/crm.deal.add.json",
                payload
            );
            // res.send(result);
            //console.log("ticket created", result);
            res.send("ticket created");
            break;
        default:
            res.send("no valid option sent");
    }
}

app.post("/colombiared", async (req, res, next) => {
    try {
        //res.send(req.headers["x-tawk-signature"]);
        console.log(`body: ${req.rawBody}`);
        const colombiaredSecretKey = "8cd6c2e8f13ba02942eb300f5a9fce7cad2dc28668a5ac9d3112fb5b81a2d1c9def0c278b1a586a006771c9f996604a3";
        await sendDataToBitrix24(req,res, colombiaredSecretKey);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message: error.message,
        });
        //res.send(error.message);
    }
});

//module.exports.handler = serverless(app);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
