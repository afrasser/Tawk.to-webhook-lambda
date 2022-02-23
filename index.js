const express = require("express");
const logger = require("morgan");
const app = express();

app.use(logger("dev"));

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

const crypto = require("crypto");

function verifySignature(body, signature, secretKey) {
    const digest = crypto
        .createHmac("sha1", secretKey)
        .update(body)
        .digest("hex");
    console.log(`digest ${digest}, signature ${signature}`)
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

async function sendDataToBitrix24(req,res, secretKey) {
    if (!verifySignature(req.body, req.headers["x-tawk-signature"],secretKey)) {
        console.log("verification failed");
        //res.send("verification failed");
    }else{
        console.log("verification OK!");
    }

    // how to use Bitrix24 inbound webhook: https://training.bitrix24.com/rest_help/rest_sum/webhooks.php
    const eventID = req.header("X-Hook-Event-Id");
    switch (eventID) {
        case "chat:start":
            // get data from the tawk.to request
            // const body = {
            //     fields: {
            //         TITLE: "Saily Prueba",
            //         UF_CRM_1625751580135: ["176"],
            //         UF_CRM_1626274801587: ["192"],
            //         UF_CRM_1626357192293: ["204"],
            //         UF_CRM_1638810416867: "",
            //         OPENED: "Y",
            //         ASSIGNED_BY_ID: 1,
            //         CREATED_BY_ID: 1,
            //         PHONE: "1234567890",
            //         EMAIL: "sailyvaro05@gmail.com",
            //     },
            //     params: {
            //         REGISTER_SONET_EVENT: "Y",
            //     },
            // };

            // const result = await axios.post(
            //     "https://restapi.bitrix24.com/rest/1/31uhq2q855fk1foj/crm.lead.add.json",
            //     body
            // );
            // res.send(result);
            console.log("chat started");
            res.send("chat started");
            break;
        case "chat:end":
            body = {
                fields: {
                    TITLE: "Saily Prueba",
                    UF_CRM_1625751580135: ["176"],
                    UF_CRM_1626274801587: ["192"],
                    UF_CRM_1626357192293: ["204"],
                    UF_CRM_1638810416867: "",
                    OPENED: "Y",
                    ASSIGNED_BY_ID: 1,
                    CREATED_BY_ID: 1,
                    PHONE: "1234567890",
                    EMAIL: "sailyvaro05@gmail.com",
                },
                params: {
                    REGISTER_SONET_EVENT: "Y",
                },
            };
            console.log("chat end");
            res.send("chat end");
            break;
        case "ticket:create":
            body = {
                fields: {
                    TITLE: "Saily Prueba",
                    UF_CRM_1625751580135: ["176"],
                    UF_CRM_1626274801587: ["192"],
                    UF_CRM_1626357192293: ["204"],
                    UF_CRM_1638810416867: "",
                    OPENED: "Y",
                    ASSIGNED_BY_ID: 1,
                    CREATED_BY_ID: 1,
                    PHONE: "1234567890",
                    EMAIL: "sailyvaro05@gmail.com",
                },
                params: {
                    REGISTER_SONET_EVENT: "Y",
                },
            };
            console.log("ticket created");
            res.send("ticket created");
            break;
        default:
            res.send("no valid option sent");
    }
}

app.post("/colombiared", async (req, res) => {
    try {
        //res.send(req.headers["x-tawk-signature"]);
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
