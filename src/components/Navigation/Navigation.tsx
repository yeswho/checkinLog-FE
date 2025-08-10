import {
  Avatar,
  Badge,
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle
} from "@heroui/react";
import { useLogout } from "hooks/useLogout";
import { useState } from "react";
import { ThemeSwitch } from "../theme-switch";

// Icons
import {
  AlertCircle,
  Bed,
  Calendar,
  ChevronDown,
  CreditCard,
  DollarSign,
  FileText,
  Flag,
  Home,
  Layers,
  LogOut,
  TrendingUp,
  User,
  User as UserIcon,
  Users,
  Wrench
} from "lucide-react";

export function AppNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const logout = useLogout();
  

  const handleNavigation = (href: string) => {
    window.location.href = href;
  };

  const menuGroups = [
    {
      name: "Front Desk",
      items: [
        { name: "Bookings", href: "/bookings", icon: <Calendar size={18} /> },
        { name: "Customers", href: "/customers", icon: <Users size={18} /> },
        { name: "Complaints", href: "/complaint", icon: <AlertCircle size={18} /> },
      ],
    },
    {
      name: "Property",
      items: [
        { name: "Rooms", href: "/rooms", icon: <Bed size={18} /> },
        { name: "Room Types", href: "/room-type", icon: <Layers size={18} /> },
        { name: "Floors", href: "/floor", icon: <Flag size={18} /> },
        { name: "Maintenance", href: "/maintenance", icon: <Wrench size={18} /> },
      ],
    },
    {
      name: "Staff",
      items: [
        { name: "Employees", href: "/employee", icon: <User size={18} /> },
        { name: "Salary", href: "/salary", icon: <DollarSign size={18} /> },
      ],
    },
    {
      name: "Finance",
      items: [
        { name: "Billings", href: "/billings", icon: <CreditCard size={18} /> },
        { name: "Expenses", href: "/expense", icon: <FileText size={18} /> },
        { name: "Revenue", href: "/revenue", icon: <TrendingUp size={18} /> },
      ],
    },
  ];
  
  // Flattened menu items for mobile (including Dashboard)
  const allMenuItems = [
    { name: "Dashboard", href: "/", icon: <Home size={18} /> },
    ...menuGroups.flatMap(group => group.items)
  ];

  return (
    <Navbar
      
      maxWidth={"full"}
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="shadow-sm"
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarBrand>
        <p className="font-bold text-inherit">HMS</p>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-1" justify="center">
        {/* Standalone Dashboard link */}
        <NavbarItem>
          <Link
            href="/"
            className="flex items-center gap-1 px-4 py-2 text-foreground hover:text-primary transition-colors"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation("/");
            }}
          >
            <Home size={18} />
            Dashboard
          </Link>
        </NavbarItem>

        {/* Grouped dropdowns */}
        {menuGroups.map((group) => (
          <Dropdown key={group.name}>
            <NavbarItem>
              <DropdownTrigger>
                <Button
                  disableRipple
                  variant="light"
                  className="text-foreground hover:text-primary border-none"
                  endContent={<ChevronDown size={16} className="ml-1" />}
                >
                  {group.name}
                </Button>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu
              aria-label={group.name}
              className="w-[200px]"
              itemClasses={{
                base: "gap-3",
              }}
            >
              {group.items.map((item) => (
                <DropdownItem
                  key={item.name}
                  startContent={item.icon}
                  className="py-2"
                  onClick={() => handleNavigation(item.href)}
                >
                  {item.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        ))}
      </NavbarContent>

      <NavbarContent justify="end" className="gap-4">
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
        
        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button 
                isIconOnly 
                variant="light" 
                className="p-0 min-w-0 w-auto h-auto bg-transparent data-[hover=true]:bg-transparent"
              >
                <Badge color="primary" shape="circle">
                  <Avatar
                    src="https://i.ibb.co/CKbwfs4R/Letter-h-chrome-initial-logo-template-on-transparent-background-PNG-removebg-preview.png"
                    alt="User Avatar"
                    className="w-10 h-10 cursor-pointer"
                  />
                </Badge>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem 
                key="profile" 
                startContent={<UserIcon size={18} />}
                onClick={() => handleNavigation("/profile")}
              >
                My Profile
              </DropdownItem>
              <DropdownItem 
                key="logout" 
                color="danger" 
                startContent={<LogOut size={18} />}
                onClick={logout}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="mt-14 px-4">
        {allMenuItems.map((item, index) => (
          <NavbarMenuItem key={item.name}>
            <Link
              color="foreground"
              className="p-3 flex items-center gap-3 w-full rounded-lg hover:bg-default-100"
              href={item.href}
              size="md"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation(item.href);
              }}
            >
              <span className="text-primary">
                {item.icon}
              </span>
              {item.name}
            </Link>
            {index < allMenuItems.length - 1 && <Divider className="my-1" />}
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}