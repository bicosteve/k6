import check from 'k6';
import http from 'k6/http';

import { payload } from './payload.js';

// Options
export const options = {
  vus: 10,
  duration: '5s',
};

// Get Request
export default function () {
  let res = http.get('https://api.spoonacular.com/recipes/complexSearch');

  res = http.get(
    'https://api.spoonacular.com/recipes/1003464/equipmentWidget.json'
  );

  const jsonRes = res.json();

  // getting headers
  console.log(res.headers.Allow);
  console.log(res.headers['Content-Type']);

  check(res, {
    'status is 200': (r) => r.status === 200,
    '1st name is `pie form`': (r) => r.json().equipment[0].name === 'pie form',
  });

  // Making Post Requests
  const url = 'https://api.jsonplaceholder.dev';

  //

  const body = JSON.stringify(payload);
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  res = http.post(url, body, params);
  console.log(res.json());

  check(res, {
    'status is 201': (r) => r.status == 201,
    'contains name': (r) => r.json().includes('name'),
    'contains street': (r) => r.json().includes('street'),
  });

  // Token Based API Authentications
  http.get(url, {
    headers: {
      Authorization: 'Bearer ' + 'some-access-token',
    },
  });

  // Token Based Resource Creation
  res = http.post(url, body, {
    headers: {
      Authorization: 'Bearer ' + 'some-token',
      'Content-Type': 'application/json',
    },
  });

  let userId = 1;

  // Token Based Resource Retrieve
  res = http.get(`${url}/${userId}/todos`, {
    headers: {
      Authorization: 'Bearer ' + 'some-token',
      'Content-Type': 'application/json',
    },
  });

  // Put Requests -> for updating resources.
  res = http.put(url, body, {
    headers: {
      Authorization: 'Bearer ' + 'some-token',
      'Content-Type': 'application/json',
    },
  });

  // Patch Requests -> for updating a few (some) fields.
  res = http.patch(url, body, {
    headers: {
      Authorization: 'Bearer ' + 'some-token',
      'Content-Type': 'application/json',
    },
  });

  // Delete Requests
  res = http.del(`${url}/${userId}/todos`, null, {
    headers: {
      Authorization: 'Bearer ' + 'some-token',
      'Content-Type': 'application/json',
    },
  });
}
