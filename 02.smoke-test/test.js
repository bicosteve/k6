import { sleep } from 'k6';
import http from 'k6/http';

export const options = {
  vus: 1,
  duration: '10s',
};

export default function () {
  http.get('https://jsonplaceholder.typicode.com/posts');
  // sleep imitates how a real user will make requests to a server
  sleep(1);
  http.get('https://jsonplaceholder.typicode.com/posts/1');
  sleep(2);
}
