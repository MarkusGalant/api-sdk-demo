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

export namespace Users {
  /**
   * No description
   * @tags users
   * @name FindAll
   * @summary Get all users
   * @request GET:/users
   */
  export namespace FindAll {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = FindAllData;
  }

  /**
   * No description
   * @tags users
   * @name Create
   * @summary Create a new user
   * @request POST:/users
   */
  export namespace Create {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateUserDto;
    export type RequestHeaders = {};
    export type ResponseBody = CreateData;
  }

  /**
   * No description
   * @tags users
   * @name FindOne
   * @summary Get a user by id
   * @request GET:/users/{id}
   */
  export namespace FindOne {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = FindOneData;
  }
}

export namespace Posts {
  /**
   * No description
   * @tags posts
   * @name FindAll
   * @summary Get all posts
   * @request GET:/posts
   */
  export namespace FindAll {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = FindAllResult;
  }

  /**
   * No description
   * @tags posts
   * @name Create
   * @summary Create a new post
   * @request POST:/posts
   */
  export namespace Create {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreatePostDto;
    export type RequestHeaders = {};
    export type ResponseBody = CreateResult;
  }

  /**
   * No description
   * @tags posts
   * @name FindOne
   * @summary Get a post by id
   * @request GET:/posts/{id}
   */
  export namespace FindOne {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = FindOneResult;
  }
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
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

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
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
}

/**
 * @title API Demo
 * @version 1.0
 * @contact
 *
 * Simple API with Users and Posts
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  users = {
    /**
     * No description
     *
     * @tags users
     * @name FindAll
     * @summary Get all users
     * @request GET:/users
     */
    findAll: (params: RequestParams = {}) =>
      this.request<FindAllData, any>({
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
    create: (data: CreateUserDto, params: RequestParams = {}) =>
      this.request<CreateData, any>({
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
    findOne: ({ id, ...query }: FindOneParams, params: RequestParams = {}) =>
      this.request<FindOneData, any>({
        path: `/users/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  posts = {
    /**
     * No description
     *
     * @tags posts
     * @name FindAll
     * @summary Get all posts
     * @request GET:/posts
     */
    findAll: (params: RequestParams = {}) =>
      this.request<FindAllResult, any>({
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
    create: (data: CreatePostDto, params: RequestParams = {}) =>
      this.request<CreateResult, any>({
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
    findOne: ({ id, ...query }: FindOneParams2, params: RequestParams = {}) =>
      this.request<FindOneResult, any>({
        path: `/posts/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
}
