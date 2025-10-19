import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface RegistrationPanelProps {
  type?: "donation" | "receiving";
  onSubmit?: (
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => void;
}

const RegistrationPanel = ({ onSubmit }: RegistrationPanelProps) => {
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(username, email, password, confirmPassword);
    }
  };

  const title = "Account";

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4">
      <Card className="w-full max-w-md bg-[#202042]/85 text-white border-none shadow-lg rounded-[20px]">
        <CardContent className="p-8">
          <div className="mb-8">
            <p className="text-xl font-normal">
              Register For <br />
            </p>
            <h2 className="text-3xl font-bold font-serif">{title}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-xs font-light tracking-wide uppercase"
              >
                USERNAME
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-[#3A3A5C] border-none text-white placeholder:text-gray-400"
                placeholder="Choose a username"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-xs font-light tracking-wide uppercase"
              >
                EMAIL
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#3A3A5C] border-none text-white placeholder:text-gray-400"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-xs font-light tracking-wide uppercase"
              >
                PASSWORD
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#3A3A5C] border-none text-white placeholder:text-gray-400"
                placeholder="Create a password"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirm-password"
                className="block text-xs font-light tracking-wide uppercase"
              >
                CONFIRM PASSWORD
              </label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-[#3A3A5C] border-none text-white placeholder:text-gray-400"
                placeholder="Confirm your password"
              />
            </div>

            <div className="text-center flex">
              <Link to="/" className="text-sm text-[#AABAF7] hover:underline">
                Already Have an Account?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#2CAAB4] hover:bg-[#2CAAB4]/80 text-white font-bold rounded-full"
            >
              REGISTER
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationPanel;
