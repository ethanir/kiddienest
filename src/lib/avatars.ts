// The friendly avatar palette children can be given. Shared by the manual
// "Add child" form and the CSV importer so kids get consistent avatars no
// matter how they were created.

export type AvatarOption = { emoji: string; bg: string };

export const AVATARS: AvatarOption[] = [
  { emoji: "😊", bg: "#fce7f3" },
  { emoji: "🐻", bg: "#fef3c7" },
  { emoji: "🦊", bg: "#ffedd5" },
  { emoji: "🐰", bg: "#ede9fe" },
  { emoji: "🐥", bg: "#fef9c3" },
  { emoji: "🐸", bg: "#dcfce7" },
  { emoji: "🐙", bg: "#dbeafe" },
  { emoji: "🦄", bg: "#fae8ff" },
  { emoji: "🐢", bg: "#ccfbf1" },
  { emoji: "⭐", bg: "#ffe4e6" },
  { emoji: "🐝", bg: "#fef08a" },
  { emoji: "🦋", bg: "#e0f2fe" },
];
