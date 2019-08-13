import axios from "axios";

export function getFolkList () {
    return axios.get("/api/getlists")
}