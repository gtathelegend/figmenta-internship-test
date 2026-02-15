const API_URL =
  import.meta.env.VITE_API_URL || "https://figmenta-internship-test.vercel.app";

const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  const contentType = response.headers.get("content-type");
  const data = contentType && contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const error = new Error(data?.error || "Request failed");
    error.status = response.status;
    error.details = data?.details || [];
    throw error;
  }

  return data;
};

export const fetchBookmarks = (tag) => {
  const query = tag ? `?tag=${encodeURIComponent(tag)}` : "";
  return request(`/bookmarks${query}`);
};

export const createBookmark = (payload) =>
  request("/bookmarks", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateBookmark = (id, payload) =>
  request(`/bookmarks/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteBookmark = (id) =>
  request(`/bookmarks/${id}`, {
    method: "DELETE",
  });

export const formatApiError = (error) => {
  if (!error) {
    return "Unexpected error";
  }

  if (Array.isArray(error.details) && error.details.length > 0) {
    return error.details.map((detail) => detail.message).join(" | ");
  }

  return error.message || "Request failed";
};
