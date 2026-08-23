"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Typography } from "@/components/ui/typography";
import { resetPasswordSchema, type ResetPasswordValues } from "@/lib/validations/auth";

import { Icons } from "@/components/shared/icons";

export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: ResetPasswordValues) {
    console.log(values);
    // Handle reset password logic
  }

  return (
    <div className="bg-muted rounded-[20px] p-8 shadow-sm flex flex-col gap-10 min-h-[500px]">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="bg-muted p-[11.5px] rounded-[23px] shadow-sm">
          <div className="bg-secondary size-[77px] rounded-[15.4px] flex items-center justify-center overflow-hidden p-[23px] relative animate-in zoom-in duration-500">
            <Icons.authBrand className="w-full h-full" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <Typography variant="display" className="text-foreground">
            Reset Password
          </Typography>
          <Typography variant="bodyMuted" className="max-w-[340px]">
             Please enter your new password to reset your account.
          </Typography>
        </div>
      </div>

      {/* Form */}
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both"
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password" className="font-bold cursor-pointer">
            <Typography variant="body" as="span">New Password</Typography>
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Type new strong password"
              className="bg-secondary border-none h-10 px-4 pr-10 rounded-lg text-[12px] text-muted-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/20"
              {...form.register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {form.formState.errors.password && (
            <Typography variant="tiny" className="text-destructive px-1">
              {form.formState.errors.password.message}
            </Typography>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirmPassword" className="font-bold cursor-pointer">
            <Typography variant="body" as="span">Confirm Password</Typography>
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Retype new password"
              className="bg-secondary border-none h-10 px-4 pr-10 rounded-lg text-[12px] text-muted-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/20"
              {...form.register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {form.formState.errors.confirmPassword && (
            <Typography variant="tiny" className="text-destructive px-1">
              {form.formState.errors.confirmPassword.message}
            </Typography>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-white h-10 rounded-[12px] mt-4 transition-all active:scale-[0.98]"
        >
          <Typography variant="label" className="font-bold">Save</Typography>
        </Button>
      </form>
    </div>
  );
}
