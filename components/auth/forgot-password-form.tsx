"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Typography } from "@/components/ui/typography";
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/lib/validations/auth";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Icons } from "@/components/shared/icons";

export function ForgotPasswordForm() {
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: ForgotPasswordValues) {
    console.log(values);
    // Handle forgot password logic
  }

  return (
    <div className="bg-muted rounded-[20px] p-8 shadow-sm flex flex-col gap-10 min-h-[460px]">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="bg-muted p-[11.5px] rounded-[23px] shadow-sm">
          <div className="bg-secondary size-[77px] rounded-[15.4px] flex items-center justify-center overflow-hidden p-[23px] relative animate-in zoom-in duration-500">
            <Icons.authBrand className="w-full h-full" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <Typography variant="display" className="text-foreground">
            Forgot Password?
          </Typography>
          <Typography variant="bodyMuted" className="max-w-[340px]">
             Enter your email address and we’ll send you password reset instructions.
          </Typography>
        </div>
      </div>

      {/* Form */}
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both"
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email" className="font-bold cursor-pointer">
            <Typography variant="body" as="span">Email Address</Typography>
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="johnsmith@almaster.com"
              className="bg-secondary border-none h-10 px-4 rounded-lg text-[12px] text-muted-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/20"
              {...form.register("email")}
            />
          </div>
          {form.formState.errors.email && (
            <Typography variant="tiny" className="text-destructive px-1">
              {form.formState.errors.email.message}
            </Typography>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white h-10 rounded-[12px] transition-all active:scale-[0.98]"
          >
            <Typography variant="label" className="font-bold">Send Link</Typography>
          </Button>
          
          <div className="flex justify-center">
            <Link
              href="/login"
              className="text-muted-foreground hover:text-primary transition-all flex items-center gap-1.5"
            >
              <ArrowLeft size={14} />
              <Typography variant="label" className="font-bold">Return to Login</Typography>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
