import express from 'express';

const app = express();
const bp = require('body-parser');
const port = 3000;
const playwright = require('playwright');
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

let arr_links = [] //not sure about this`
let articles = []

async function scrape(link1: string) {
    console.log('function starts')
    try {
      const browser = await playwright.chromium.launch({
          headless: true // setting this to true will not run the UI
      });

      const page = await browser.newPage();
      //link1 = 'https://rentervention.helpscoutdocs.com/article/99-familial-and-parental-status-discrimination';
      await page.goto(link1);
      //const data = page.querySelector('#fullArticle');
      const texts = await page.getByRole('article').allTextContents();
    
    const final_text = 'Summarize the following text:' + texts[0];
    await browser.close();
    return final_text;
    }
    catch(e) {
      console.log(e);
      return "there was an issue!";
    }
}

app.listen(port, () => {
  console.log(`Webscraping application is running on port ${port}.`);
});

app.post('/receive', (req,res)=> {
  //const link1 = req.body.link1 
  arr_links.push(req.body.link1);
  console.log(req.body.link1);
  console.log(arr_links)
  res.send(req.body.link1);
})

app.get('/scrape', async (req, res) => {
  //map over array of links and return scrape(link)
  articles = await Promise.all(arr_links.map(async link => await scrape(link)));
  res.send(articles);
  arr_links = [];
});

//maybe .then not working because it executes the code after it without waiting for promise to get resolved