import { Settings, CheckCircle, Zap, Rocket, Package, Palette, Smartphone, Gamepad2 } from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Settings, CheckCircle, Zap, Rocket, Package, Palette, Smartphone, Gamepad2
};

export function getIcon(name: string) {
  const Icon = ICON_MAP[name];
  return Icon ? <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" /> : null;
}