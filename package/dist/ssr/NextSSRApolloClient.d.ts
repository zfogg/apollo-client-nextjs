import { ApolloClient, ApolloClientOptions, OperationVariables, WatchQueryOptions } from "@apollo/client";
import { RehydrationContextValue } from "./types";
export declare class NextSSRApolloClient<TCacheShape> extends ApolloClient<TCacheShape> {
    private rehydrationContext;
    constructor(options: ApolloClientOptions<TCacheShape>);
    private simulatedStreamingQueries;
    private identifyUniqueQuery;
    private registerWindowHook;
    watchQuery<T = any, TVariables extends OperationVariables = OperationVariables>(options: WatchQueryOptions<TVariables, T>): import("@apollo/client").ObservableQuery<T, TVariables>;
    setRehydrationContext(rehydrationContext: RehydrationContextValue): void;
}
//# sourceMappingURL=NextSSRApolloClient.d.ts.map