import { Config } from "./types";
import fetch from 'node-fetch';

async function getMemeText(
    diffData: string,
    config: Config
  ): Promise<string> {
    if (!config.openai) {
      throw new Error('Error: OpenAI config not found');
    }
  
    const endpointUrl = config.openai.endpoint;
    const apiKey = config.openai.apiKey;
    const prompt = `Generate the text, maximum 8 words, for the 10 guy meme with the best roast you can find in the git diff.`;
  
    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: config.openai.model || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: prompt,
          },
          {
            role: 'user',
            content: diffData,
          },
        ],
      }),
    });
    if (!response.ok) {
      throw new Error(`Error posting diff to endpoint: ${response.statusText}`);
    }
    const data = await response.json();
    const { choices } = data as { choices: { message: { content: string } }[] };
    const { message } = choices[0];
    const { content } = message;
    return content;
  }


export async function generateMeme(diffData: string,
    config: Config){
    const memeText = await getMemeText(diffData, config);
    return `https://apimeme.com/meme?meme=Afraid-To-Ask-Andy&top=${memeText.replace(/ /g, '+')}&bottom=` 
}