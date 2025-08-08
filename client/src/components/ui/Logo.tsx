// components/Logo.tsx

import { useState } from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  role?: "super_admin" | "admin";
  collapsed?: boolean;
  className?: string;
}

export const Logo = ({
  role = "admin",
  collapsed = false,
  className,
}: LogoProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const logoConfig = {
    super_admin: {
      src: "https://mortar-website.vercel.app/assets/img/othTech-logo-light.png",
      alt: "Super Admin Logo",
      fallback: "SA",
      filter: "brightness(1.1) contrast(1.1)",
    },
    admin: {
      src: "https://www.purplewave.in/assets/img/logo-new2-stat.gif",
      alt: "Admin Logo",
      fallback: "A",
      filter: "none",
    },
  };

  const config = logoConfig[role];

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  if (collapsed) {
    return (
      <div className="flex items-center w-full">
        <div className="w-8 h-8 theme-gradient rounded-lg flex items-center justify-center shadow-sm">
          <span className="text-white font-bold text-sm">
            {config.fallback}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center w-full">
      {imageError ? (
        <div className="w-12 h-12 theme-gradient rounded-lg flex items-center justify-center shadow-sm">
          <span className="text-white font-bold text-lg">
            {config.fallback}
          </span>
        </div>
      ) : (
        <div className="relative">
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-200 rounded-lg animate-pulse" />
          )}
          <img
            src={config.src}
            alt={config.alt}
            className={cn(
              "h-12 w-auto object-contain max-w-full transition-opacity duration-300",
              imageLoading && "opacity-0",
              className
            )}
            style={{
              filter: config.filter,
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>
      )}
    </div>
  );
};
