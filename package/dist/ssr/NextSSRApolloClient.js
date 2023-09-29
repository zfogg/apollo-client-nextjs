"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NextSSRApolloClient = void 0;
const client_1 = require("@apollo/client");
const graphql_1 = require("graphql");
const cache_1 = require("@apollo/client/cache");
const lateInitializingQueue_1 = require("./lateInitializingQueue");
const ApolloRehydrateSymbols_1 = require("./ApolloRehydrateSymbols");
const ts_invariant_1 = __importDefault(require("ts-invariant"));
function getQueryManager(client) {
    return client["queryManager"];
}
class NextSSRApolloClient extends client_1.ApolloClient {
    constructor(options) {
        super(options);
        this.rehydrationContext = {
            incomingBackgroundQueries: [],
        };
        this.simulatedStreamingQueries = new Map();
        this.registerWindowHook();
    }
    identifyUniqueQuery(options) {
        const transformedDocument = this.documentTransform.transformDocument(options.query);
        const queryManager = getQueryManager(this);
        // Calling `transformDocument` will add __typename but won't remove client
        // directives, so we need to get the `serverQuery`.
        const { serverQuery } = queryManager.getDocumentInfo(transformedDocument);
        if (!serverQuery) {
            throw new Error("could not identify unique query");
        }
        const canonicalVariables = (0, cache_1.canonicalStringify)(options.variables || {});
        const cacheKey = [(0, graphql_1.print)(serverQuery), canonicalVariables].toString();
        return { query: serverQuery, cacheKey, varJson: canonicalVariables };
    }
    registerWindowHook() {
        if (typeof window !== "undefined") {
            if (Array.isArray(window[ApolloRehydrateSymbols_1.ApolloBackgroundQueryTransport] || [])) {
                (0, lateInitializingQueue_1.registerLateInitializingQueue)(ApolloRehydrateSymbols_1.ApolloBackgroundQueryTransport, (options) => {
                    // we are not streaming anymore, so we should not simulate "server-side requests"
                    if (document.readyState === "complete")
                        return;
                    const { query, varJson, cacheKey } = this.identifyUniqueQuery(options);
                    if (!query)
                        return;
                    const printedServerQuery = (0, graphql_1.print)(query);
                    const queryManager = getQueryManager(this);
                    const byVariables = queryManager["inFlightLinkObservables"].get(printedServerQuery) ||
                        new Map();
                    queryManager["inFlightLinkObservables"].set(printedServerQuery, byVariables);
                    if (!byVariables.has(varJson)) {
                        let simulatedStreamingQuery, observable, fetchCancelFn;
                        const cleanup = () => {
                            if (queryManager["fetchCancelFns"].get(cacheKey) === fetchCancelFn)
                                queryManager["fetchCancelFns"].delete(cacheKey);
                            if (byVariables.get(varJson) === observable)
                                byVariables.delete(varJson);
                            if (this.simulatedStreamingQueries.get(cacheKey) ===
                                simulatedStreamingQuery)
                                this.simulatedStreamingQueries.delete(cacheKey);
                        };
                        const promise = new Promise((resolve, reject) => {
                            this.simulatedStreamingQueries.set(cacheKey, (simulatedStreamingQuery = { resolve, reject, options }));
                        });
                        promise.finally(cleanup);
                        byVariables.set(varJson, (observable = new client_1.Observable((observer) => {
                            promise
                                .then((result) => {
                                observer.next(result);
                                observer.complete();
                            })
                                .catch((err) => {
                                observer.error(err);
                            });
                        })));
                        queryManager["fetchCancelFns"].set(cacheKey, (fetchCancelFn = (reason) => {
                            var _a;
                            const { reject } = (_a = this.simulatedStreamingQueries.get(cacheKey)) !== null && _a !== void 0 ? _a : {};
                            if (reject) {
                                reject(reason);
                            }
                            cleanup();
                        }));
                    }
                });
                if (document.readyState !== "complete") {
                    const rerunSimulatedQueries = () => {
                        const queryManager = getQueryManager(this);
                        // streaming finished, so we need to refire all "server-side requests"
                        // that are still not resolved on the browser side to make sure we have all the data
                        for (const [cacheKey, queryInfo] of this
                            .simulatedStreamingQueries) {
                            this.simulatedStreamingQueries.delete(cacheKey);
                            ts_invariant_1.default.debug("streaming connection closed before server query could be fully transported, rerunning:", queryInfo.options);
                            const queryId = queryManager.generateQueryId();
                            queryManager
                                .fetchQuery(queryId, Object.assign(Object.assign({}, queryInfo.options), { context: Object.assign(Object.assign({}, queryInfo.options.context), { queryDeduplication: false }) }))
                                .finally(() => queryManager.stopQuery(queryId))
                                .then(queryInfo.resolve, queryInfo.reject);
                        }
                    };
                    // happens simulatenously to `readyState` changing to `"complete"`, see
                    // https://html.spec.whatwg.org/multipage/parsing.html#the-end (step 9.1 and 9.5)
                    window.addEventListener("load", rerunSimulatedQueries, {
                        once: true,
                    });
                }
            }
            if (Array.isArray(window[ApolloRehydrateSymbols_1.ApolloResultCache] || [])) {
                (0, lateInitializingQueue_1.registerLateInitializingQueue)(ApolloRehydrateSymbols_1.ApolloResultCache, (data) => {
                    var _a;
                    const { cacheKey } = this.identifyUniqueQuery(data);
                    const { resolve } = (_a = this.simulatedStreamingQueries.get(cacheKey)) !== null && _a !== void 0 ? _a : {};
                    if (resolve) {
                        resolve({
                            data: data.result,
                        });
                    }
                    // In order to avoid a scenario where the promise resolves without
                    // a query subscribing to the promise, we immediately call
                    // `cache.write` here.
                    // For more information, see: https://github.com/apollographql/apollo-client-nextjs/pull/38/files/388813a16e2ac5c62408923a1face9ae9417d92a#r1229870523
                    this.cache.write(data);
                });
            }
        }
    }
    watchQuery(options) {
        if (typeof window == "undefined") {
            if (options.fetchPolicy !== "cache-only" &&
                options.fetchPolicy !== "standby") {
                this.rehydrationContext.incomingBackgroundQueries.push(options);
            }
        }
        const result = super.watchQuery(options);
        return result;
    }
    setRehydrationContext(rehydrationContext) {
        if (rehydrationContext.incomingBackgroundQueries !==
            this.rehydrationContext.incomingBackgroundQueries)
            rehydrationContext.incomingBackgroundQueries.push(...this.rehydrationContext.incomingBackgroundQueries.splice(0));
        this.rehydrationContext = rehydrationContext;
    }
}
exports.NextSSRApolloClient = NextSSRApolloClient;
//# sourceMappingURL=NextSSRApolloClient.js.map