import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface LoginPanelProps {
  type: "donation" | "receiving";
  onSubmit?: (username: string, password: string) => void;
}

const LoginPanel = ({ type = "donation", onSubmit }: LoginPanelProps) => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(username, password);
    }
  };

  const title = type === "donation" ? "Donation" : "Receiving";

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 ">
      <Card className="w-full max-w-md bg-[#202042]/85 text-white border-none shadow-lg rounded-[20px]">
        <CardContent className="p-8">
          <div className="mb-8">
            <p className="text-xl font-normal">
              For <br />
            </p>
            <h2 className="text-3xl font-bold font-serif">{title}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor={`${type}-username`}
                className="block text-xs font-light tracking-wide uppercase"
              >
                USERNAME
              </label>
              <Input
                id={`${type}-username`}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-[#3A3A5C] border-none text-white placeholder:text-gray-400"
                placeholder="Enter your username"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor={`${type}-password`}
                className="block text-xs font-light tracking-wide uppercase"
              >
                PASSWORD
              </label>
              <Input
                id={`${type}-password`}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#3A3A5C] border-none text-white placeholder:text-gray-400"
                placeholder="Enter your password"
              />
            </div>

            <div className="text-center flex">
              <Link
                to="/register"
                className="text-sm text-[#AABAF7] hover:underline"
              >
                Don't Have an Account?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#2CAAB4] hover:bg-[#2CAAB4]/80 text-white font-bold rounded-full"
            >
              SUBMIT
            </Button>

            <div className="text-center flex justify-end items-center">
              <Link
                to="/password-recovery"
                className="text-sm text-[#AABAF7] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPanel;
