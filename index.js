// create a new express app

const express = require('express');
const app = express();

const { Configuration, OpenAIApi } = require('openai');
const readlineSync = require('readline-sync');

// configuration for openAi
const configuration = new Configuration({
  apiKey: 'your api key',
});

const openai = new OpenAIApi(configuration);

const history = [];

app.use(express.json());

// create a API for openAi Chat bot
app.post('/chat', async (req, res) => {
  const keywords = req.body.keywords;

  try {
    console.log(keywords);
    const titlePrompt = `Create a title for a product related to "${keywords}".`;
    const descriptionPrompt = `Create a description for a product related to "${keywords}".`;

    // const title = await generateTitle(titlePrompt);
    // const description = await generateDescription(descriptionPrompt);

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Generate a product title and description for the keyword "${keywords} and split them with :::"`,
      temperature: 0.4,
      max_tokens: 64,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const { choices } = response.data;
    const { text } = choices[0];
    console.log(text);
    const [title, description] = text.split(':::');
    // .map((str) => str.trim().replace(/\n/g, ''));
    console.log({ title, description });

    res.status(200).json({
      status: 'success',
      data: {
        productTitle: title,
        productDescription: description,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
});

// for swagger
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerJsDocs = YAML.load('./api.yaml');

// connect Db with localhost
async () => {
  try {
    // const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.log('MongoDB Connection failed', err);
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsDocs));

app.listen(3001, () => {
  console.log('Our Chat bot is running on port 3001');
});
