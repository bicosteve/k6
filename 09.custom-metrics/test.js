import { check, sleep } from 'k6';
import exec from 'k6/execution';
import http from 'k6/http';
import { Counter, Trend } from 'k6/metrics';

// For threshholds
export const options = {
  vus: 5,
  duration: '5s',
  thresholds: {
    http_req_duration: ['p(95)<250'],
    http_req_duration: ['max<2000'],
    http_reqs: ['count>20'],
    http_reqs: ['rate>4'],
    vus: ['value>4'],
    http_req_failed: ['rate<0.01'],
    http_req_failed: ['rate<5'],
    checks: ['rate>=0.98'],
    my_counter: ['count>10'],
    response_time_news_page: ['p(95)<150', 'p(99)<250'],
  },
};

let myCounter = new Counter('my_counter');
let newsPageResponseTrend = new Trend('response_time_news_page');

export default function () {
  // 1. http requests
  let res = http.get('https://test.k6.io');
  myCounter.add(1);
  // will count the number of time this function ran
  // Using exec
  console.log(exec.scenario.iterationInTest);
  // returns the number of iterations

  // check status code
  // console.log(res.status);

  // 2. Writing assertations
  check(true, {
    'true is true': (value) => value == true,
  });

  // 3. Validating responses
  check(res, {
    'status is 200': (res) => res.status === 200,
  });

  // 4. Check page contains values
  check(res, {
    'check the body': (r) => r.body.includes('Collection of simple web-pages.'),
  });

  // 5. Configuring threshholds
  sleep(2);

  // Using Metrics
  res = http.get('https://test.k6.io/news.php');
  newsPageResponseTrend.add(res.timings.duration);
  // checks duration of this request
  sleep(1);
}
