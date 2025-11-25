import { check, group, sleep } from 'k6';
import http from 'k6/http';
import { Counter } from 'k6/metrics';

// For threshholds
export const options = {
  vus: 10,
  duration: '5s',
  thresholds: {
    http_req_duration: ['p(95)<250'],
    // for error pages
    'http_req_duration{expected_response:true}': ['p(95)<250'],
    'group_duration{group:::Main Page}': ['p(95)<1000'],
    'group_duration{group:::Main Page::Assets}': ['p(95)<1000'],
    checks: ['rate<99.9'],
  },
};

let httpErrors = new Counter('http_errors');

export default function () {
  group('Main Page', function () {
    let res = http.get('https://www.betika.com/en-ke/');

    group('Assets', () => {
      http.get(
        'https://www.betika.com/en-ke/static/css/variables.css?v=1763987636079'
      );
      http.get('https://www.betika.com/en-ke/static/css/app.css');
      http.get('https://www.betika.com/en-ke/static/js/init.js');
      http.get('https://www.betika.com/en-ke/static/js/socket.io.js');
    });

    if (res.error) {
      httpErrors.add(1);
    }

    check(res, {
      'status is 200': (r) => r.status === 200,
    });
  });

  group('Live Page', () => {
    let live = http.get('https://www.betika.com/en-ke/live');

    group('Assets', () => {
      http.get(
        'https://www.betika.com/en-ke/static/css/variables.css?v=1763987636079'
      );
      http.get('https://www.betika.com/en-ke/static/css/app.css');
      http.get('https://www.betika.com/en-ke/static/js/init.js');
    });

    if (live.error) {
      httpErrors.add(1);
    }

    check(live, {
      'live status is 200': (r) => r.status === 200,
    });
  });

  sleep(1);
}
