import { RehydrationCache } from "./types";
import { Cache, WatchQueryOptions } from "@apollo/client";
export type DataTransport<T> = Array<T> | {
    push(...args: T[]): void;
};
type DataToTransport = {
    rehydrate: RehydrationCache;
    results: Cache.WriteOptions[];
    backgroundQueries: WatchQueryOptions[];
};
/**
 * Returns a string of JavaScript that can be used to transport data to the client.
 */
export declare function transportDataToJS(data: DataToTransport): string;
/**
 * Registers a lazy queue that will be filled with data by `transportDataToJS`.
 * All incoming data will be added either to the rehydration cache or the result cache.
 */
export declare function registerDataTransport(): void;
export {};
//# sourceMappingURL=dataTransport.d.ts.map