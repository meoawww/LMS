"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TitleFormProps {
  initialData: {
    title: string;
  }
  courseId: string;
}

const FormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).max(100, { message: "Keep title short and simple so that it's easy to remember" })
})

export const TitleForm = ({
  initialData,
  courseId
}: TitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: initialData
  })

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast({
        variant: "success",
        title: "Course title updated successfully"
      })
      toggleEdit();
      router.refresh();
    }
    catch {
      toast({
        variant: "destructive",
        title: "Something went wrong",
      })
    }
  }
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Title
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>
      <div>
        {!isEditing && (
          <p className="text-sm mt-2">
            {initialData.title}
          </p>
        )}
        {isEditing && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g: Beginner Yoga Classes"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-x-2">
                <Button
                  disabled={!isValid || isSubmitting}
                  type="submit"
                >
                  Save
                </Button>
              </div>

            </form>
          </Form>
        )}
      </div>
    </div>
  )
}