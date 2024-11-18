import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';

declare module 'firebase-functions' {
  export type Request = ExpressRequest;
  export type Response = ExpressResponse;
  
  export namespace https {
    export function onRequest(
      handler: (request: Request, response: Response) => void | Promise<void>
    ): HttpsFunction;

    export function onCall<T = any, R = any>(
      handler: (data: T, context: CallableContext) => Promise<R> | R
    ): HttpsFunction;

    export interface CallableContext {
      auth?: {
        token: {
          email?: string;
          admin?: boolean;
          [key: string]: any;
        };
        uid: string;
      };
    }

    export class HttpsError extends Error {
      constructor(code: FunctionsErrorCode, message: string, details?: any);
    }
  }

  export type FunctionsErrorCode =
    | 'permission-denied'
    | 'unauthenticated'
    | 'internal'
    | 'invalid-argument';
}

declare module 'firebase-admin/firestore' {
  import { Timestamp } from 'firebase-admin/firestore';

  export interface DocumentData {
    [field: string]: any;
  }

  export interface QueryDocumentSnapshot<T = DocumentData> {
    data(): T;
    id: string;
  }

  export interface QuerySnapshot<T = DocumentData> {
    docs: Array<QueryDocumentSnapshot<T>>;
    forEach(callback: (result: QueryDocumentSnapshot<T>) => void): void;
    size: number;
  }

  export interface CollectionReference<T = DocumentData> extends Query<T> {
    add(data: T): Promise<DocumentReference<T>>;
  }

  export interface DocumentReference<T = DocumentData> {
    collection(collectionPath: string): CollectionReference<DocumentData>;
    set(data: Partial<T>): Promise<void>;
    update(data: Partial<T>): Promise<void>;
    delete(): Promise<void>;
  }

  export interface Query<T = DocumentData> {
    where(fieldPath: string, opStr: WhereFilterOp, value: any): Query<T>;
    orderBy(fieldPath: string, directionStr?: OrderByDirection): Query<T>;
    limit(limit: number): Query<T>;
    get(): Promise<QuerySnapshot<T>>;
  }

  export type WhereFilterOp =
    | '<'
    | '<='
    | '=='
    | '!='
    | '>='
    | '>'
    | 'array-contains'
    | 'in'
    | 'array-contains-any'
    | 'not-in';

  export type OrderByDirection = 'desc' | 'asc';
}
