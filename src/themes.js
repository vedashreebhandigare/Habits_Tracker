export const themes = {
  floral: {
    name: "Soft Floral",
    description: "Calm & Artistic",
    backgroundImage: "/bg.avif",
    backgroundType: "image",
    headingImage: "/Habit_Heading.png",
    cardBackground: "rgba(255, 255, 255, 0.85)",
    accentColor: "#9C27B0",
    textColor: "#2c3e50",
    borderRadius: "12px",
    shadowIntensity: "0 8px 32px rgba(0,0,0,0.1)",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto'",
    backdropBlur: "blur(10px)",
  },
  
  focus: {
    name: "Focus Mode",
    description: "Deep Work & Minimal",
    backgroundImage: "/focus_bg.avif",
    backgroundType: "image",
    headingImage: "/focus_heading.png",
    cardBackground: "rgba(30, 41, 59, 0.95)",
    accentColor: "#10b981",
    textColor: "#f1f5f9",
    borderRadius: "4px",
    shadowIntensity: "0 4px 16px rgba(0,0,0,0.3)",
    fontFamily: "'Inter', -apple-system, sans-serif",
    backdropBlur: "none",
  },
  
  zen: {
    name: "Zen Mode",
    description: "Calm & Spacious",
    backgroundImage: "/zen_bg.jpg",
    backgroundType: "image",
    headingImage: "/Zen_Heading.png",
    cardBackground: "rgba(255, 255, 255, 0.7)",
    accentColor: "#81c784",
    textColor: "#5a6c57",
    borderRadius: "16px",
    shadowIntensity: "0 4px 20px rgba(0,0,0,0.08)",
    fontFamily: "'Georgia', serif",
    backdropBlur: "blur(8px)",
  },
  
  dark: {
    name: "Night Operator",
    description: "Terminal Dark",
    backgroundImage: "#000000",
    backgroundType: "color",
    headingImage: "/Night_Heading.png",
    cardBackground: "rgba(17, 17, 17, 0.95)",
    accentColor: "#00ff00",
    textColor: "#00ff00",
    borderRadius: "0px",
    shadowIntensity: "0 0 20px rgba(0,255,0,0.2)",
    fontFamily: "'Courier New', monospace",
    backdropBlur: "none",
  },
  
  professional: {
    name: "Minimal",
    description: "Data & Analytics",
    backgroundImage: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    backgroundType: "gradient",
    headingImage: "/Minimal_Heading.png",
    cardBackground: "rgba(255, 255, 255, 0.95)",
    accentColor: "#3b82f6",
    textColor: "#1e293b",
    borderRadius: "6px",
    shadowIntensity: "0 2px 12px rgba(0,0,0,0.1)",
    fontFamily: "'Arial', sans-serif",
    backdropBlur: "none",
  },
  
  motivational: {
    name: "Energy",
    description: "Bold & Inspiring",
    backgroundImage: "/energy_bg.jpg",
    backgroundType: "image",
    headingImage: "/Energy_Heading.png",
    cardBackground: "rgba(255, 255, 255, 0.92)",
    accentColor: "#ff6b6b",
    textColor: "#2c1810",
    borderRadius: "16px",
    shadowIntensity: "0 12px 40px rgba(255,107,107,0.3)",
    fontFamily: "'Montserrat', sans-serif",
    backdropBlur: "blur(10px)",
  },
};

export const applyTheme = (themeName) => {
  const theme = themes[themeName];
  if (!theme) return;
  
  const root = document.documentElement;
  
  // Apply background based on type - use a small delay to ensure DOM is ready
  setTimeout(() => {
    const appElement = document.querySelector('.app');
    if (appElement) {
      if (theme.backgroundType === 'image') {
        appElement.style.backgroundImage = `url('${theme.backgroundImage}')`;
        appElement.style.backgroundSize = 'cover';
        appElement.style.backgroundPosition = 'center';
        appElement.style.backgroundRepeat = 'no-repeat';
        appElement.style.backgroundAttachment = 'fixed';
      } else if (theme.backgroundType === 'gradient') {
        appElement.style.backgroundImage = theme.backgroundImage;
        appElement.style.backgroundSize = 'cover';
        appElement.style.backgroundAttachment = 'fixed';
      } else {
        appElement.style.background = theme.backgroundImage;
        appElement.style.backgroundImage = 'none';
      }
    }
    
    // Apply heading image
    const headingImage = document.querySelector('.heading-image');
    if (headingImage && theme.headingImage) {
      headingImage.src = theme.headingImage;
    }
  }, 0);
  
  root.style.setProperty('--theme-card-bg', theme.cardBackground);
  root.style.setProperty('--theme-accent', theme.accentColor);
  root.style.setProperty('--theme-text', theme.textColor);
  root.style.setProperty('--theme-radius', theme.borderRadius);
  root.style.setProperty('--theme-shadow', theme.shadowIntensity);
  root.style.setProperty('--theme-font', theme.fontFamily);
  root.style.setProperty('--theme-backdrop', theme.backdropBlur);
};
