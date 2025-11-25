import check from 'k6';
import http from 'k6/http';

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
}
