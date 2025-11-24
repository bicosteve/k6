import { sleep } from 'k6';
import http from 'k6/http';

export const options = {
  stages: [
    {
      duration: '30s',
      target: 100,
    },
    {
      duration: '240s',
      target: 100,
    },
    {
      duration: '30s',
      target: 0,
    },
  ],
};

export default function () {
  http.get('https://test.k6.io');
  // sleep imitates how a real user will make requests to a server
  sleep(1);
  http.get('https://test.k6.io/contacts.php');
  sleep(2);
  http.get('https://test.k6.io/news.php');
  sleep(2);
}
