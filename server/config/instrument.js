import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn:process.env.SENTRY_DSN,
  integrations: [
    nodeProfilingIntegration(),
    Sentry.mongooseIntegration()
  ],

  // Performance Monitoring
  // tracesSampleRate: 1.0, // adjust in production (e.g. 0.2)

  // Profiling
  profilesSampleRate: 1.0,

  environment: process.env.NODE_ENV || "development",
});

export default Sentry;