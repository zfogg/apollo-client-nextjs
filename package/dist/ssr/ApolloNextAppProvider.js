"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApolloNextAppProvider = exports.ApolloClientSingleton = void 0;
const React = __importStar(require("react"));
const client_1 = require("@apollo/client");
const RehydrationContext_1 = require("./RehydrationContext");
exports.ApolloClientSingleton = Symbol.for("ApolloClientSingleton");
const ApolloNextAppProvider = ({ makeClient, clientIndex, children, }) => {
    const clientRef = React.useRef();
    const indexRef = React.useRef(clientIndex);
    if (typeof window !== "undefined") {
        if (!clientRef.current || indexRef.current !== clientIndex) {
            clientRef.current = window[exports.ApolloClientSingleton] = makeClient();
            indexRef.current = clientIndex;
        }
    }
    else {
        if (!clientRef.current || indexRef.current !== clientIndex) {
            clientRef.current = makeClient();
            indexRef.current = clientIndex;
        }
    }
    return (React.createElement(client_1.ApolloProvider, { client: clientRef.current },
        React.createElement(RehydrationContext_1.RehydrationContextProvider, null, children)));
};
exports.ApolloNextAppProvider = ApolloNextAppProvider;
//# sourceMappingURL=ApolloNextAppProvider.js.map