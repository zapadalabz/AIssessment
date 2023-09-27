const express = require("express");
const { HfInference } = require('@huggingface/inference');
require("dotenv").config({path:"./config.env"});

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordHFRoutes = express.Router();
const HF_token = process.env.HF_token;

// This section will help you get a list of all the records.
recordHFRoutes.route("/hf/:prompt").get(async function (req, response) {
    let prompt = req.params.prompt;
    //console.log(prompt);

    console.log(HF_token);
    const hf = new HfInference(HF_token);
    const model = "google/flan-t5-xxl";
    //const maxTokens = 250;

    response.setHeader('Content-Type', 'text/plain');
    response.setHeader('Transfer-Encoding', 'chunked');

    try {
        for await (const output of hf.textGenerationStream({
            model,
            inputs: prompt,
            parameters: { max_new_tokens: 250 },
        }, {
            use_cache: false,
        })) {
            // Send each chunk of text immediately to the client
            response.write(output.token.text);
        }

        // Signal the end of the response
        response.end();
    } catch (error) {
        console.error(error);
        response.status(500).send(HF_token);
    }
  
  });

  module.exports = recordHFRoutes;