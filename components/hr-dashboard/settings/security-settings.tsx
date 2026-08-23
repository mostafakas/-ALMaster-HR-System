"use client";

import * as React from "react";
import { Check, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const securitySchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SecurityFormValues = z.infer<typeof securitySchema>;

function PasswordInput({ field, placeholder }: { field: any, placeholder?: string }) {
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <div className="relative">
      <Input
        {...field}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className="h-10 bg-secondary border-none rounded-[8px] text-[12px] font-bold text-muted-foreground font-janna placeholder:text-muted-foreground focus-visible:ring-primary/40 pr-10"
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShowPassword((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
      >
        {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
      </button>

    </div>
  );
}

export function SecuritySettings() {
  const form = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: SecurityFormValues) {
    console.log("Changing password:", values);
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1200px]">
      <p className="text-[22px] font-bold text-foreground font-janna leading-5 whitespace-nowrap">
        Security Settings
      </p>


      <div className="bg-muted rounded-[16px] p-5 flex flex-col gap-6 w-fit min-w-[760px]">
        <div className="flex flex-col gap-0.5">
          <p className="text-[18px] font-bold text-foreground font-janna leading-[22.4px]">
            Change Password
          </p>
          <p className="text-[14px] font-bold text-muted-foreground font-janna leading-[22.4px]">
            Manage your account password
          </p>
        </div>


        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              {/* Current Password - Row 1 */}
              <div className="w-[360px]">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-[14px] font-bold text-foreground font-janna leading-[22.4px]">
                        Current Password
                      </FormLabel>

                      <FormControl>
                        <PasswordInput field={field} placeholder="Type your password" />
                      </FormControl>
                      <FormMessage className="text-[11px] text-destructive" />
                    </FormItem>
                  )}
                />
              </div>

              {/* New & Confirm Password - Row 2 */}
              <div className="flex gap-4 items-start w-full">
                <div className="w-[360px]">
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-[14px] font-bold text-foreground font-janna leading-[22.4px]">
                          New Password
                        </FormLabel>

                        <FormControl>
                          <PasswordInput field={field} placeholder="Type new strong password" />
                        </FormControl>
                        <FormMessage className="text-[11px] text-destructive" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-[360px]">
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-[14px] font-bold text-foreground font-janna leading-[22.4px]">
                          Confirm Password
                        </FormLabel>

                        <FormControl>
                          <PasswordInput field={field} placeholder="Retype new password" />
                        </FormControl>
                        <FormMessage className="text-[11px] text-destructive" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="h-10 bg-primary text-primary-foreground flex items-center gap-2 px-5 rounded-[12px] font-bold text-[12px] leading-[22.4px] hover:bg-primary/90 transition-colors whitespace-nowrap w-fit font-janna"
            >

              <Check className="size-3 shrink-0" />
              Update Password
            </button>
          </form>
        </Form>
      </div>
    </div>
  );
}
