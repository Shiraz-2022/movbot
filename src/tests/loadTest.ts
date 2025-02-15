import http from "k6/http";
import { check, sleep } from "k6";
import { Options } from "k6/options";

export const options: Options = {
  vus: 100,
  duration: "30s",
};

export default function (): void {
  const url: string = "http://localhost:3000/api/openai/chat";

  const payload: string = JSON.stringify({
    character: "MARK",
    userMessage: "Let's start a startup?",
    movieName: "The social network",
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    "is status 200": (r) => r.status === 200,
  });

  sleep(1);
}
