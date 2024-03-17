export type AnalyticsLoginMethod = "Google" | "Apple";

export default abstract class AnalyticsBase {
  abstract trackEvent(eventName: string, body?: { [key: string]: unknown }): void;

  abstract trackLoginEvent(method: AnalyticsLoginMethod): void;

  abstract trackSignUpEvent(method: AnalyticsLoginMethod): void;

  abstract identifyUserById(userId: string): void;

  abstract trackSearchEvent(searchTerm: string): void;
}