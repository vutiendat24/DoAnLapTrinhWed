const successResponse = (data) => ({
  statusCode: 1000,
  message: 'Success',
  data
});

const errorResponse = (errorCode) => ({
  statusCode: errorCode.code,
  message: errorCode.message,
  data: []
});

export { successResponse, errorResponse };
