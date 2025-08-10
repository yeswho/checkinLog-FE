import { Button, Checkbox, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, User, Chip, Card, CardBody, Divider } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { useAvailableRooms } from 'hooks/useRooms';
import { Room } from '../../../types/rooms';
import { Booking } from 'types/booking';
import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';
import { format, formatDate } from 'date-fns';
import { useSendBookingConfirmation, useUpdateBookingRooms } from 'hooks/useBooking';

function calculateTotalPrice(rooms: Room[]): number {
    return rooms.reduce((total, room) => total + (room.rate ? Number(room.rate) : 0), 0);
}

interface AssignRoomModalProps {
    booking: Booking;
    isOpen: boolean;
    onClose: () => void;
    onAssign: (roomIds: number[]) => void;
}

export default function AssignRoomModal({
    booking,
    isOpen,
    onClose,
    onAssign,
}: AssignRoomModalProps) {
    const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const updateRoomsMutation = useUpdateBookingRooms();
    const sendConfirmationMutation = useSendBookingConfirmation();
    const { data: roomsData, isLoading: isFetching } = useAvailableRooms(
        new Date(booking.check_in),
        new Date(booking.check_out)
    );

    useEffect(() => {
        if (!isFetching && roomsData) {
            setAvailableRooms(roomsData);
            setIsLoading(false);
        }
    }, [isFetching, roomsData]);

    useEffect(() => {
        if (availableRooms.length > 0) {
            const initialTotal = calculateTotalPrice(
                availableRooms.filter(room => selectedRooms.includes(room.id))
            );
            setTotalPrice(initialTotal);
        }
    }, [availableRooms, selectedRooms]);

    const handleRoomSelection = (roomId: number, isSelected: boolean) => {
        setSelectedRooms(prev =>
            isSelected
                ? [...prev, roomId]
                : prev.filter(id => id !== roomId)
        );
    };

    const handleAssignRooms = async () => {
        try {
            await updateRoomsMutation.mutateAsync({
                bookingId: booking.id,
                roomIds: selectedRooms
            });
            onClose();
        } catch (error) {
            console.error('Failed to assign rooms:', error);
        }
    };

    const handleSendConfirmation = async () => {
        try {
            await sendConfirmationMutation.mutateAsync({
                bookingId: booking.id,
                recipient: 'guest'
            });
        } catch (error) {
            console.error('Failed to send confirmation:', error);
        }
    };

    // Helper function to check if a room matches requested types
    const isMatchingRequestedType = (room: Room) => {
        if (!booking.requested_roomType || booking.requested_roomType.length === 0) return false;
        return booking.requested_roomType.includes(room.room_type?.name);
    };

    return (
        <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} size="full" scrollBehavior="inside">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-t-lg">
                            <div className="flex justify-between items-center w-full">
                                <div>
                                    <h2 className="text-2xl font-bold text-primary-900">Assign Rooms</h2>
                                    <p className="text-sm text-default-600 font-medium">Booking #{booking.id}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Chip 
                                        color="primary" 
                                        variant="shadow"
                                        classNames={{
                                            base: "border-white/20",
                                            content: "font-semibold"
                                        }}
                                    >
                                        {booking.status}
                                    </Chip>
                                    <Chip 
                                        color="secondary" 
                                        variant="shadow"
                                        classNames={{
                                            base: "border-white/20",
                                            content: "font-semibold"
                                        }}
                                    >
                                        {booking.payment_mode}
                                    </Chip>
                                </div>
                            </div>
                        </ModalHeader>

                        <ModalBody className="gap-6 p-6">
                            {/* Booking Summary Section */}
                            <Card className="bg-gradient-to-br from-default-50 to-default-100 shadow-sm">
                                <CardBody className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-3">
                                            <h3 className="font-bold text-default-700 text-sm uppercase tracking-wide">Customer Details</h3>
                                            <User
                                                name={`${booking.customer.firstname} ${booking.customer.lastname}`}
                                                description={booking.customer.email}
                                                avatarProps={{ 
                                                    src: undefined,
                                                    classNames: {
                                                        base: "bg-gradient-to-br from-primary-500 to-secondary-500"
                                                    }
                                                }}
                                                classNames={{
                                                    name: "font-semibold text-default-800",
                                                    description: "text-sm text-default-600"
                                                }}
                                            />
                                            <div className="flex items-center gap-2">
                                                <Chip size="md" variant="flat" color="default" className="font-medium">
                                                    📞 {booking.customer.contact}
                                                </Chip>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <h3 className="font-bold text-default-700 text-sm uppercase tracking-wide">Stay Duration</h3>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-lg shadow-sm">
                                                        <p className="text-sm font-bold">
                                                            {typeof booking.check_in === 'string'
                                                                ? formatDate(new Date(booking.check_in), 'MMM dd, yyyy')
                                                                : formatDate(booking.check_in, 'MMM dd, yyyy')}
                                                        </p>
                                                    </div>
                                                    <div className="h-px bg-default-300 flex-1"></div>
                                                    <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white px-4 py-2 rounded-lg shadow-sm">
                                                        <p className="text-sm font-bold">
                                                            {typeof booking.check_out === 'string'
                                                                ? formatDate(new Date(booking.check_out), 'MMM dd, yyyy')
                                                                : formatDate(booking.check_out, 'MMM dd, yyyy')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Chip color="default" variant="flat" size="sm" className="self-start">
                                                    👥 {booking.pax} guest{booking.pax !== 1 ? 's' : ''} • {booking.duration} night{booking.duration !== 1 ? 's' : ''}
                                                </Chip>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <h3 className="font-bold text-default-700 text-sm uppercase tracking-wide">Requested Room Types</h3>
                                            {booking.requested_roomType && booking.requested_roomType.length > 0 ? (
                                                <div className="flex flex-col gap-2">
                                                    {booking.requested_roomType.map((roomType, index) => (
                                                        <Chip
                                                            key={index}
                                                            color="warning"
                                                            variant="flat"
                                                            size="sm"
                                                            classNames={{
                                                                base: "border border-warning-200 bg-gradient-to-r from-warning-50 to-warning-100",
                                                                content: "font-semibold text-warning-800"
                                                            }}
                                                            startContent="🏨"
                                                        >
                                                            {roomType}
                                                        </Chip>
                                                    ))}
                                                </div>
                                            ) : (
                                                <Chip color="default" variant="flat" size="sm">
                                                    No specific preference
                                                </Chip>
                                            )}
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>

                            <Divider />

                            {/* Available Rooms Table */}
                            {isLoading ? (
                                <Card className="bg-default-50">
                                    <CardBody className="flex justify-center items-center h-40">
                                        <div className="text-center space-y-2">
                                            <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
                                            <p className="text-default-600">Loading available rooms...</p>
                                        </div>
                                    </CardBody>
                                </Card>
                            ) : availableRooms?.length ? (
                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-bold text-default-800">Available Rooms</h3>
                                        <Chip color="success" variant="flat" size="sm">
                                            {availableRooms.length} room{availableRooms.length !== 1 ? 's' : ''} available
                                        </Chip>
                                    </div>
                                    
                                    <Table
                                        aria-label="Available rooms"
                                        classNames={{
                                            wrapper: "border border-default-200 rounded-xl shadow-sm",
                                            th: "bg-gradient-to-r from-default-100 to-default-50 text-default-700 font-bold",
                                            td: "border-b border-default-100"
                                        }}
                                    >
                                        <TableHeader>
                                            <TableColumn>SELECT</TableColumn>
                                            <TableColumn>ROOM</TableColumn>
                                            <TableColumn>TYPE</TableColumn>
                                            <TableColumn>FLOOR</TableColumn>
                                            <TableColumn>RATE</TableColumn>
                                            <TableColumn>STATUS</TableColumn>
                                        </TableHeader>
                                        <TableBody>
                                            {availableRooms.map((room) => (
                                                <TableRow 
                                                    key={room.id}
                                                    className={`hover:bg-default-50 transition-colors ${
                                                        isMatchingRequestedType(room) ? 'bg-warning-50 border-l-4 border-l-warning-500' : ''
                                                    }`}
                                                >
                                                    <TableCell>
                                                        <Checkbox
                                                            isSelected={selectedRooms.includes(room.id)}
                                                            onChange={(e) => handleRoomSelection(room.id, e.target.checked)}
                                                            color="primary"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-default-800">{room.name}</span>
                                                            {isMatchingRequestedType(room) && (
                                                                <Chip size="sm" color="warning" variant="solid">
                                                                    ⭐ Requested
                                                                </Chip>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip 
                                                            variant="flat" 
                                                            color={isMatchingRequestedType(room) ? "warning" : "secondary"} 
                                                            size="sm"
                                                            classNames={{
                                                                content: "font-semibold"
                                                            }}
                                                        >
                                                            {room.room_type?.name}
                                                        </Chip>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="font-medium text-default-700">{room.floor?.name}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="font-bold text-lg text-success-600">
                                                            NPR {Number(room.rate).toLocaleString()}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            variant="flat"
                                                            color={room.status === 'AVAILABLE' ? 'success' : 'warning'}
                                                            size="sm"
                                                            classNames={{
                                                                content: "font-semibold"
                                                            }}
                                                        >
                                                            {room.status}
                                                        </Chip>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

                                    {/* Selection Summary */}
                                    <Card className="bg-gradient-to-br from-primary-50 to-secondary-50 border border-primary-200">
                                        <CardBody className="p-4">
                                            <div className="flex justify-between items-center">
                                                <div className="space-y-1">
                                                    <h4 className="font-bold text-lg text-primary-800">
                                                        Selected {selectedRooms.length} Room{selectedRooms.length !== 1 ? 's' : ''}
                                                    </h4>
                                                    {selectedRooms.length > 0 && (
                                                        <div className="text-sm text-primary-600 max-w-md">
                                                            {availableRooms
                                                                .filter(room => selectedRooms.includes(room.id))
                                                                .map(room => (
                                                                    <Chip 
                                                                        key={room.id}
                                                                        size="sm" 
                                                                        color="primary" 
                                                                        variant="flat" 
                                                                        className="mr-2 mb-1"
                                                                    >
                                                                        {room.name} ({room.room_type?.name})
                                                                    </Chip>
                                                                ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-right space-y-1">
                                                    <p className="text-sm text-default-600 font-medium">Total Amount</p>
                                                    <p className="text-3xl font-bold text-primary-700">
                                                        NPR {totalPrice.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </div>
                            ) : (
                                <Card className="bg-default-50">
                                    <CardBody className="text-center py-12 space-y-4">
                                        <div className="text-6xl">🏨</div>
                                        <div>
                                            <p className="text-xl font-bold text-default-800">No Available Rooms</p>
                                            <p className="text-sm text-default-600 mt-2">
                                                All rooms are currently occupied for the selected dates
                                            </p>
                                        </div>
                                    </CardBody>
                                </Card>
                            )}
                        </ModalBody>

                        <ModalFooter className="flex justify-between border-t border-default-200 bg-default-50 rounded-b-lg p-6">
                            <Button 
                                color="default" 
                                variant="light" 
                                onPress={onClose}
                                size="lg"
                                className="font-semibold"
                            >
                                Cancel
                            </Button>
                            <div className="flex gap-3">
                                {selectedRooms.length > 0 && (
                                    <Button
                                        color="secondary"
                                        variant="flat"
                                        onPress={handleSendConfirmation}
                                        size="lg"
                                        className="font-semibold"
                                        startContent="📧"
                                    >
                                        Send Confirmation
                                    </Button>
                                )}
                                <Button
                                    color="primary"
                                    onPress={handleAssignRooms}
                                    isDisabled={selectedRooms.length === 0}
                                    size="lg"
                                    className="font-semibold px-8"
                                    startContent="✅"
                                >
                                    Assign {selectedRooms.length} Room{selectedRooms.length !== 1 ? 's' : ''}
                                </Button>
                            </div>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}