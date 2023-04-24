"use client";

import { byEnv } from "@apollo/experimental-nextjs-app-support";
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  SuspenseCache,
} from "@apollo/client";
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { setVerbosity } from "ts-invariant";

setVerbosity("debug");

function makeClient() {
  const httpLink = new HttpLink({
    uri: "http://localhost:3000/api/graphql",
    fetchOptions: { cache: "no-store" },
  });

  return new ApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: byEnv({
      SSR: () =>
        ApolloLink.from([
          new SSRMultipartLink({
            stripDefer: true,
          }),
          httpLink,
        ]),
      default: () => httpLink,
    }),
  });
}

function makeSuspenseCache() {
  return new SuspenseCache();
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider
      makeClient={makeClient}
      makeSuspenseCache={makeSuspenseCache}
    >
      {children}
    </ApolloNextAppProvider>
  );
}
