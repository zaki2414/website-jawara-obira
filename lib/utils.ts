// lib/utils.ts

// Format tanggal Indonesia
export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Validasi ukuran file (max 5MB)
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  const maxSize = 5 * 1024 * 1024; // 5 MB in bytes
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Format file tidak didukung. Gunakan JPG, PNG, atau WebP.",
    };
  }
  if (file.size > maxSize) {
    return {
      valid: false,
      error: "Ukuran file maksimal 5MB. Silakan kompres foto Anda.",
    };
  }
  return { valid: true };
}

// Generate slug dari judul
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
