import { sleep } from 'k6';
import http from 'k6/http';

export const options = {
  stages: [
    {
      duration: '4m', // make it very high
      target: 1000000, // make it abnormally high, something that app wont be able to handle.
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
