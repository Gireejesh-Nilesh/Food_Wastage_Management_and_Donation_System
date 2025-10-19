import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface PasswordRecoveryPanelProps {
  type?: "donation" | "receiving";
  onSubmit?: (email: string) => void;
}

const PasswordRecoveryPanel = ({ onSubmit }: PasswordRecoveryPanelProps) => {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(email);
    }
    setSubmitted(true);
  };

  const title = "Account";

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4">
      <Card className="w-full max-w-md bg-[#202042]/85 text-white border-none shadow-lg rounded-[20px]">
        <CardContent className="p-8">
          <div className="mb-8">
            <p className="text-xl font-normal">
              Recover Password For <br />
            </p>
            <h2 className="text-3xl font-bold font-serif">{title}</h2>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-300 mb-4">
                  Enter your email address and we'll send you a link to reset
                  your password.
                </p>
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
                  required
                />
              </div>

              <div className="text-center flex">
                <Link to="/" className="text-sm text-[#AABAF7] hover:underline">
                  Back to Login
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#2CAAB4] hover:bg-[#2CAAB4]/80 text-white font-bold rounded-full"
              >
                SEND RESET LINK
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="bg-[#3A3A5C]/50 p-4 rounded-lg">
                <p className="text-center text-white">
                  If an account exists with the email{" "}
                  <span className="font-semibold">{email}</span>, you will
                  receive a password reset link shortly.
                </p>
              </div>

              <div className="text-center">
                <Link to="/">
                  <Button className="bg-[#2CAAB4] hover:bg-[#2CAAB4]/80 text-white font-bold rounded-full">
                    BACK TO LOGIN
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordRecoveryPanel;
