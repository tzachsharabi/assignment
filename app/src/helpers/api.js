import axios from "axios";
import addresses from "../src-config/addresses.js";

export default class Api {
    constructor() {
        this.client = null;
        this.api_url = addresses.reactApiEndpoint;
    }

    init = () => {
        let headers = {
            Accept: "application/json",
        };

        this.client = axios.create({
            baseURL: this.api_url,
            timeout: 31000,
            headers: headers,
        });

        return this.client;
    };

    getSessions = () => {
        return this.init().get("/server/getSessions");
    };
}
