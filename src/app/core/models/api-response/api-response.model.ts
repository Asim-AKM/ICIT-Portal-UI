// src/app/core/models/api-response.model.ts

import { ResponseTypeEnum } from "../enums/response-type.enum";

export interface ApiResponse<T> {
  data: T;
  isSuccess: boolean;
  message: string;
  status: ResponseTypeEnum;
}