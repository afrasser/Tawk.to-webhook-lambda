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


    switch (event) {
        case "chat:start":
            // get data from the tawk.to request
            const payload = {
                fields: {
                    TITLE: "Saily Prueba" ,//requestBody.visitor.name,
                    UF_CRM_1625751580135: ["176"], // Servicio,
                    UF_CRM_1626274801587: ["192"], // ORIGEN DE CAMPAÑA
                    UF_CRM_1626357192293: ["204"], // PROBABILIDAD DE COMPRA
                    UF_CRM_1638810416867: "", // Email
                    OPENED: "Y", //
                    ASSIGNED_BY_ID: 1,
                    CREATED_BY_ID: 1,
                    PHONE: "1234567890",
                    EMAIL: requestBody.visitor.email //"sailyvaro05@gmail.com",
                },
                params: {
                    REGISTER_SONET_EVENT: "Y",
                },
            };

            const result = await axios.post(
                "https://colombiaredtelefoniaipsas.bitrix24.es/rest/548/an0wvpse3zzcex0a/crm.deal.add.json",
                payload
            );
            // res.send(result);
            console.log("chat started");
            res.send("chat started");
            break;
        case "chat:end":
            payload = {
                fields: {
                    TITLE: "Saily Prueba" ,//requestBody.visitor.name,
                    UF_CRM_1625751580135: ["176"], // Servicio,
                    UF_CRM_1626274801587: ["192"], // ORIGEN DE CAMPAÑA
                    UF_CRM_1626357192293: ["204"], // PROBABILIDAD DE COMPRA
                    UF_CRM_1638810416867: "", // Email
                    OPENED: "Y", //
                    ASSIGNED_BY_ID: 1,
                    CREATED_BY_ID: 1,
                    PHONE: "1234567890",
                    EMAIL: requestBody.visitor.email //"sailyvaro05@gmail.com",
                },
                params: {
                    REGISTER_SONET_EVENT: "Y",
                },
            };

            const result = await axios.post(
                "https://colombiaredtelefoniaipsas.bitrix24.es/rest/548/an0wvpse3zzcex0a/crm.deal.add.json",
                payload
            );
            // res.send(result);
            console.log("chat end", result);
            res.send("chat started");
            break;
        case "ticket:create":
            payload = {
                fields: {
                    TITLE: requestBody.visitor.name, // "Saily Prueba",
                    UF_CRM_1625751580135: ["176"], // Servicio,
                    UF_CRM_1626274801587: ["192"], // ORIGEN DE CAMPAÑA
                    UF_CRM_1626357192293: ["204"], // PROBABILIDAD DE COMPRA
                    UF_CRM_1638810416867: "", // Email
                    OPENED: "Y", //
                    ASSIGNED_BY_ID: 1,
                    CREATED_BY_ID: 1,
                    PHONE: "1234567890",
                    EMAIL: requestBody.visitor.email //"sailyvaro05@gmail.com",
                },
                params: {
                    REGISTER_SONET_EVENT: "Y",
                },
            };

            const result = await axios.post(
                "https://colombiaredtelefoniaipsas.bitrix24.es/rest/548/an0wvpse3zzcex0a/crm.deal.add.json",
                payload
            );
            // res.send(result);
            console.log("ticket created", result);
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
