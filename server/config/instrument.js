import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://2bce14aa44db7f866b80453de2a8c7ef@o4511219172376576.ingest.us.sentry.io/4511219181158400", 
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