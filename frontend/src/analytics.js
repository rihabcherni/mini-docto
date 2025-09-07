import ReactGA from "react-ga4";

const GA_MEASUREMENT_ID = "G-84GC2HJC33";

export const initGA = () => {
  ReactGA.initialize(GA_MEASUREMENT_ID);
};

export const logPageView = (pagePath) => {
  ReactGA.send({ hitType: "pageview", page: pagePath });
};

export const logEvent = (category, action, label) => {
  ReactGA.event({
    category,
    action,
    label,
  });
};

export const logSessionDuration = (startTime, userEmail) => {
  const durationSec = Math.floor((Date.now() - startTime) / 1000);
  logEvent("Session", "duration", `${userEmail || "user"} - ${durationSec}s`);
};
