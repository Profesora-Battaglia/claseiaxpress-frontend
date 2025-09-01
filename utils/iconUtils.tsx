import React from 'react';
import { FiHelpCircle } from 'react-icons/fi';

/**
 * Utility function to safely render React Icons with fallback
 * @param IconComponent - The React Icon component to render
 * @param props - Props to pass to the icon component
 * @returns JSX element with fallback handling
 */
export const SafeIcon: React.FC<{
  IconComponent: React.ComponentType<any>;
  className?: string;
  size?: number;
  fallbackIcon?: React.ComponentType<any>;
}> = ({ IconComponent, className, size, fallbackIcon: FallbackIcon = FiHelpCircle, ...props }) => {
  try {
    // Check if the IconComponent is defined
    if (!IconComponent) {
      console.warn('Icon component is undefined, using fallback');
      return <FallbackIcon className={className} size={size} {...props} />;
    }

    return <IconComponent className={className} size={size} {...props} />;
  } catch (error) {
    console.error('Error rendering icon:', error);
    return <FallbackIcon className={className} size={size} {...props} />;
  }
};

/**
 * Development-time validation for icon imports
 * @param iconName - Name of the icon for debugging
 * @param IconComponent - The imported icon component
 */
export const validateIcon = (iconName: string, IconComponent: any) => {
  if (process.env.NODE_ENV === 'development') {
    if (!IconComponent) {
      console.warn(`Icon "${iconName}" is undefined. Check your import statement.`);
      return false;
    }
    if (typeof IconComponent !== 'function') {
      console.warn(`Icon "${iconName}" is not a valid React component.`);
      return false;
    }
  }
  return true;
};