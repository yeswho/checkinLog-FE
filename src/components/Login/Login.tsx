import React from 'react';
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { useLogin } from "../../hooks/useLogin";
import { EyeIcon, EyeOffIcon, LockIcon, User } from 'lucide-react';
import { toast } from "sonner";

interface LoginFormData {
    email: string;
    password: string;
}

export default function Login() {
    const [isVisible, setIsVisible] = React.useState(false);
    const [formData, setFormData] = React.useState<LoginFormData>({
        email: '',
        password: ''
    });

    
    const { mutate: login, isLoading }: any = useLogin();

    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login(formData, {
            onSuccess: () => {
              toast.success('Login successful!');
            },
            onError: (error: any) => {
              toast.error(error.response.data.message);
            }
          });
    };

    return (
        <div className="flex items-center justify-center mt-52">
            <Card className="w-full max-w-md">
                <CardHeader className="flex flex-col gap-1 px-8 pt-6">
                    <h1 className="text-2xl font-bold">Welcome to HMS</h1>
                    <p className="text-default-500">Please log in with the provided credentials to continue</p>
                </CardHeader>
                <CardBody className="px-8 pb-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <Input
                            type="text"
                            label="Username"
                            variant="bordered"
                            value={formData.email}
                            required
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            startContent={<User className="text-default-400" size={20} />}
                        />
                        <Input
                            label="Password"
                            variant="bordered"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            startContent={<LockIcon className="text-default-400" size={20} />}
                            endContent={
                                <button type="button" onClick={toggleVisibility}>
                                    {isVisible ? (
                                        <EyeOffIcon className="text-default-400" size={20} />
                                    ) : (
                                        <EyeIcon className="text-default-400" size={20} />
                                    )}
                                </button>
                            }
                            type={isVisible ? "text" : "password"}
                        />
                        <div className="flex justify-end">
                            <Button
                                color="primary"
                                type="submit"
                                className="w-full"
                                size="lg"
                                isLoading={isLoading}
                            >
                                Log in
                            </Button>
                        </div>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}