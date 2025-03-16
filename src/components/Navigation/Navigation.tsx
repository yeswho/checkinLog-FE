import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Skeleton,
  Divider,
} from "@nextui-org/react";
import { Spinner } from "@heroui/react";
import { ThemeSwitch } from "../theme-switch";
import { useEffect, useState } from "react";
import styles from "./Navigation.module.css";
import { useLogout } from "hooks/useLogout";
import React from "react";

export function AppNavbar() {
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAvatarLoading, setIsAvatarLoading] = useState(true);
  const logout = useLogout();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAvatarLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleNavigation = (href: string) => {
    setIsLoading(true);
    // Simulate a delay for navigation
    setTimeout(() => {
      window.location.href = href;
    }, 0.1);
  };

  const menuItems = [
    { name: "Dashboard", href: "/" },
    { name: "Rooms", href: "/rooms" },
    { name: "Bookings", href: "/bookings" },
    { name: "Customers", href: "/customers" },
    { name: "Maintenance", href: "/maintenance" },
    { name: "Billings", href: "/billings" },
    { name: "Room Types", href: "/room-type" },
    { name: "Floors", href: "/floor" },
    { name: "Complaints", href: "/complaint" },

  ];

  return (
    <Navbar
      isBordered
      maxWidth={"full"}
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="shadow-sm"
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarBrand>
        <p className="font-bold text-inherit">BRAND</p>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex items-center justify-center" justify="center">
        <div className="flex items-center">
          {menuItems.slice(0, 9).map((item, index) => (
            <React.Fragment key={item.name}>
              {index > 0 && <div className="h-4 w-px bg-default-300"></div>}
              <NavbarItem className="flex items-center justify-center">
                <Link
                  color="foreground"
                  href={item.href}
                  className="px-6 hover:text-primary transition-colors text-center"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(item.href);
                  }}
                >
                  {item.name}
                </Link>
              </NavbarItem>
            </React.Fragment>
          ))}

          <div className="h-4 w-px bg-default-300"></div>

          <NavbarItem className="flex items-center justify-center">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  disableRipple
                  className="px-4 bg-transparent data-[hover=true]:bg-transparent"
                  radius="sm"
                  variant="light"
                >
                  More
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                {menuItems.slice(9).map((item) => (
                  <DropdownItem key={item.name} className="justify-center">
                    <Link
                      color="foreground"
                      href={item.href}
                      className="w-full h-full block"
                    >
                      {item.name}
                    </Link>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        </div>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Dropdown>
            <DropdownTrigger>
              {isAvatarLoading ? (
                <Skeleton className="rounded-full w-12 h-12" />
              ) : (
                <Avatar
                  src="https://i.pravatar.cc/"
                  alt="User Avatar"
                  className={styles.avatar}
                />
              )}
            </DropdownTrigger>
            <DropdownMenu aria-label="User Menu">
              <DropdownItem>
                <Link color="foreground" href="/profile">
                  View Profile
                </Link>
              </DropdownItem>
              <DropdownItem>
                <Link color="foreground" href="/settings">
                  Settings
                </Link>
              </DropdownItem>
              <DropdownItem>
                <Link color="foreground" onClick={logout}>
                  Log out
                </Link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="mt-10">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={item.name}>
            <Link
              color="foreground"
              className="p-2 block w-full"
              href={item.href}
              size="md"
            >
              {item.name}
            </Link>
            {index < menuItems.length - 1 && <Divider className="my-1" />}
          </NavbarMenuItem>
        ))}
      </NavbarMenu>

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
        </div>
      )}
    </Navbar>
  );
}