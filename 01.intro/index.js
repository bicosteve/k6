import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '10s',
};

export default function () {
  let baseURL = 'https://jsonplaceholder.typicode.com/';
  const url = `${baseURL}posts`;

  const payload = JSON.stringify({
    title: 'foo',
    body: 'bar',
    userId: 1,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status is 201': (r) => r.status === 201,
    'body has id': (r) => JSON.parse(r.body).id !== undefined,
  });
}
