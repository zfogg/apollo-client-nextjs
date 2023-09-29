"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetNextSSRApolloSingletons = void 0;
const ApolloNextAppProvider_1 = require("./ApolloNextAppProvider");
const ApolloRehydrateSymbols_1 = require("./ApolloRehydrateSymbols");
/**
 * Resets the singleton instances created for the Apollo SSR data transport and caches.
 *
 * To be used in testing only, like
 * ```ts
 * afterEach(resetNextSSRApolloSingletons);
 * ```
 */
function resetNextSSRApolloSingletons() {
    delete window[ApolloRehydrateSymbols_1.ApolloRehydrationCache];
    delete window[ApolloRehydrateSymbols_1.ApolloResultCache];
    delete window[ApolloRehydrateSymbols_1.ApolloSSRDataTransport];
    delete window[ApolloRehydrateSymbols_1.ApolloBackgroundQueryTransport];
    delete window[ApolloNextAppProvider_1.ApolloClientSingleton];
}
exports.resetNextSSRApolloSingletons = resetNextSSRApolloSingletons;
//# sourceMappingURL=testHelpers.js.map