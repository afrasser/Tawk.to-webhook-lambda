const express = require("express");
const logger = require("morgan");
const app = express();

app.use(logger("dev"));

app.get("/", (req, res, next) => {
    return res.status(200).json({
        message: "App is working",
    });
});

app.get("/hello", (req, res, next) => {
    return res.status(200).json({
        message: "Hello from path!",
    });
});

// app.use((req, res, next) => {
//     return res.status(404).json({
//         error: "Not Found",
//     });
// });

const WEBHOOK_SECRET =
    "3a9a314fdbf6aac77d8e536490c05d187d467d612a884fb652267eab4c464c268bcd09a5407fb4699afdde77366ec224";

const WEBHOOK_SECRET_V2 =
    "224a30326d232527995dd2ec3967246b0410e9b688340489b7c0ee092caa59297695df66ca2a684b3791229de1d4c809";

const crypto = require("crypto");


function verifySignature(body, signature) {
    const digest = crypto
        .createHmac("sha1", WEBHOOK_SECRET)
        .update(body)
        .digest("hex");

    const digest_v2 = crypto
        .createHmac("sha1", WEBHOOK_SECRET_V2)
        .update(body)
        .digest("hex");

    return signature === digest || signature === digest_v2;
}

function verifySignatureCololmbiaRed(body, signature) {
    console.log("signature:", signature);
    const digest = crypto
        .createHmac("sha1", "8cd6c2e8f13ba02942eb300f5a9fce7cad2dc28668a5ac9d3112fb5b81a2d1c9def0c278b1a586a006771c9f996604a3")
        .update(body)
        .digest("hex");

    return signature === digest;
}

async function sendDataToBitrix24(req,res, verifySignaturFunction){
    if (!verifySignaturFunction(req.body, req.headers["x-tawk-signature"])) {
        res.send("verification failed");
    }

    // how to use Bitrix24 inbound webhook: https://training.bitrix24.com/rest_help/rest_sum/webhooks.php
    const eventID = req.header("X-Hook-Event-Id");
    switch (eventID) {
        case "chat:start":
            // // const queryUrl = 'https://restapi.bitrix24.com/rest/1/31uhq2q855fk1foj/crm.lead.add.json';
            // // $queryData = http_build_query(array(
            // //     'fields' => array(
            // //     "TITLE" => $_REQUEST['first_name'].' '.$_REQUEST['last_name'],
            // //     "NAME" => $_REQUEST['first_name'],
            // //     "LAST_NAME" => $_REQUEST['last_name'],
            // //     "STATUS_ID" => "NEW",
            // //     "OPENED" => "Y",
            // //     "ASSIGNED_BY_ID" => 1,
            // //     "PHONE" => array(array("VALUE" => $_REQUEST['phone'], "VALUE_TYPE" => "WORK" )),
            // //     "EMAIL" => array(array("VALUE" => $_REQUEST['email'], "VALUE_TYPE" => "WORK" )),
            // //     ),
            // //     'params' => array("REGISTER_SONET_EVENT" => "Y")
            // //     ));

            // // get data from the tawk.to request
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
            res.send("ticket create");
            break;
        default:
            res.send("no valid option sent");
    }
}

app.post("/webhookssss", async (req, res, next) => {
    try {
        if (!verifySignature(req.body, req.headers["x-tawk-signature"])) {
            res.send("verification failed");
        }

        // how to use Bitrix24 inbound webhook: https://training.bitrix24.com/rest_help/rest_sum/webhooks.php
        const eventID = req.header("X-Hook-Event-Id");
        switch (eventID) {
            case "chat:start":
                // const queryUrl = 'https://restapi.bitrix24.com/rest/1/31uhq2q855fk1foj/crm.lead.add.json';
                // $queryData = http_build_query(array(
                //     'fields' => array(
                //     "TITLE" => $_REQUEST['first_name'].' '.$_REQUEST['last_name'],
                //     "NAME" => $_REQUEST['first_name'],
                //     "LAST_NAME" => $_REQUEST['last_name'],
                //     "STATUS_ID" => "NEW",
                //     "OPENED" => "Y",
                //     "ASSIGNED_BY_ID" => 1,
                //     "PHONE" => array(array("VALUE" => $_REQUEST['phone'], "VALUE_TYPE" => "WORK" )),
                //     "EMAIL" => array(array("VALUE" => $_REQUEST['email'], "VALUE_TYPE" => "WORK" )),
                //     ),
                //     'params' => array("REGISTER_SONET_EVENT" => "Y")
                //     ));

                // get data from the tawk.to request
                const body = {
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

                const result = await axios.post(
                    "https://restapi.bitrix24.com/rest/1/31uhq2q855fk1foj/crm.lead.add.json",
                    body
                );
                res.send(result);

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
                res.send("ticket create");
                break;
            default:
                res.send("no valid option sent");
        }
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message: error.message,
        });
        //res.send(error.message);
    }

});

app.post("/colombiared", async (req, res) => {
    try {
        console.log(req.headers["x-tawk-signature"])
        res.send(req.headers["x-tawk-signature"]);
        //await sendDataToBitrix24(req,res, verifySignatureCololmbiaRed);
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
