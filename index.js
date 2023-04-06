// create a new express app
require('dotenv').config();
const express = require('express');
const app = express();

const { Configuration, OpenAIApi } = require('openai');
const readlineSync = require('readline-sync');

// configuration for openAi
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log('API KEY', process.env.OPENAI_API_KEY);
const openai = new OpenAIApi(configuration);

const history = [];

app.use(express.json());

// create a API for openAi Chat bot
app.post('/chat', async (req, res) => {
  const keywords = req.body.keywords;

  try {
    console.log(keywords);
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Generate a product title and description for the keyword ${keywords} and split both with :::`,
      temperature: 0.4,
      max_tokens: 64,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    const { choices } = response.data;
    const { text } = choices[0];
    console.log(text);
    // const [title, description] = text.split(":::").map((str) => str.trim().replace(/\n/g, ''));
    // console.log({ title, description });

    const [title, description] = text
      .split(':::')
      .map((str) => str.trim().replace(/\n/g, ''));
    console.log({ title, description });
    // const resData = {};
    // [title, description].forEach((s) => {
    //   const [key, value] = s.split(':').map((s) => s.trim());
    //   resData[key] = value;
    // });

    // console.log(resData);

    res.status(200).json({
      status: 'success',
      d: text,
      data: {
        title: title ? title.replace('Product Title: ', '') : '',
        description: description
          ? description.replace('Product Description: ', '')
          : '',
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'false',
      message: error.message,
    });
  }
});

app.listen(3000, () => {
  console.log('Our Chat bot is running on port 3000');
});
