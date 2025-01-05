import { Switch } from "@nextui-org/react";
import { useState, useEffect } from "react";

export function ThemeSwitch() {

  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {

    const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme === 'dark' || (!savedTheme && darkModePreference);

    setIsDark(initialTheme);
  
    document.documentElement.classList.toggle('dark', initialTheme);
  }, []); 

  const toggleTheme = (newIsDark: boolean) => {
    setIsDark(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  if (isDark === null) return null;

  return (
    <Switch
      isSelected={isDark}
      size="lg"
      color="secondary"
      onValueChange={toggleTheme}
    >
      <div className="text-sm"></div>
    </Switch>
  );
}