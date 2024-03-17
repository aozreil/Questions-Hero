import AnalyticsBase, { AnalyticsLoginMethod } from "~/models/analytics/AnalyticsBase";

class GoogleAnalytics implements AnalyticsBase {
  trackEvent(eventName: string, eventParams?: Gtag.CustomParams| Gtag.EventParams | Gtag.ControlParams) {
    gtag("event", eventName, eventParams);
  }

  trackLoginEvent(method: string): void {
    this.trackEvent("login", {
      method: method
    });
  }

  trackSignUpEvent(method:AnalyticsLoginMethod): void {
    this.trackEvent("sign_up", {
      method: method
    });
  }

  identifyUserById(userId: string): void {
    gtag('set', 'user_id', userId)
  }

  trackSearchEvent(searchTerm: string): void {
    this.trackEvent("search", {
      search_term: searchTerm
    });
  }
}


export default new GoogleAnalytics();