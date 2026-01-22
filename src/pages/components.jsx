import React from 'react';
import cx from 'classnames';

// The container for the buttons
export const Toolbar = React.forwardRef(({ className, ...props }, ref) => (
  <div
    {...props}
    data-test-id="menu"
    ref={ref}
    className={cx(
      className,
      "flex space-x-2 border-b border-gray-200 bg-white p-3 mb-4 sticky top-0 z-10"
    )}
  />
));

// The actual button
export const Button = React.forwardRef(
  ({ className, active, reversed, ...props }, ref) => (
    <span
      {...props}
      ref={ref}
      className={cx(
        className,
        "cursor-pointer p-2 rounded hover:bg-gray-100 transition-colors",
        // Conditional styling: simpler and cleaner with Tailwind
        active ? "text-black bg-gray-200" : "text-gray-400"
      )}
    />
  )
);

// The Icon component
// Note: This relies on Google Material Icons (see step 4 below)
export const Icon = React.forwardRef(({ className, ...props }, ref) => (
  <span
    {...props}
    ref={ref}
    className={cx(
      "material-icons",
      className,
      "text-xl align-text-bottom"
    )}
  />
));