import {
    Avatar,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Chip,
    Divider,
    useDisclosure
} from "@nextui-org/react";
import { InfoIcon } from "@nextui-org/shared-icons";
import Maintenance from "../../Modals/Maintenance/Maintenance";


type MaintenanceDetails = {
    id: number;
    room_id: number;
    reason: string;
    startDate: string;
    expectedEndDate: string;
    createdAt: string;
    updatedAt: string;
};

type Room = {
    id: number;
    name: string;
    floor: {
        id: number;
        name: string;
    };
    room_type: {
        id: number;
        name: string;
    };
    rate: string;
    status: string;

    occupiedDetails?: {
        customer: {
            firstName: string;
            lastName: string;
            contact: string;
        };
        checkIn: string;
        checkOut: string;
    };
    maintenanceDetails?: {
        id: number;
        reason: string;
        startDate: string;
        expectedEndDate: string;
    };
};

interface RoomCardProps {
    room: Room;
    onEdit?: () => void;
    onDelete?: () => void;
}

export default function RoomCard({ room, onEdit, onDelete }: RoomCardProps) {
    console.log(room);

    const { isOpen: isMaintenanceOpen, onOpen: onMaintenanceOpen, onClose: onMaintenanceClose } = useDisclosure();
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Available":
                return "success";
            case "Occupied":
                return "primary";
            case "Under maintainance":
                return "warning";
            default:
                return "default";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "available":
                return <InfoIcon className="w-4 h-4" />;
            case "occupied":
                return <InfoIcon className="w-4 h-4" />;
            case "maintenance":
                return <InfoIcon className="w-4 h-4" />;
            default:
                return null;
        }
    };

    const maintenanceData: MaintenanceDetails | null = room.maintenanceDetails
        ? {
            id: room.maintenanceDetails.id,
            room_id: room.id,
            reason: room.maintenanceDetails.reason,
            startDate: room.maintenanceDetails.startDate,
            expectedEndDate: room.maintenanceDetails.expectedEndDate,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        : null;

    return (
        <div>
            <Card className="max-w-xl mx-auto h-120 shadow-none pt-4">
                <CardHeader className="flex justify-between">
                    <div className="flex flex-col">
                        <p className="text-md font-semibold">{room.name}</p>
                        <p className="text-small text-default-500">{room.floor.name}</p>
                    </div>
                    <Chip
                        startContent={getStatusIcon(room.status)}
                        color={getStatusColor(room.status)}
                        variant="flat"
                    >
                        {room.status.replace("_", " ")}
                    </Chip>
                </CardHeader>
                <Divider />
                <CardBody className="py-2">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span role="img" aria-label="bed" className="text-xl">
                                    🛏️
                                </span>
                                <span className="text-default-700">{room.room_type.name}</span>
                            </div>
                            <span className="font-semibold">रु {room.rate.toLocaleString()}/night</span>
                        </div>

                        {room.status === "Occupied" && room.occupiedDetails && (
                            <div className="bg-primary-50 p-3 rounded-lg space-y-2">
                                <div className="flex items-center gap-2">
                                    <Avatar
                                        name={`${room.occupiedDetails.customer.firstName} ${room.occupiedDetails.customer.lastName}`}
                                        size="sm"
                                    />
                                    <div>
                                        <p className="text-sm font-semibold">
                                            {room.occupiedDetails.customer.firstName} {room.occupiedDetails.customer.lastName}
                                        </p>
                                        <p className="text-xs text-default-500">
                                            {room.occupiedDetails.customer.contact}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <p className="text-default-500">Check In</p>
                                        <p className="font-medium">
                                            {new Date(room.occupiedDetails.checkIn).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-default-500">Check Out</p>
                                        <p className="font-medium">
                                            {new Date(room.occupiedDetails.checkOut).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {room.status === "Under maintainance" && room.maintenanceDetails && (
                            <div className="bg-warning-50 p-3 rounded-lg space-y-2">
                                <div className="flex items-center gap-2">
                                    <span role="img" aria-label="maintenance" className="text-xl">
                                        🔧
                                    </span>
                                    <p className="text-sm font-medium">Maintenance Details</p>
                                </div>
                                <p className="text-sm">Reason: {room.maintenanceDetails.reason}</p>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <p className="text-default-500">Started</p>
                                        <p className="font-medium">
                                            {new Date(room.maintenanceDetails.startDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-default-500">Expected End</p>
                                        <p className="font-medium">
                                            {new Date(room.maintenanceDetails.expectedEndDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {room.status === "Available" && (
                            <div className="bg-success-50 p-3 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <span role="img" aria-label="available" className="text-xl">
                                        ✅
                                    </span>
                                    <p className="text-sm">Ready for new guests</p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardBody>
                <CardFooter className="justify-end gap-2">
                    {room.status === "Under maintainance" && (
                        <Button
                            variant="flat"
                            color="primary"
                            size="md"
                            onPress={() => {
                                if (room.status === 'Under maintainance') {
                                    onMaintenanceOpen();
                                }
                            }}
                        >
                            Details
                        </Button>
                    )}
                </CardFooter>
            </Card>
            {room.maintenanceDetails && (
                <Maintenance
                    isOpen={isMaintenanceOpen}
                    onClose={onMaintenanceClose}
                    maintenance={maintenanceData}
                />
            )}
        </div>
    );
}