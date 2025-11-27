/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */
import axios from "axios";
export var ContentType;
(function (ContentType) {
    ContentType["Json"] = "application/json";
    ContentType["JsonApi"] = "application/vnd.api+json";
    ContentType["FormData"] = "multipart/form-data";
    ContentType["UrlEncoded"] = "application/x-www-form-urlencoded";
    ContentType["Text"] = "text/plain";
})(ContentType || (ContentType = {}));
export class HttpClient {
    constructor({ securityWorker, secure, format, ...axiosConfig } = {}) {
        this.securityData = null;
        this.setSecurityData = (data) => {
            this.securityData = data;
        };
        this.request = async ({ secure, path, type, query, format, body, ...params }) => {
            const secureParams = ((typeof secure === "boolean" ? secure : this.secure) &&
                this.securityWorker &&
                (await this.securityWorker(this.securityData))) ||
                {};
            const requestParams = this.mergeRequestParams(params, secureParams);
            const responseFormat = format || this.format || undefined;
            if (type === ContentType.FormData &&
                body &&
                body !== null &&
                typeof body === "object") {
                body = this.createFormData(body);
            }
            if (type === ContentType.Text &&
                body &&
                body !== null &&
                typeof body !== "string") {
                body = JSON.stringify(body);
            }
            return this.instance.request({
                ...requestParams,
                headers: {
                    ...(requestParams.headers || {}),
                    ...(type ? { "Content-Type": type } : {}),
                },
                params: query,
                responseType: responseFormat,
                data: body,
                url: path,
            });
        };
        this.instance = axios.create({
            ...axiosConfig,
            baseURL: axiosConfig.baseURL || "",
        });
        this.secure = secure;
        this.format = format;
        this.securityWorker = securityWorker;
    }
    mergeRequestParams(params1, params2) {
        const method = params1.method || (params2 && params2.method);
        return {
            ...this.instance.defaults,
            ...params1,
            ...(params2 || {}),
            headers: {
                ...((method &&
                    this.instance.defaults.headers[method.toLowerCase()]) ||
                    {}),
                ...(params1.headers || {}),
                ...((params2 && params2.headers) || {}),
            },
        };
    }
    stringifyFormItem(formItem) {
        if (typeof formItem === "object" && formItem !== null) {
            return JSON.stringify(formItem);
        }
        else {
            return `${formItem}`;
        }
    }
    createFormData(input) {
        if (input instanceof FormData) {
            return input;
        }
        return Object.keys(input || {}).reduce((formData, key) => {
            const property = input[key];
            const propertyContent = property instanceof Array ? property : [property];
            for (const formItem of propertyContent) {
                const isFileType = formItem instanceof Blob || formItem instanceof File;
                formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
            }
            return formData;
        }, new FormData());
    }
}
/**
 * @title API Demo
 * @version 1.0
 * @contact
 *
 * Simple API with Users and Posts
 */
export class Api extends HttpClient {
    constructor() {
        super(...arguments);
        this.users = {
            /**
             * No description
             *
             * @tags users
             * @name FindAll
             * @summary Get all users
             * @request GET:/users
             */
            findAll: (params = {}) => this.request({
                path: `/users`,
                method: "GET",
                format: "json",
                ...params,
            }),
            /**
             * No description
             *
             * @tags users
             * @name Create
             * @summary Create a new user
             * @request POST:/users
             */
            create: (data, params = {}) => this.request({
                path: `/users`,
                method: "POST",
                body: data,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),
            /**
             * No description
             *
             * @tags users
             * @name FindOne
             * @summary Get a user by id
             * @request GET:/users/{id}
             */
            findOne: ({ id, ...query }, params = {}) => this.request({
                path: `/users/${id}`,
                method: "GET",
                format: "json",
                ...params,
            }),
        };
        this.posts = {
            /**
             * No description
             *
             * @tags posts
             * @name FindAll
             * @summary Get all posts
             * @request GET:/posts
             */
            findAll: (params = {}) => this.request({
                path: `/posts`,
                method: "GET",
                format: "json",
                ...params,
            }),
            /**
             * No description
             *
             * @tags posts
             * @name Create
             * @summary Create a new post
             * @request POST:/posts
             */
            create: (data, params = {}) => this.request({
                path: `/posts`,
                method: "POST",
                body: data,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),
            /**
             * No description
             *
             * @tags posts
             * @name FindOne
             * @summary Get a post by id
             * @request GET:/posts/{id}
             */
            findOne: ({ id, ...query }, params = {}) => this.request({
                path: `/posts/${id}`,
                method: "GET",
                format: "json",
                ...params,
            }),
        };
    }
}
