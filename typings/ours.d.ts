
declare module Express {
  export interface Session {
    cookies: Object[];
  }
}

//declare module "myLib" {
//
//  import {Cookie} from "request";
//
//  export module Express {
//    export interface Session {
//      cookies: Cookie[];
//    }
//  }
//
//}
