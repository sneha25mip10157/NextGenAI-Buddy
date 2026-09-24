/**
 * NextGenAI Buddy — Design Tokens & 3-Mode Theme System
 * Supports Light, Dark, and System modes with exact color specification:
 * - Light: Background #F8F6F1, Secondary #F2EFE8, Cards #FFFDF8, White #FFFFFF,
 *   Primary #4F6BFF, Indigo #6D63D9, Text #171923, Secondary Text #626775, Border #E6E1D8
 * - Dark: Carefully designed matching palette with accessible contrast
 */

export const THEME_MODES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
};

export const PALETTE = {
  blue: "#4F6BFF",
  indigo: "#6D63D9",
  cyan: "#06B6D4",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  mutedDark: "#94A3B8",
  mutedLight: "#626775",
};

export function getThemeTokens(isDark) {
  if (isDark) {
    return {
      mode: "dark",
      dark: true,
      bg: "#0B0F19",
      bgSubtle: "#111827",
      surface: "#161F32",
      surfaceAlt: "rgba(255, 255, 255, 0.04)",
      card: "#1A243B",
      cardGlass: "rgba(22, 31, 50, 0.85)",
      border: "rgba(148, 163, 184, 0.16)",
      borderHover: "rgba(79, 107, 255, 0.45)",
      text: "#F8FAFC",
      textMuted: "#94A3B8",
      textSubtle: "#64748B",
      primary: "#4F6BFF",
      indigo: "#6D63D9",
      primaryGradient: "linear-gradient(135deg, #4F6BFF 0%, #6D63D9 100%)",
      inputBg: "rgba(255, 255, 255, 0.05)",
      editorBg: "#070B18",
      headerBg: "rgba(11, 15, 25, 0.88)",
      shadow: "0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 20px -5px rgba(79, 107, 255, 0.15)",
    };
  }

  // Exact Light Theme Specification
  return {
    mode: "light",
    dark: false,
    bg: "#F8F6F1",
    bgSubtle: "#F2EFE8",
    surface: "#FFFDF8",
    surfaceAlt: "rgba(0, 0, 0, 0.02)",
    card: "#FFFDF8",
    cardGlass: "rgba(255, 253, 248, 0.92)",
    border: "#E6E1D8",
    borderHover: "rgba(79, 107, 255, 0.5)",
    text: "#171923",
    textMuted: "#626775",
    textSubtle: "#8C92A4",
    primary: "#4F6BFF",
    indigo: "#6D63D9",
    primaryGradient: "linear-gradient(135deg, #4F6BFF 0%, #6D63D9 100%)",
    inputBg: "#F2EFE8",
    editorBg: "#171923",
    headerBg: "rgba(248, 246, 241, 0.90)",
    shadow: "0 10px 25px -5px rgba(23, 25, 35, 0.05), 0 0 15px -3px rgba(79, 107, 255, 0.08)",
  };
}
