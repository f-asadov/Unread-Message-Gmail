import puppeteer from "puppeteer";
import dotenv from 'dotenv';

dotenv.config();

async function openPage() {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
    ],
  });
  const page = await browser.newPage();
  

  try {
    await page.goto("https://www.google.com/intl/en/gmail/about/");
    await page.click(".button.button--medium.button--mobile-before-hero-only");

    // Wait for input login
    await page.waitForSelector('input[name="identifier"]');
    await page.type('input[name="identifier"]', process.env.USER_EMAIL + '');

    // Wait for NEXT button
    await page.click("#identifierNext");
    await page.waitForTimeout(5000);

    // Wait for input password
    await page.waitForSelector('input[name="Passwd"]');
    await page.type('input[name="Passwd"]', process.env.USER_PASSWORD + '');

    // Wait for NEXT button
    await page.click("#passwordNext");
    await page.waitForTimeout(5000);

    // Click to unread messages checkbox
    await page.waitForSelector('.G-asx.T-I-J3.J-J5-Ji');
    await page.click('.G-asx.T-I-J3.J-J5-Ji');
    await page.waitForSelector('.J-N-Jz');
    await page.click('.J-N-Jz');
    await page.waitForSelector('tbody');

    // Get the number of tr elements with the specified class inside tbody
    const trCount = await page.$$eval('tbody tr.zA.zE.x7', rows => rows.length);
    console.log("Number of unread messages =", trCount);
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await browser.close();
  }
}

openPage();
