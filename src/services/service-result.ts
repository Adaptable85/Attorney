export type ServiceErrorCode =
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "REPOSITORY_ERROR"
  | "AUDIT_ERROR"
  | "SERVICE_CONTEXT_ERROR";

export type ServiceError = {
  code: ServiceErrorCode;
  message: string;
  fieldErrors?: Record<string, readonly string[]>;
};

export type ServiceResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: ServiceError;
    };

export function serviceSuccess<T>(data: T): ServiceResult<T> {
  return {
    ok: true,
    data
  };
}

export function serviceFailure<T = never>(error: ServiceError): ServiceResult<T> {
  return {
    ok: false,
    error
  };
}

export function repositoryFailure(): ServiceResult<never> {
  return serviceFailure({
    code: "REPOSITORY_ERROR",
    message: "The requested records could not be loaded safely."
  });
}

export function auditFailure(): ServiceResult<never> {
  return serviceFailure({
    code: "AUDIT_ERROR",
    message: "The requested change could not be audited safely."
  });
}
