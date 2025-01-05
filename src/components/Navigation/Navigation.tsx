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
  } from "@nextui-org/react";
  import { ThemeSwitch } from "../theme-switch";
  import { useEffect, useState } from "react";
  import styles from "./Navigation.module.css";
import { useLogout } from "hooks/useLogout";
  
  export function AppNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAvatarLoading, setIsAvatarLoading] = useState(true);
    const logout = useLogout();

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsAvatarLoading(false);
      }, 1000);
  
      return () => clearTimeout(timer);
    }, []);
  
    const menuItems = [
      { name: "Dashboard", href: "/" },
      { name: "Rooms", href: "/rooms" },
      { name: "Bookings", href: "/bookings" },
      // { name: "Billings", href: "/billings" },
      { name: "Customers", href: "/customers" },
      { name: "Room Types", href: "/room-type" },
      // { name: "Manage Resturant", href: "/restraunt" },
      { name: "Floors", href: "/floor" },
      // { name: "Vendors", href: "/vendors" },
    ];
  
    return (
      <Navbar isBordered maxWidth={"full"} isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
        <NavbarContent className="sm:hidden" justify="start">
          <NavbarMenuToggle />
        </NavbarContent>
  
        <NavbarBrand>
          <p className="font-bold text-inherit">BRAND</p>
        </NavbarBrand>
  
        <NavbarContent className="hidden sm:flex gap-8" justify="center">
          {menuItems.slice(0, 4).map((item) => (
            <NavbarItem key={item.name}>
              <Link color="foreground" href={item.href} className="hover:text-primary">
                {item.name}
              </Link>
            </NavbarItem>
          ))}
  
          <Dropdown>
            <NavbarItem>
              <DropdownTrigger>
                <Button
                  disableRipple
                  className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                  radius="sm"
                  variant="light"
                >
                  More
                </Button>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu>
              {menuItems.slice(4).map((item) => (
                <DropdownItem key={item.name}>
                  <Link color="foreground" href={item.href}>
                    {item.name}
                  </Link>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
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
              <DropdownMenu aria-label="User Menu" >
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
          {menuItems.map((item) => (
            <NavbarMenuItem key={item.name}>
              <Link color="foreground" underline="hover" className="ml-20 p-2 block w-full" href={item.href} size="md">
                {item.name}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
    );
  }
  