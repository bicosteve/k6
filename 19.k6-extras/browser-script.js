import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { check, group, sleep } from 'k6';
import { browser } from 'k6/browser';
import http from 'k6/http';

import { payload } from './payload.js';

// Options
export const options = {
  vus: 10,
  duration: '30s',
  cloud: {
    name: 'QA-Learn',
    projectID: 5843212,
    distribution: {
      distributionLabel1: { loadZone: 'amazon:ie:stockholm', percent: 50 },
      distributionLabel2: { loadZone: 'amazon:ie:dublin', percent: 50 },
    },
  },
  scenarios: {
    ui: {
      executor: 'shared-iterations',
      options: {
        broswer: {
          type: 'chromium',
        },
      },
    },
  },
};

// Get Request
export default async function () {
  group('Json Typicode', async () => {
    const page = await browser.newPage();
    const url = 'https://jsonplaceholder.typicode.com/posts';

    await page.goto(url);

    // to see the page use K6_BROWSER_HEADLESS=false k6 run yourscript.js

    check(page, {
      'check page header': (p) =>
        p.locator('#userId').textContent() === 'Jackpot',
    });

    page.locator('input[name="login"]').type('bix');
    page.locator('input[name="password"]').type('pass123');
    await page.locator('input[type=submit]').click();

    page.screenshot({ path: 'screenshot/auth.png' });

    await page.waitForNavigation();
    check(page, {
      'check admin page header': (p) =>
        p.locator('#adminUser').textContent() === 'Welcome admin',
    });

    const params = {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    };

    let res = http.post(url, JSON.stringify(payload), params);

    check(res, {
      'status is 201': (r) => r.status == 201,
      'contains id': (r) => r.json().hasOwnProperty('id'),
      'contains title': (r) => r.json().hasOwnProperty('title'),
      'contains body': (r) => r.json().hasOwnProperty('body'),
      'contains userId': (r) => r.json().hasOwnProperty('userId'),
      'title matches payload': (r) => r.json().title === payload.title,
      'body matches payload': (r) => r.json().body === payload.body,
      'userId matches payload': (r) => r.json().userId === payload.userId,
    });

    sleep(randomIntBetween(1, 3));
  });
}
