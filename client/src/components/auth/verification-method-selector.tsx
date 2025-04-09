import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MessageCircle } from "lucide-react";

interface VerificationMethodSelectorProps {
  email: string;
  phone?: string;
  onMethodSelected: (method: "email" | "whatsapp" | "sms") => void;
  onCancel: () => void;
}

export default function VerificationMethodSelector({
  email,
  phone,
  onMethodSelected,
  onCancel,
}: VerificationMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<
    "email" | "whatsapp" | "sms"
  >("email");

  const handleContinue = () => {
    onMethodSelected(selectedMethod);
  };

  // Show phone methods only if phone is provided
  const phoneMethodsAvailable = !!phone;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Choose Verification Method</CardTitle>
        <CardDescription>
          Select how you'd like to receive your verification code
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedMethod}
          onValueChange={(value) =>
            setSelectedMethod(value as "email" | "whatsapp" | "sms")
          }
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="email" id="email" />
            <Label
              htmlFor="email"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Mail className="h-4 w-4" />
              <div>
                <div>Email</div>
                <div className="text-sm text-muted-foreground">{email}</div>
              </div>
            </Label>
          </div>

          {phoneMethodsAvailable && (
            <>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="whatsapp"
                  id="whatsapp"
                  disabled={!phoneMethodsAvailable}
                />
                <Label
                  htmlFor="whatsapp"
                  className={`flex items-center gap-2 ${!phoneMethodsAvailable ? "opacity-50" : "cursor-pointer"}`}
                >
                  <MessageCircle className="h-4 w-4" />
                  <div>
                    <div>WhatsApp</div>
                    <div className="text-sm text-muted-foreground">
                      {phone || "No phone number provided"}
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="sms"
                  id="sms"
                  disabled={!phoneMethodsAvailable}
                />
                <Label
                  htmlFor="sms"
                  className={`flex items-center gap-2 ${!phoneMethodsAvailable ? "opacity-50" : "cursor-pointer"}`}
                >
                  <Phone className="h-4 w-4" />
                  <div>
                    <div>SMS</div>
                    <div className="text-sm text-muted-foreground">
                      {phone || "No phone number provided"}
                    </div>
                  </div>
                </Label>
              </div>
            </>
          )}
        </RadioGroup>

        {!phoneMethodsAvailable && (
          <div className="mt-4 text-sm text-amber-500">
            Add your phone number in your profile to enable WhatsApp and SMS
            verification.
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={onCancel}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button onClick={handleContinue} className="w-full sm:w-auto">
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
}
