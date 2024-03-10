import type { ReactNode } from "react";

import { createContext, useContext } from "react";

type Props = { isBot: boolean; children: ReactNode };

const BotContext = createContext(false);

export function useIsBot() {
  return useContext(BotContext) ?? false;
}

export function IsBotProvider({ isBot, children }: Props) {
  return <BotContext.Provider  value={isBot}>{children}</BotContext.Provider>;
}