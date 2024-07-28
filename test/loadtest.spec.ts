import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  // duration: '30s',
  thresholds: {
    http_req_blocked: ['p(100)<=30'],
    http_req_connecting: ['p(90)<100'],
    http_req_duration: ['p(90)<1000'],
    http_req_failed: ['rate<0.1'],
    http_req_receiving: ['p(90)<50'],
    http_req_sending: ['p(90)<10'],
  },
  tags: {
    environment: 'production',
  },
  stages: [
    { duration: '10s', target: 100 },
    { duration: '20s', target: 200 },
  ],
};

export default function () {
  const res = http.put(
    'http://localhost:3000/pelanggan/2',
    JSON.stringify({
      // username: `User-${__VU}-${__ITER}`,
      // password: `password`,
      // email: `user${__VU}-${__ITER}@verni.yt`,
      nama: `User-${__VU}-${__ITER}`,
    }),
    // { headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsInVzZXJuYW1lIjoicm92aW5vIiwicm9sZSI6InBlbGFuZ2dhbiIsInBpY3R1cmUiOiJmZWE4NjQwMi0wOTRjLTQyYzItYjc5MS0xNDlhZTAyY2Y1YzkuanBnIiwiZW1haWwiOiJyb3Zpbm9AdmVybmkueXQiLCJpYXQiOjE3MjIwMTAxMjMsImV4cCI6MTcyMjA5NjUyM30.O7lue-zSNEkX-oYqhLpbwY-xl0wa3wGjv8w8t7bo7k0' } },
    { headers: { 'Content-Type': 'application/json',Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsInVzZXJuYW1lIjoicm92aW5vIiwicm9sZSI6InBlbGFuZ2dhbiIsInBpY3R1cmUiOiJmZWE4NjQwMi0wOTRjLTQyYzItYjc5MS0xNDlhZTAyY2Y1YzkuanBnIiwiZW1haWwiOiJyb3Zpbm9AdmVybmkueXQiLCJpYXQiOjE3MjIwMTAxMjMsImV4cCI6MTcyMjA5NjUyM30.O7lue-zSNEkX-oYqhLpbwY-xl0wa3wGjv8w8t7bo7k0' } },
  );
  check(res, { 'Status was 201: ': (r) => [200, 201].includes(r.status) });
  sleep(1);
}