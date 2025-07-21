import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/node";

import { ARCJET_KEY } from "../config/env.js";

const rateLimit = arcjet({
  key: ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE", "CURL"],
    }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 10,
      capacity: 15,
    }),
  ],
});

export default rateLimit;
