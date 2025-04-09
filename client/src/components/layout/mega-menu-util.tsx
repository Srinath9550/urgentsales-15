import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cn } from "@/lib/utils";

// Create a wrapper for NavigationMenuContent that prevents auto-closing
export const PersistentNavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto",
      className
    )}
    onPointerDownOutside={(e) => {
      // Prevent outside clicks from closing the popup
      e.preventDefault();
    }}
    {...props}
  />
));
PersistentNavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

// Create a wrapper for NavigationMenuLink
export const PersistentNavigationMenuLink = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Link>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Link
    ref={ref}
    className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground", className)}
    onClick={(e) => {
      // Prevent the menu from closing when clicking the link
      e.stopPropagation();
    }}
    {...props}
  />
));
PersistentNavigationMenuLink.displayName = NavigationMenuPrimitive.Link.displayName;