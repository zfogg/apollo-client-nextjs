import * as React from "react";
import { ApolloClient } from "@apollo/client";
export declare const ApolloClientSingleton: unique symbol;
declare global {
    interface Window {
        [ApolloClientSingleton]?: ApolloClient<any>;
    }
}
export declare const ApolloNextAppProvider: ({ makeClient, clientIndex, children, }: React.PropsWithChildren<{
    makeClient: () => ApolloClient<any>;
    clientIndex: string;
}>) => React.JSX.Element;
//# sourceMappingURL=ApolloNextAppProvider.d.ts.map