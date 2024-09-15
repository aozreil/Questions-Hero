import GoogleAnalytics from "~/models/analytics/googleAnalytics";
import AnalyticsBase, {
  AnalyticsLoginMethod,
} from "~/models/analytics/AnalyticsBase";
import SmartlookAnalytics from "~/models/analytics/smartlookAnalytics";

export function useAnalytics() {
  const analytics: AnalyticsBase[] = [GoogleAnalytics, SmartlookAnalytics];

  function trackEvent(eventName: string, params?: { [key: string]: unknown }) {
    analytics.forEach((el) => {
      try {
        el.trackEvent(eventName, params);
      } catch (e) {
        console.error(e);
      }
    });
  }

  function trackLoginEvent(method: AnalyticsLoginMethod) {
    analytics.forEach((el) => {
      try {
        el.trackLoginEvent(method);
      } catch (e) {
        console.error(e);
      }
    });
  }

  function trackSignUpEvent(method: AnalyticsLoginMethod) {
    analytics.forEach((el) => {
      try {
        el.trackSignUpEvent(method);
      } catch (e) {
        console.error(e);
      }
    });
  }

  function identifyUserById(userId: string) {
    analytics.forEach((el) => {
      try {
        el.identifyUserById(userId);
      } catch (e) {
        /* empty */
      }
    });
  }

  return {
    identifyUserById,
    trackEvent,
    trackLoginEvent,
    trackSignUpEvent,
  };
}
