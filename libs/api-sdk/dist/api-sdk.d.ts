export interface User {
    id: string;
    name: string;
    email: string;
}
export interface CreateUserDto {
    name: string;
    email: string;
}
export interface PostEntity {
    id: string;
    title: string;
    content: string;
    authorId: number;
}
export interface CreatePostDto {
    title: string;
    content: string;
    authorId: number;
}
export type FindAllData = User[];
export type CreateData = User;
export interface FindOneParams {
    id: string;
}
export type FindOneData = User;
export type FindAllResult = PostEntity[];
export type CreateResult = PostEntity;
export interface FindOneParams2 {
    id: string;
}
export type FindOneResult = PostEntity;
export declare namespace Users {
    /**
     * No description
     * @tags users
     * @name FindAll
     * @summary Get all users
     * @request GET:/users
     */
    namespace FindAll {
        type RequestParams = {};
        type RequestQuery = {};
        type RequestBody = never;
        type RequestHeaders = {};
        type ResponseBody = FindAllData;
    }
    /**
     * No description
     * @tags users
     * @name Create
     * @summary Create a new user
     * @request POST:/users
     */
    namespace Create {
        type RequestParams = {};
        type RequestQuery = {};
        type RequestBody = CreateUserDto;
        type RequestHeaders = {};
        type ResponseBody = CreateData;
    }
    /**
     * No description
     * @tags users
     * @name FindOne
     * @summary Get a user by id
     * @request GET:/users/{id}
     */
    namespace FindOne {
        type RequestParams = {
            id: string;
        };
        type RequestQuery = {};
        type RequestBody = never;
        type RequestHeaders = {};
        type ResponseBody = FindOneData;
    }
}
export declare namespace Posts {
    /**
     * No description
     * @tags posts
     * @name FindAll
     * @summary Get all posts
     * @request GET:/posts
     */
    namespace FindAll {
        type RequestParams = {};
        type RequestQuery = {};
        type RequestBody = never;
        type RequestHeaders = {};
        type ResponseBody = FindAllResult;
    }
    /**
     * No description
     * @tags posts
     * @name Create
     * @summary Create a new post
     * @request POST:/posts
     */
    namespace Create {
        type RequestParams = {};
        type RequestQuery = {};
        type RequestBody = CreatePostDto;
        type RequestHeaders = {};
        type ResponseBody = CreateResult;
    }
    /**
     * No description
     * @tags posts
     * @name FindOne
     * @summary Get a post by id
     * @request GET:/posts/{id}
     */
    namespace FindOne {
        type RequestParams = {
            id: string;
        };
        type RequestQuery = {};
        type RequestBody = never;
        type RequestHeaders = {};
        type ResponseBody = FindOneResult;
    }
}
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, ResponseType } from "axios";
export type QueryParamsType = Record<string | number, any>;
export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
    /** set parameter to `true` for call `securityWorker` for this request */
    secure?: boolean;
    /** request path */
    path: string;
    /** content type of request body */
    type?: ContentType;
    /** query params */
    query?: QueryParamsType;
    /** format of response (i.e. response.json() -> format: "json") */
    format?: ResponseType;
    /** request body */
    body?: unknown;
}
export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;
export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
    securityWorker?: (securityData: SecurityDataType | null) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
    secure?: boolean;
    format?: ResponseType;
}
export declare enum ContentType {
    Json = "application/json",
    JsonApi = "application/vnd.api+json",
    FormData = "multipart/form-data",
    UrlEncoded = "application/x-www-form-urlencoded",
    Text = "text/plain"
}
export declare class HttpClient<SecurityDataType = unknown> {
    instance: AxiosInstance;
    private securityData;
    private securityWorker?;
    private secure?;
    private format?;
    constructor({ securityWorker, secure, format, ...axiosConfig }?: ApiConfig<SecurityDataType>);
    setSecurityData: (data: SecurityDataType | null) => void;
    protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig;
    protected stringifyFormItem(formItem: unknown): string;
    protected createFormData(input: Record<string, unknown>): FormData;
    request: <T = any, _E = any>({ secure, path, type, query, format, body, ...params }: FullRequestParams) => Promise<AxiosResponse<T>>;
}
/**
 * @title API Demo
 * @version 1.0
 * @contact
 *
 * Simple API with Users and Posts
 */
export declare class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
    users: {
        /**
         * No description
         *
         * @tags users
         * @name FindAll
         * @summary Get all users
         * @request GET:/users
         */
        findAll: (params?: RequestParams) => Promise<AxiosResponse<FindAllData, any, {}>>;
        /**
         * No description
         *
         * @tags users
         * @name Create
         * @summary Create a new user
         * @request POST:/users
         */
        create: (data: CreateUserDto, params?: RequestParams) => Promise<AxiosResponse<User, any, {}>>;
        /**
         * No description
         *
         * @tags users
         * @name FindOne
         * @summary Get a user by id
         * @request GET:/users/{id}
         */
        findOne: ({ id, ...query }: FindOneParams, params?: RequestParams) => Promise<AxiosResponse<User, any, {}>>;
    };
    posts: {
        /**
         * No description
         *
         * @tags posts
         * @name FindAll
         * @summary Get all posts
         * @request GET:/posts
         */
        findAll: (params?: RequestParams) => Promise<AxiosResponse<FindAllResult, any, {}>>;
        /**
         * No description
         *
         * @tags posts
         * @name Create
         * @summary Create a new post
         * @request POST:/posts
         */
        create: (data: CreatePostDto, params?: RequestParams) => Promise<AxiosResponse<PostEntity, any, {}>>;
        /**
         * No description
         *
         * @tags posts
         * @name FindOne
         * @summary Get a post by id
         * @request GET:/posts/{id}
         */
        findOne: ({ id, ...query }: FindOneParams2, params?: RequestParams) => Promise<AxiosResponse<PostEntity, any, {}>>;
    };
}
