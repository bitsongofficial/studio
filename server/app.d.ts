/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./utils/lucia").Auth;
  type DatabaseUserAttributes = {
    address: string;
    username: string | null;
    avatar: string | null;
    cover: string | null;
  };
  type DatabaseSessionAttributes = {};
}