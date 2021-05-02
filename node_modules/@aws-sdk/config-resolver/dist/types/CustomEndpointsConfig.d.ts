import { Endpoint, Provider, UrlParser } from "@aws-sdk/types";
export interface CustomEndpointsInputConfig {
    /**
     * The fully qualified endpoint of the webservice.
     */
    endpoint: string | Endpoint | Provider<Endpoint>;
    /**
     * Whether TLS is enabled for requests.
     */
    tls?: boolean;
}
interface PreviouslyResolved {
    urlParser: UrlParser;
}
export interface CustomEndpointsResolvedConfig extends Required<CustomEndpointsInputConfig> {
    endpoint: Provider<Endpoint>;
    isCustomEndpoint: true;
}
export declare const resolveCustomEndpointsConfig: <T>(input: T & CustomEndpointsInputConfig & PreviouslyResolved) => T & CustomEndpointsResolvedConfig;
export {};
