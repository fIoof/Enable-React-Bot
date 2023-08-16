import * as dotenv from 'dotenv'; 
import {Configuration, OpenAIApi} from 'openai'
import {promisify} from 'util';

const sleep = promisify(setTimeout);

const configuration = new Configuration({
    apiKey: "",
});

// dotenv.config();

const openai = new OpenAIApi(configuration);

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export default async (req, res) => {
    if (req.method === 'GET') {
        res.status(200).send({
            message: 'Hello from Enablebot',
        });
    } else if (req.method === 'POST') {
        for (let i = 0; i < MAX_RETRIES; i++) {
            try {
                const prompt = req.body.prompt;
                const response = await openai.createCompletion({
                    model: "text-davinci-003",
                    prompt: `${prompt}`,
                    temperature: 0,
                    max_tokens: 4000,
                    top_p: 1,
                    frequency_penalty: 0.5,
                    presence_penalty: 0,
                });
                res.status(200).send({
                    bot: response.data.choices[0].text,
                });
                return; 
            } catch (error) {
                console.log(`Attempt ${i + 1} failed. Retrying...`);
                if (i < MAX_RETRIES - 1) {
                    await sleep(RETRY_DELAY);
                } else {
                    console.log(error);
                    res.status(500).send("Request timed out try again.");
                    return; 
                }
            }
        }
    }}
