import { sleep } from 'k6';
import http from 'k6/http';

export const options = {
  stages: [
    {
      duration: '4m', // ramp up
      target: 1000,
    },
    {
      duration: '4hrs', // steady
      target: 10000000,
    },
    {
      duration: '5min', // ramp down
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
