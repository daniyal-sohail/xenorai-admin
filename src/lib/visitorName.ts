
export function formatVisitorName(visitorId: string): string {
    if (!visitorId) return "Anonymous";

    // Extract the numeric part from "visitor_177152623019"
    const numericPart = visitorId.replace(/^visitor_/i, "");

    // Take last 4 digits for a shorter, cleaner ID
    const shortId = numericPart.slice(-4);

    return `Visitor #${shortId}`;
}
