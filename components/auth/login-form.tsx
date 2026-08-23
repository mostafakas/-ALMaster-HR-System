"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Typography } from "@/components/ui/typography";
import { loginSchema, type LoginValues } from "@/lib/validations/auth";
import { useLoginMutation } from "@/lib/store/services/authApi";
import Link from "next/link";
import { Icons } from "@/components/shared/icons";
import { useAppDispatch } from "@/lib/store/hooks";
import { setCredentials } from "@/lib/store/slices/auth-slice";

export function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [login, { isLoading }] = useLoginMutation();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginValues) {
    setServerError(null);
    try {
      const res: any = await login(values).unwrap();
      const payload = res?.data || res;
      const rawUser = payload?.user;
      const token = payload?.accessToken || payload?.token;
      if (rawUser && token) {
        dispatch(
          setCredentials({
            user: {
              id: rawUser.id,
              name: rawUser.fullName || rawUser.name || rawUser.email,
              email: rawUser.email,
              role: rawUser.role,
              avatar: rawUser.avatarUrl || undefined,
            },
            token,
          })
        );
      }
      window.location.href = "/client-relations-management";
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        (Array.isArray(err?.data?.message)
          ? err.data.message.join(", ")
          : "Invalid email or password. Please try again.");
      setServerError(msg);
    }
  }

  return (
    <div className="bg-muted rounded-[20px] p-8 shadow-sm flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="bg-muted p-[11.5px] rounded-[23px] shadow-sm">
          <div className="bg-secondary size-[77px] rounded-[15.4px] flex items-center justify-center overflow-hidden p-[17px] relative">
            {/* AlMaster HR Logo */}
            <Icons.logo className="w-full h-full" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <Typography variant="display" className="text-foreground">
            Welcome Back
          </Typography>
          <Typography variant="bodyMuted">
            Enter your data and Log into your account.
          </Typography>
        </div>
      </div>

      {/* Form */}
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both"
      >
        {/* Email field */}
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

        {/* Password field */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password" className="font-bold cursor-pointer">
            <Typography variant="body" as="span">Password</Typography>
          </Label>
          <div className="relative">
            <Input
              id="password"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              autoCapitalize="none"
              autoComplete="current-password"
              className="bg-secondary border-none h-10 px-4 pr-12 rounded-lg text-[12px] text-muted-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/20"
              {...form.register("password")}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </Button>
          </div>
          {form.formState.errors.password && (
            <Typography variant="tiny" className="text-destructive px-1">
              {form.formState.errors.password.message}
            </Typography>
          )}
        </div>

        {serverError && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-center">
            <Typography variant="tiny" className="text-destructive font-medium">
              {serverError}
            </Typography>
          </div>
        )}

        <Button
          className="w-full h-[56px] text-lg rounded-[14px]"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Logging in...
            </span>
          ) : (
            "Log In"
          )}
        </Button>
      </form>

      <div className="text-center">
        <Typography variant="bodyMuted">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-primary font-bold hover:underline"
          >
            Create account
          </Link>
        </Typography>
      </div>
    </div>
  );
}
