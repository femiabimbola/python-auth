// frontend/src/lib/swr-fetcher.ts

import { ApiError } from "./api-error";

export async function mutationFetcher(url: string, { arg }: { arg: any }) {
  const res = await fetch(url, {
    method: arg.method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg.body),
    credentials: "include",
  });

  let data = {};

  try {
    data = await res.json();
  } catch {}

  if (res.status === 401) {
    window.location.replace("/login");
    throw new ApiError("Unauthorized", 401, data);
  }

  if (!res.ok) {
    throw new ApiError(
      (data as any).message || "An error occurred",
      res.status,
      data
    );
  }

  return data;
}