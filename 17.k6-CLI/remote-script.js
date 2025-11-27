import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { check, group, sleep } from 'k6';
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
};

// Get Request
export default function () {
  group('Json Typicode', () => {
    const url = 'https://jsonplaceholder.typicode.com/posts';

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
