//import libraries
import express from "express";
import bodyParser from "body-parser";
import axios from 'axios';

//initialize express server
const app = express();
const path = require('path')
const PORT = process.env.PORT || 5000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// express()
//   .use(express.static(path.join(__dirname, 'public')))
//   .set('views', path.join(__dirname, 'views'))
//   .set('view engine', 'ejs')
//   .get('/', (req, res) => res.render('pages/index'))
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`))

const WEBHOOK_SECRET = "webhook secret key";
const crypto = require("crypto");
function verifySignature(body: any, signature: any) {
    const digest = crypto
        .createHmac("sha1", WEBHOOK_SECRET)
        .update(body)
        .digest("hex");
    return signature === digest;
}

// https://www.youtube.com/watch?v=NDOh2qEmSe8&t=1s
// example aws express repo: https://github.com/serverless/examples/blob/v2/aws-node-express-api/handler.js
// other usefull examples: https://www.serverless.com/examples?prod_EXAMPLES_SEARCH_GROWTH%5BrefinementList%5D%5Bplatform%5D%5B0%5D=aws&prod_EXAMPLES_SEARCH_GROWTH%5BrefinementList%5D%5Blanguage%5D%5B0%5D=node
// login to aws: serverless config credentials --provider aws --key AKIA6IJ2TT4WIJUSYRUZ --secret 3O/7r3VM1b/n9S7/kHVsQhbVPjfL9QpW+xxQwRF0 -o
// test local: serverless invoke local --function helloWorldFunction
// deploy: sls deploy / serverless deploy
app.get("/", (req, res, next) => {
    return res.status(200).json({
        message: "Hello from root!",
    });
});

app.get("/hello", (req, res, next) => {
    return res.status(200).json({
        message: "Hello from path!",
    });
});

app.use((req, res, next) => {
    return res.status(404).json({
        error: "Not Found",
    });
});

app.post("/webhooks", async (req, res, next) => {
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
                    EMAIL: "sailyvaro05@gmail.com"
                },
                params: {
                    REGISTER_SONET_EVENT: "Y"
                }
            };

            const result = await axios.post("https://restapi.bitrix24.com/rest/1/31uhq2q855fk1foj/crm.lead.add.json", body)
            res.send(result);

            break;
        case "chat:end":
            res.send("chat end");
            break;
        case "ticket:create":
            res.send("ticket create");
            break;
    }
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));