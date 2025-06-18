import { Response } from "express";

type ResponseDataType = {
  message: string;
  success: boolean;
  data: any;
};

/*
  @param  res:Response->res , statusCode: number->statusCode,data:ResponseDataType->{message,success,data:any}
  @return response
  Explanation: This function is used to send response  
*/

export const response = (
  res: Response,
  statusCode: number,
  data: ResponseDataType = {
    message: "An error occured",
    success: false,
    data: null,
  },
  isError: boolean = false
): void => {
  if (isError) res.status(statusCode).send(JSON.stringify(data));
  else res.status(statusCode).send(JSON.stringify(data));
};
