export const DEFAULT_AGENTS = [
  {
    id: "default-education",
    name: "Education Labeler",
    prompt:
      "Email is from an educational institution, course platform, or related to learning, courses, or certifications.",
    action: "label",
    labelName: "Education",
    enabled: true,
    isDefault: true,
  },
  {
    id: "default-ads",
    name: "Ads Deleter",
    prompt: "Email is a promotional advertisement, marketing email, sales pitch, or unsolicited commercial message.",
    action: "delete",
    labelName: null,
    enabled: true,
    isDefault: true,
  },
  {
    id: "default-security",
    name: "Stale Security Notifications",
    prompt:
      "Email is a security notification, password reset confirmation, login alert, or account activity notice that requires no further action.",
    action: "delete",
    labelName: null,
    enabled: true,
    isDefault: true,
  },
];
