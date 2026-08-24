"use client";

import * as React from "react";
import { Check, Upload, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useAppSelector } from "@/lib/store/hooks";

const profileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  emailAddress: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(1, "Phone number is required").optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function AccountSettings() {
  const user = useAppSelector((state) => state.auth.user);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.name || "",
      emailAddress: user?.email || "",
      phoneNumber: user?.phone || "",
    },
  });

  // Re-sync form when user changes
  React.useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.name || "",
        emailAddress: user.email || "",
        phoneNumber: user.phone || "",
      });
    }
  }, [user, form]);

  function onSubmit(values: ProfileFormValues) {
    console.log("Saving profile:", values);
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1200px]">
      {/* Section Header */}
      <p className="text-[22px] font-bold text-foreground font-janna leading-5 whitespace-nowrap">
        Account Settings
      </p>


      <div className="flex flex-col gap-6">
        {/* Profile Information Card */}
        <div className="bg-muted rounded-[16px] p-5 flex flex-col gap-6 w-fit min-w-[940px]">
          <div className="flex flex-col gap-0.5">
            <p className="text-[18px] font-bold text-foreground font-janna leading-[22.4px]">
              Profile Information
            </p>
            <p className="text-muted-foreground text-[14px] font-bold font-janna leading-[22.4px]">
              Your personal information and account details
            </p>
          </div>


          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex items-start gap-6">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <div className="size-[100px] rounded-full overflow-hidden">
                    <Avatar className="size-full">
                      <AvatarImage src="http://localhost:3845/assets/a3ff8d4eceda4a80dfd80cb588c2e18316fa3a7e.png" />
                      <AvatarFallback className="text-2xl font-bold font-janna">JS</AvatarFallback>
                    </Avatar>
                  </div>
                  <button
                    type="button"
                    className="text-[12px] font-bold text-primary font-janna leading-[22.4px] hover:underline transition-all whitespace-nowrap"
                  >
                    Change Image
                  </button>

                </div>

                {/* Form Fields */}
                <div className="flex flex-col flex-1 min-w-0 max-w-[788px]">
                  <div className="flex gap-4 items-start w-full">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem className="flex-1 min-w-0">
                          <FormLabel className="text-[14px] font-bold text-foreground font-janna leading-[22.4px]">
                            Full Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="h-10 bg-secondary border-none rounded-[8px] text-[12px] font-bold text-muted-foreground font-janna placeholder:text-muted-foreground focus-visible:ring-primary/40"
                            />
                          </FormControl>

                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="emailAddress"
                      render={({ field }) => (
                        <FormItem className="flex-1 min-w-0">
                          <FormLabel className="text-[14px] font-bold text-foreground font-janna leading-[22.4px]">
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              className="h-10 bg-secondary border-none rounded-[8px] text-[12px] font-bold text-muted-foreground font-janna placeholder:text-muted-foreground focus-visible:ring-primary/40"
                            />
                          </FormControl>

                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem className="flex-1 min-w-0">
                          <FormLabel className="text-[14px] font-bold text-foreground font-janna leading-[22.4px]">
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="h-10 bg-secondary border-none rounded-[8px] text-[12px] font-bold text-muted-foreground font-janna placeholder:text-muted-foreground focus-visible:ring-primary/40"
                            />
                          </FormControl>

                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-6">
                <button
                  type="submit"
                  className="h-10 bg-primary text-primary-foreground flex items-center gap-2 px-5 rounded-[12px] font-bold text-[12px] font-janna leading-[22.4px] hover:bg-primary/90 transition-colors whitespace-nowrap"
                >

                  <Check className="size-3 shrink-0" />
                  Save Changes
                </button>
              </div>
            </form>
          </Form>
        </div>

        {/* Logout Card */}
        <div className="bg-muted rounded-[16px] p-5 flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-0.5">
            <p className="text-[18px] font-bold text-foreground font-janna leading-[22.4px]">
              Logout
            </p>
            <p className="text-muted-foreground text-[14px] font-bold font-janna leading-[22.4px]">
              Logout your account (Your timers will stop)
            </p>
          </div>


          <button
            type="button"
            className="h-10 bg-destructive text-destructive-foreground flex items-center gap-2 px-5 rounded-[12px] font-bold text-[12px] font-janna leading-[22.4px] hover:bg-destructive/90 transition-colors whitespace-nowrap w-fit"
          >

            <LogOut className="size-3 shrink-0" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
