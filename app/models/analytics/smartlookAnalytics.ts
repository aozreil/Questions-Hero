import AnalyticsBase, {
  AnalyticsLoginMethod,
} from "~/models/analytics/AnalyticsBase";
import Smartlook from "smartlook-client";

class SmartlookAnalytics implements AnalyticsBase {
  trackEvent(
    eventName: string,
    eventParams: {
      [key: string]: string | number | boolean;
    },
  ) {
    Smartlook.track(eventName, eventParams);
  }

  trackLoginEvent(method: string): void {
    this.trackEvent("login", {
      method: method,
    });
  }

  trackSignUpEvent(method: AnalyticsLoginMethod): void {
    this.trackEvent("sign_up", {
      method: method,
    });
  }

  identifyUserById(userId: string): void {
    Smartlook.identify(userId, {});
  }
}

export default new SmartlookAnalytics();
