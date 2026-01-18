"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { updateSettings } from "@/app/actions/settings"
import { Separator } from "@/components/ui/separator"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const settingsFormSchema = z.object({
  hotelName: z.string().min(1, "Hotel name is required"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(1, "Contact phone is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
  currency: z.string().min(1, "Currency is required"),
  taxRate: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0 && parseFloat(val) <= 100, "Tax rate must be between 0 and 100"),
  checkInTime: z.string().min(1, "Check-in time is required"),
  checkOutTime: z.string().min(1, "Check-out time is required"),
  cancellationPolicy: z.string().optional(),
  emailNotifications: z.object({
    bookingConfirmation: z.boolean(),
    paymentReceived: z.boolean(),
    checkInReminder: z.boolean(),
    checkOutReminder: z.boolean(),
  }),
  paymentGateways: z.object({
    stripe: z.object({
      enabled: z.boolean(),
      testMode: z.boolean(),
    }),
    razorpay: z.object({
      enabled: z.boolean(),
      testMode: z.boolean(),
    }),
  }),
})

type SettingsFormValues = z.infer<typeof settingsFormSchema>

interface SettingsFormProps {
  settings: any
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      hotelName: settings.hotelName || "",
      contactEmail: settings.contactEmail || "",
      contactPhone: settings.contactPhone || "",
      address: settings.address || "",
      city: settings.city || "",
      state: settings.state || "",
      country: settings.country || "",
      zipCode: settings.zipCode || "",
      currency: settings.currency || "USD",
      taxRate: settings.taxRate?.toString() || "0",
      checkInTime: settings.checkInTime || "15:00",
      checkOutTime: settings.checkOutTime || "11:00",
      cancellationPolicy: settings.cancellationPolicy || "",
      emailNotifications: {
        bookingConfirmation: settings.emailNotifications?.bookingConfirmation ?? true,
        paymentReceived: settings.emailNotifications?.paymentReceived ?? true,
        checkInReminder: settings.emailNotifications?.checkInReminder ?? true,
        checkOutReminder: settings.emailNotifications?.checkOutReminder ?? true,
      },
      paymentGateways: {
        stripe: {
          enabled: settings.paymentGateways?.stripe?.enabled ?? true,
          testMode: settings.paymentGateways?.stripe?.testMode ?? true,
        },
        razorpay: {
          enabled: settings.paymentGateways?.razorpay?.enabled ?? false,
          testMode: settings.paymentGateways?.razorpay?.testMode ?? true,
        },
      },
    },
  })

  const onSubmit = (data: SettingsFormValues) => {
    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append("hotelName", data.hotelName)
        formData.append("contactEmail", data.contactEmail)
        formData.append("contactPhone", data.contactPhone)
        if (data.address) formData.append("address", data.address)
        if (data.city) formData.append("city", data.city)
        if (data.state) formData.append("state", data.state)
        if (data.country) formData.append("country", data.country)
        if (data.zipCode) formData.append("zipCode", data.zipCode)
        formData.append("currency", data.currency)
        formData.append("taxRate", data.taxRate)
        formData.append("checkInTime", data.checkInTime)
        formData.append("checkOutTime", data.checkOutTime)
        if (data.cancellationPolicy) formData.append("cancellationPolicy", data.cancellationPolicy)
        formData.append("emailNotifications.bookingConfirmation", data.emailNotifications.bookingConfirmation.toString())
        formData.append("emailNotifications.paymentReceived", data.emailNotifications.paymentReceived.toString())
        formData.append("emailNotifications.checkInReminder", data.emailNotifications.checkInReminder.toString())
        formData.append("emailNotifications.checkOutReminder", data.emailNotifications.checkOutReminder.toString())
        formData.append("paymentGateways.stripe.enabled", data.paymentGateways.stripe.enabled.toString())
        formData.append("paymentGateways.stripe.testMode", data.paymentGateways.stripe.testMode.toString())
        formData.append("paymentGateways.razorpay.enabled", data.paymentGateways.razorpay.enabled.toString())
        formData.append("paymentGateways.razorpay.testMode", data.paymentGateways.razorpay.testMode.toString())

        const result = await updateSettings(formData)

        if (result.error) {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Success",
            description: "Settings updated successfully",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update settings",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Hotel Information */}
        <Card>
          <CardHeader>
            <CardTitle>Hotel Information</CardTitle>
            <CardDescription>Basic hotel details and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="hotelName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hotel Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State/Province</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip/Postal Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Booking Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Settings</CardTitle>
            <CardDescription>Configure booking policies and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                        <SelectItem value="CAD">CAD (C$)</SelectItem>
                        <SelectItem value="AUD">AUD (A$)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="taxRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" max="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="checkInTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check-in Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="checkOutTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check-out Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="cancellationPolicy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cancellation Policy</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormDescription>
                    Describe your cancellation policy for customers
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Email Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Email Notifications</CardTitle>
            <CardDescription>Configure automated email notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="emailNotifications.bookingConfirmation"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Booking Confirmation</FormLabel>
                    <FormDescription>
                      Send confirmation emails when bookings are created
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emailNotifications.paymentReceived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Payment Received</FormLabel>
                    <FormDescription>
                      Send emails when payments are successfully processed
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emailNotifications.checkInReminder"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Check-in Reminder</FormLabel>
                    <FormDescription>
                      Send reminder emails before check-in date
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emailNotifications.checkOutReminder"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Check-out Reminder</FormLabel>
                    <FormDescription>
                      Send reminder emails before check-out date
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Payment Gateways */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Gateways</CardTitle>
            <CardDescription>Configure payment gateway settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-4">Stripe</h4>
              <div className="space-y-4 pl-4">
                <FormField
                  control={form.control}
                  name="paymentGateways.stripe.enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable Stripe</FormLabel>
                        <FormDescription>
                          Allow payments through Stripe
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentGateways.stripe.testMode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Test Mode</FormLabel>
                        <FormDescription>
                          Use Stripe test mode for development
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="text-sm font-medium mb-4">Razorpay</h4>
              <div className="space-y-4 pl-4">
                <FormField
                  control={form.control}
                  name="paymentGateways.razorpay.enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable Razorpay</FormLabel>
                        <FormDescription>
                          Allow payments through Razorpay
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentGateways.razorpay.testMode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Test Mode</FormLabel>
                        <FormDescription>
                          Use Razorpay test mode for development
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
