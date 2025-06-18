import { StatusCodes as HttpStatus } from 'http-status-codes';
const ErrorCode = {
  UNCATEGORIZED_EXCEPTION: { code: 9999, message: "LỖI KHÔNG XÁC ĐỊNH", httpStatus: HttpStatus.INTERNAL_SERVER_ERROR },
  USER_NOT_FOUND_EXCEPTION: { code: 104, message: "KHÔNG TÌM THẤY NGƯỜI DÙNG", httpStatus: HttpStatus.NOT_FOUND },
  EXISTED_USER_EXCEPTION: { code: 105, message: "NGƯỜI DÙNG ĐÃ TỒN TẠI", httpStatus: HttpStatus.CONFLICT },
  LOGIN_FAILED_EXCEPTION: { code: 106, message: "EMAIL HOẶC MẬT KHẨU KHÔNG ĐÚNG", httpStatus: HttpStatus.UNAUTHORIZED },
  INVALID_TOKEN_EXCEPTION: { code: 107, message: "TOKEN KHÔNG HỢP LỆ", httpStatus: HttpStatus.UNAUTHORIZED },
  INVALID_ARGUMENT_EXCEPTION: { code: 108, message: "THAM SỐ KHÔNG HỢP LỆ", httpStatus: HttpStatus.BAD_REQUEST },

};
export default ErrorCode;
