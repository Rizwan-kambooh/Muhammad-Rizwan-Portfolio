export const isVideo = url => /\.(mp4|webm|ogg|mov|m4v)(?:$|[?#])/i.test(url);

export function previewImage(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "res.cloudinary.com" && parsed.pathname.includes("/image/upload/") && !/\/s--[^/]+--\//.test(parsed.pathname)) {
      return url.replace("/image/upload/", "/image/upload/f_auto,q_auto,w_640,c_limit/");
    }
  } catch {
    // Bundled local assets already have fingerprinted URLs.
  }
  return url;
}

export const parseTechnologies = value => (Array.isArray(value) ? value : [value])
  .filter(Boolean)
  .flatMap(item => String(item).split(/[,|•·\n]+/))
  .map(item => item.trim())
  .filter(Boolean);

export function previewTechnologies(technologies) {
  const known = /React Native|Redux Toolkit|React Navigation|React Hook Form|Firebase Firestore|Turbo Modules|Android Foreground Service|TypeScript|JavaScript|Supabase|Firebase|Kotlin|Node\.js|Express(?:\.js)?|MySQL|MongoDB|Expo|React(?:\.js)?|Redux|SQL|Yup|HTML|CSS/gi;
  const seen = new Set();
  return technologies.flatMap(technology => (
    technology.length > 44 ? technology.match(known) || [] : [technology]
  )).filter(technology => {
    const key = technology.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
