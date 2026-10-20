import { isVideo, parseTechnologies, previewImage, previewTechnologies } from "./projectMedia";

test("supports saved technology lists with bullets and long pasted entries", () => {
  expect(parseTechnologies("React Native · TypeScript · Kotlin")).toEqual(["React Native", "TypeScript", "Kotlin"]);
  const saved = ["Expo React Native TypeScript React Redux Toolkit React Navigation Supabase (@supabase/supabase-js)"];
  expect(previewTechnologies(saved)).toEqual(["Expo", "React Native", "TypeScript", "React", "Redux Toolkit", "React Navigation", "Supabase"]);
  expect(saved[0]).toContain("@supabase/supabase-js");
});

test("only resizes public Cloudinary images and preserves signed and unrelated URLs", () => {
  expect(previewImage("https://res.cloudinary.com/demo/image/upload/v1/project.jpg")).toBe("https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_640,c_limit/v1/project.jpg");
  for (const url of [
    "/static/media/project.jpg",
    "https://example.com/image/upload/project.jpg",
    "https://res.cloudinary.com/demo/image/upload/s--signature--/v1/project.jpg",
  ]) expect(previewImage(url)).toBe(url);
});

test("recognizes video files with query parameters", () => {
  expect(isVideo("https://example.com/demo.mp4?version=2")).toBe(true);
  expect(isVideo("https://example.com/demo.jpeg")).toBe(false);
});
