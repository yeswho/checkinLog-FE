import {
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";
import { useUpdateUser, useUserDetails } from "../../../hooks/useUser";
import { ROLES } from "../../../types/enums";

const Profile = () => {
  const id = localStorage.getItem("HMS-USER");
  const userId = Number(id);

  const { data: user, isLoading } = useUserDetails(userId);
  const updateUserMutation = useUpdateUser();

  const [hotelName, setHotelName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [role, setRole] = React.useState<ROLES>(ROLES.STANDARD);
  const [isEditable, setIsEditable] = React.useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  React.useEffect(() => {
    if (user) {
      setHotelName(user.username || "");
      setAddress(user.address || "");
      setUsername(user.username || "");
      setRole(user.role || ROLES.STANDARD);
    }
  }, [user]);


  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleUpdateProfile = async () => {
    await updateUserMutation.mutateAsync({
      id: userId,
      address,
      username,
      role,
    });
    setIsEditable(false);
    onOpenChange();
  };

  const cancelEdit = () => {
    setIsEditable(false);
    // Reset form fields to original user data
    if (user) {
      setHotelName(user.username || "");
      setAddress(user.address || "");
      setUsername(user.username || "");
      setRole(user.role || "standard");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="w-full bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Profile</h1>
            <p className="text-default-500">Manage user details</p>
          </div>
            <Chip
            color={role === "admin" ? "success" : "warning"}
            size="lg"
            className="px-4"
            variant="dot"
            >
            {role === "admin" ? "Administrator" : "Standard User"}
            </Chip>
        </div>

        <Card className="w-full shadow-sm">
          <CardBody className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8">
                <h2 className="text-xl font-semibold mb-6">Information</h2>

                <div className="space-y-6">
                  <Input
                    label="Name"
                    value={hotelName}
                    onChange={(e) => setHotelName(e.target.value)}
                    variant="flat"
                    size="lg"
                    isDisabled={!isEditable}
                    classNames={{
                      input: "text-base",
                      label: "text-base",
                    }}
                  />

                  <Input
                    label="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    variant="flat"
                    size="lg"
                    isDisabled={!isEditable}
                    classNames={{
                      input: "text-base",
                      label: "text-base",
                    }}
                  />
                </div>
              </div>

              {/* Right column: Account Settings */}
              <div className="p-8">
                <h2 className="text-xl font-semibold mb-6">Account Settings</h2>

                <div className="space-y-6">
                  <Input
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    variant="flat"
                    size="lg"
                    isDisabled={!isEditable}
                    classNames={{
                      input: "text-base",
                      label: "text-base",
                    }}
                  />

                  <div className="space-y-2">
                    <label className="text-base font-medium block">User Role</label>
                    <Input
                      value={role === "admin" ? "Administrator" : "Standard User"}
                      variant="flat"
                      size="lg"
                      isDisabled
                      classNames={{
                        input: "text-base",
                        label: "text-base",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Divider />

            <div className="p-8 flex justify-end gap-3">
              {isEditable ? (
                <>
                  <Button
                    color="danger"
                    variant="light"
                    size="lg"
                    onClick={cancelEdit}
                    disableAnimation
                    className="px-8"
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    size="lg"
                    onPress={onOpen}
                    disableAnimation
                    className="px-8"
                  >
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button
                  color="primary"
                  size="lg"
                  onClick={handleEdit}
                  disableAnimation
                  className="px-8"
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Profile Update
              </ModalHeader>
              <ModalBody>
                <div className="space-y-3 py-2">
                  <div className="flex justify-between items-center">
                    <span className="text-default-500">Name</span>
                    <span className="font-medium">{hotelName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-default-500">Address</span>
                    <span className="font-medium">{address}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-default-500">Username</span>
                    <span className="font-medium">{username}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-default-500">Role</span>
                    <span className="font-medium">
                      {role === "admin" ? "Administrator" : "Standard User"}
                    </span>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleUpdateProfile}>
                  Confirm Update
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Profile;