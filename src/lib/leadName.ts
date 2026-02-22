
export function getNameFromEmail(email: string): string {
    if (!email) return "Anonymous";

    // Get the part before @
    const username = email.split("@")[0];

    // Split by common separators (., _, -, etc.)
    const parts = username.split(/[._-]/);

    // Capitalize each part
    const formatted = parts
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(" ");

    return formatted || "Anonymous";
}


export function getLeadDisplayName(name: string | null | undefined, email: string): string {
    return name && name.trim() ? name : getNameFromEmail(email);
}
