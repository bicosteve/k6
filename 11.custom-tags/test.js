import { check, sleep } from 'k6';
import http from 'k6/http';
import { Counter } from 'k6/metrics';

// For threshholds
export const options = {
  vus: 1000,
  duration: '5s',
  thresholds: {
    http_req_duration: ['p(95)<250'],
    // tags in action
    'http_req_duration{status:200}': ['max<2000'],
    // 'http_req_duration{status:201}': ['max<2000'],
    // custom tags
    'http_req_duration{page:user}': ['max<2000'],
    http_req_failed: ['rate<0.01'],
    http_errors: ['count<0.01'],
    'checks{page:user}': ['rate>0.99'],
    'http_errors{page:live}': ['count==0'],
  },
};

let httpErrors = new Counter('http_errors');

export default function () {
  let res = http.get('https://www.betika.com/en-ke/');

  if (res.error) {
    httpErrors.add(1);
  }

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  res = http.get('https://www.betika.com/en-ke/live', {
    tags: {
      page: 'user',
    },
  });

  if (res.error) {
    httpErrors.add(1, { page: 'live' });
  }

  check(
    res,
    {
      'status is 200': (r) => r.status === 200,
    },
    { page: 'user' }
  );

  sleep(1);
}
