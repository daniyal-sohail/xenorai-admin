/**
 * Constructs a full URL for profile images
 * If the imageUrl is already absolute, returns it as-is
 * Otherwise, prepends the API base URL
 * Returns empty string if no URL provided (safe for img src)
 */
export const getProfileImageUrl = (imageUrl?: string | null): string => {
    if (!imageUrl) return "";

    // If it's already an absolute URL, return as-is
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
        return imageUrl;
    }

    // Otherwise, combine with API base URL
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    // Remove /api/v1 suffix if present to get the base server URL
    const serverBase = apiBase.replace(/\/api\/v\d+\/?$/, "");

    return `${serverBase}/${imageUrl}`;
};
