"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const filterSchema = z.object({
  from: z.string().optional(),
  toType: z.string().optional(),
  toMember: z.string().optional(),
  date: z.date().optional(),
});

export function ArchiveFilters() {
  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      from: "",
      toType: "",
      toMember: "",
    },
  });

  return (
    <Form {...form}>
      <form className="flex flex-col gap-3 px-4">
        <FormField
          control={form.control}
          name="from"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold text-foreground font-janna">From</FormLabel>

              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full h-10 bg-secondary border-none rounded-lg text-xs font-bold text-foreground font-janna">
                    <SelectValue placeholder="Select an employee to view his chats" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  <SelectItem value="u1">David Beckham</SelectItem>
                  <SelectItem value="u2">Sarah Collins</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-2">
          <FormLabel className="text-xs font-bold text-foreground font-janna">To</FormLabel>

            <div className="flex gap-1">
              <FormField
                control={form.control}
                name="toType"
                render={({ field }) => (
                  <FormItem className="md:min-w-[125px] max-w-full">
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full h-10 bg-secondary border-none rounded-lg text-xs font-bold text-foreground font-janna">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent className="w-full">
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="department">Department</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="toMember"
                render={({ field }) => (
                  <FormItem className="flex-1 min-w-0">
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full h-10 bg-secondary border-none rounded-lg text-xs font-bold text-foreground font-janna">
                          <SelectValue placeholder="Select the second member" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="u-john">John Smith</SelectItem>
                        <SelectItem value="dept-design">Design Dept</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
        </div>

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-xs font-bold text-foreground font-janna">Date</FormLabel>

              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      variant={"outline"}
                      className={cn(
                        "h-10 pl-3 text-left font-normal bg-secondary border-none rounded-lg text-xs font-bold text-foreground font-janna hover:bg-secondary/80 w-full",
                        !field.value && "text-muted-foreground"
                      )}

                    >
                      {field.value ? (
                        format(field.value, "dd/MM/yyyy")
                      ) : (
                        <span>dd/mm/yyyy</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  }
                />
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />

      </form>
    </Form>
  );
}
