import axios from "axios";
import MockAdapter from "axios-mock-adapter";

var Mock = new MockAdapter(axios);
Mock.onGet("/api/lists").reply(200,require("./list.js")); 
