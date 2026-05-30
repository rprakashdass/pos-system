import axios from "axios";

export function getApiErrorMessage(error: unknown): { title: string; description?: string } {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;

    if (typeof data === "string") {
      return {
        title: status ? `Request failed (${status})` : "Request failed",
        description: data,
      };
    }

    if (data && typeof data === "object") {
      const maybeMessage = (data as any).message;
      const maybeError = (data as any).error;

      if (typeof maybeMessage === "string") {
        return {
          title: status ? `Request failed (${status})` : "Request failed",
          description: maybeMessage,
        };
      }

      if (typeof maybeError === "string") {
        return {
          title: status ? `Request failed (${status})` : "Request failed",
          description: maybeError,
        };
      }
    }

    return {
      title: status ? `Request failed (${status})` : "Request failed",
      description: error.message,
    };
  }

  if (error instanceof Error) {
    return { title: "Something went wrong", description: error.message };
  }

  return { title: "Something went wrong" };
}
