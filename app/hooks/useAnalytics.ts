import GoogleAnalytics from "~/models/analytics/googleAnalytics";
import AnalyticsBase, { AnalyticsLoginMethod } from "~/models/analytics/AnalyticsBase";

export function useAnalytics() {

  const analytics: AnalyticsBase[] = [GoogleAnalytics];

  function trackEvent(eventName: string, params?: { [key: string]: unknown }) {
    analytics.forEach(el => {
      try {
        el.trackEvent(eventName, params);
      } catch (e) {
        console.error(e);
      }
    });
  }

  function trackLoginEvent(method: AnalyticsLoginMethod) {
    analytics.forEach(el => {
      try {
        el.trackLoginEvent(method);
      } catch (e) {
        console.error(e);
      }
    });
  }

  function trackSignUpEvent(method: AnalyticsLoginMethod) {
    analytics.forEach(el => {
      try {
        el.trackSignUpEvent(method);
      } catch (e) {
        console.error(e);
      }
    });
  }

  function identifyUserById(userId: string) {
    analytics.forEach(el => {
      try {
        el.identifyUserById(userId);
      } catch (e) {
        console.error(e);
      }
    });
  }

  function trackSearchEvent(searchTerm: string) {
    analytics.forEach(el => {
      try {
        el.trackSearchEvent(searchTerm);
      } catch (e) {
        console.error(e);
      }
    });
  }


  return {
    identifyUserById,
    trackEvent,
    trackLoginEvent,
    trackSignUpEvent,
    trackSearchEvent
  };
}