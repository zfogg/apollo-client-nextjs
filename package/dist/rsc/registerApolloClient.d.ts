import "server-only";
import type { ApolloClient } from "@apollo/client";
export declare function registerApolloClient(makeClient: () => ApolloClient<any>): {
    getClient: () => ApolloClient<any>;
};
//# sourceMappingURL=registerApolloClient.d.ts.map