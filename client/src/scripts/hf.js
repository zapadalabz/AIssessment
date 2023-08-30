import { HfInference } from '@huggingface/inference'
import { set } from 'react-hook-form';
import { HF_token } from './config';

//const hf = new HfInference(HF_token);

export async function setAnswer(input,currentOutput, setOutput){
    console.log(input);
    let running = false;
    let resp = currentOutput;

    if (running) {
        return;
    }
    running = true;
    try {
        const hf = new HfInference(HF_token);
        const model = "google/flan-t5-xxl";
        const prompt = input;
        for await (const output of hf.textGenerationStream({
            model,
            inputs: prompt,
            parameters: { max_new_tokens: 250 }
        }, {
            use_cache: false
        })) {
            console.log(output.token.text);
            //setOutput(output.token.text);
            resp += output.token.text;
            setOutput(resp);
        }
    } catch (err) {
        alert("Error: " + err.message);
    } finally {
        running = false;
    }
    return resp
}

