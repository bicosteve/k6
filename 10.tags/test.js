import http from 'k6/http';

// For threshholds
export const options = {
  vus: 5,
  duration: '5s',
  thresholds: {
    http_req_duration: ['p(95)<250'],
    // tags in action
    'http_req_duration{status:200}': ['max<2000'],
    'http_req_duration{status:201}': ['max<2000'],
  },
};

export default function () {
  http.get('https://reqres.in/api/users?page=1');
  http.get('https://reqres.in/api/users/1');
}
