import { check, group, sleep } from 'k6';
import http from 'k6/http';
import { Counter } from 'k6/metrics';
import exec from 'k6/execution'

// Options
export const options = {
  vus: 10,
  duration: '5s',
};


// 1. Initial Stage
//  imports low level header files
//  has option variable, and if not defined and exported, k6 will not know about it.
console.log('---init stage---')

// 2. Set-up stage
// can be used for env setup, call an api to make sure it is ready etc
// when you are doing something in the setup, the rest of the code will not run.
// setup() function will only be called once per test execution
// you can pass data or information from setup() func to default func
export function setup(){
  console.log('---setup stage---')
  const data = {'foo': 'bar'};
  let res = http.get("https://test.k6.local.status");
  if(res.error){
    exec.test.abort("Aborting test. Application is DOWN");
  }
}


// 3. VU stage
export default function(data){
  console.log('---VU stage---')
  console.log(data)
  sleep(1);
}


// 4. Teardown stage
// used for cleaning up things
// can be api calls e.t.c
// tear down can also receive some information like default
// it is only called once per test execution
export function teardown(){
  console.log('---teardown stage---')
}


// Aborting Test Execution




