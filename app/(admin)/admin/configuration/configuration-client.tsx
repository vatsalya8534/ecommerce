"use client"

import React, { useState } from "react"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Field, FieldLabel, FieldContent, FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TrashIcon, PlusIcon } from "lucide-react"

export default function ConfigurationPage() {
    const [paymentGateways, setPaymentGateways] = useState([
        { id: 1, name: "Stripe", publicKey: "", secretKey: "" },
        { id: 2, name: "PayPal", publicKey: "", secretKey: "" },
        { id: 3, name: "Razorpay", publicKey: "", secretKey: "" },
    ])

    const [offices, setOffices] = useState([
        { id: 1, name: "", address: "", city: "", phone: "", email: "" },
    ])

    const addPaymentGateway = () => {
        const newId = Math.max(...paymentGateways.map(g => g.id), 0) + 1
        setPaymentGateways([...paymentGateways, { id: newId, name: "", publicKey: "", secretKey: "" }])
    }

    const removePaymentGateway = (id: number) => {
        setPaymentGateways(paymentGateways.filter(g => g.id !== id))
    }

    const updatePaymentGateway = (id: number, field: string, value: string) => {
        setPaymentGateways(paymentGateways.map(g => 
            g.id === id ? { ...g, [field]: value } : g
        ))
    }

    const addOffice = () => {
        const newId = Math.max(...offices.map(o => o.id), 0) + 1
        setOffices([...offices, { id: newId, name: "", address: "", city: "", phone: "", email: "" }])
    }

    const removeOffice = (id: number) => {
        setOffices(offices.filter(o => o.id !== id))
    }

    const updateOffice = (id: number, field: string, value: string) => {
        setOffices(offices.map(o => 
            o.id === id ? { ...o, [field]: value } : o
        ))
    }
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Configuration</h1>
            </div>

            <div className="rounded-lg border bg-background p-4">
                <Tabs defaultValue="general">
                    <div className="flex flex-col items-start gap-6 w-full">
                        <TabsList className="w-full">
                            <TabsTrigger value="general">General</TabsTrigger>
                            <TabsTrigger value="email">Email</TabsTrigger>
                            <TabsTrigger value="payment">Payment Gateway</TabsTrigger>
                            <TabsTrigger value="shipping">Shipping</TabsTrigger>
                            <TabsTrigger value="office">Office</TabsTrigger>
                        </TabsList>

                        <div className="w-full">
                            <TabsContent value="general">
                                <form className="space-y-4">
                                    <Field>
                                        <FieldLabel>Site name</FieldLabel>
                                        <FieldContent>
                                            <Input defaultValue="My Store" />
                                            <FieldDescription className="mt-1">Visible site title used in emails and the storefront.</FieldDescription>
                                        </FieldContent>
                                    </Field>

                                    <Field>
                                        <FieldLabel>Store timezone</FieldLabel>
                                        <FieldContent>
                                            <Input defaultValue="UTC" />
                                            <FieldDescription className="mt-1">Timezone used for orders and reporting.</FieldDescription>
                                        </FieldContent>
                                    </Field>

                                    <Field>
                                        <FieldLabel>Logo</FieldLabel>
                                        <FieldContent>
                                            <Input type="file" accept="image/*" />
                                            <FieldDescription className="mt-1">Store logo displayed in header and emails. Recommended size: 200x200px.</FieldDescription>
                                        </FieldContent>
                                    </Field>

                                    <Field>
                                        <FieldLabel>Favicon</FieldLabel>
                                        <FieldContent>
                                            <Input type="file" accept="image/*" />
                                            <FieldDescription className="mt-1">Browser tab icon. Recommended size: 32x32px or 64x64px.</FieldDescription>
                                        </FieldContent>
                                    </Field>

                                    <div className="pt-2 flex justify-end">
                                        <Button type="button">Save General</Button>
                                    </div>
                                </form>
                            </TabsContent>

                            <TabsContent value="email">
                                <form className="space-y-4">
                                    <Field>
                                        <FieldLabel>SMTP host</FieldLabel>
                                        <FieldContent>
                                            <Input placeholder="smtp.example.com" />
                                            <FieldDescription className="mt-1">SMTP server used to send transactional email.</FieldDescription>
                                        </FieldContent>
                                    </Field>

                                    <Field>
                                        <FieldLabel>SMTP port</FieldLabel>
                                        <FieldContent>
                                            <Input placeholder="587" />
                                        </FieldContent>
                                    </Field>

                                    <Field>
                                        <FieldLabel>From address</FieldLabel>
                                        <FieldContent>
                                            <Input placeholder="no-reply@example.com" />
                                        </FieldContent>
                                    </Field>

                                    <Field>
                                        <FieldLabel>Email password</FieldLabel>
                                        <FieldContent>
                                            <Input type="password" placeholder="Enter SMTP password" />
                                            <FieldDescription className="mt-1">SMTP authentication password for sending emails.</FieldDescription>
                                        </FieldContent>
                                    </Field>

                                    <div className="pt-2 flex justify-end">
                                        <Button type="button">Save Email</Button>
                                    </div>
                                </form>
                            </TabsContent>

                            <TabsContent value="payment">
                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {paymentGateways.map((gateway) => (
                                            <Card key={gateway.id} className="flex flex-col">
                                                <div className="flex items-center justify-between px-4 pt-4">
                                                    <h3 className="text-lg font-semibold">{gateway.name || "New Gateway"}</h3>
                                                    {paymentGateways.length > 1 && (
                                                        <Button 
                                                            type="button" 
                                                            variant="ghost" 
                                                            size="icon-sm"
                                                            onClick={() => removePaymentGateway(gateway.id)}
                                                        >
                                                            <TrashIcon className="w-4 h-4 text-destructive" />
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="px-4 pb-4 space-y-4 flex-1">
                                                    <Field>
                                                        <FieldLabel>Gateway Name</FieldLabel>
                                                        <FieldContent>
                                                            <Input 
                                                                placeholder="e.g., Stripe, PayPal, Razorpay" 
                                                                value={gateway.name}
                                                                onChange={(e) => updatePaymentGateway(gateway.id, "name", e.target.value)}
                                                            />
                                                        </FieldContent>
                                                    </Field>

                                                    <Field>
                                                        <FieldLabel>Public Key</FieldLabel>
                                                        <FieldContent>
                                                            <Input 
                                                                placeholder="Your public/publishable key..." 
                                                                value={gateway.publicKey}
                                                                onChange={(e) => updatePaymentGateway(gateway.id, "publicKey", e.target.value)}
                                                            />
                                                        </FieldContent>
                                                    </Field>

                                                    <Field>
                                                        <FieldLabel>Secret Key</FieldLabel>
                                                        <FieldContent>
                                                            <Input 
                                                                type="password" 
                                                                placeholder="Your secret key..." 
                                                                value={gateway.secretKey}
                                                                onChange={(e) => updatePaymentGateway(gateway.id, "secretKey", e.target.value)}
                                                            />
                                                        </FieldContent>
                                                    </Field>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>

                                    <Button 
                                        type="button" 
                                        variant="outline"
                                        onClick={addPaymentGateway}
                                        className="gap-2 w-full"
                                    >
                                        <PlusIcon className="w-4 h-4" />
                                        Add Payment Gateway
                                    </Button>

                                    <div className="pt-2 flex justify-end">
                                        <Button type="button">Save Payment Gateways</Button>
                                    </div>
                                </form>
                            </TabsContent>

                            <TabsContent value="shipping">
                                <form className="space-y-4">
                                    <Field>
                                        <FieldLabel>Default carrier</FieldLabel>
                                        <FieldContent>
                                            <Input placeholder="UPS" />
                                        </FieldContent>
                                    </Field>

                                    <Field>
                                        <FieldLabel>Free shipping threshold</FieldLabel>
                                        <FieldContent>
                                            <Input placeholder="0.00" />
                                            <FieldDescription className="mt-1">Orders above this amount will get free shipping.</FieldDescription>
                                        </FieldContent>
                                    </Field>

                                    <div className="pt-2 flex justify-end">
                                        <Button type="button">Save Shipping</Button>
                                    </div>
                                </form>
                            </TabsContent>

                            <TabsContent value="office">
                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {offices.map((office) => (
                                            <Card key={office.id} className="flex flex-col">
                                                <div className="flex items-center justify-between px-4 pt-4">
                                                    <h3 className="text-lg font-semibold">{office.name || "New Office"}</h3>
                                                    {offices.length > 1 && (
                                                        <Button 
                                                            type="button" 
                                                            variant="ghost" 
                                                            size="icon-sm"
                                                            onClick={() => removeOffice(office.id)}
                                                        >
                                                            <TrashIcon className="w-4 h-4 text-destructive" />
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="px-4 pb-4 space-y-4 flex-1">
                                                    <Field>
                                                        <FieldLabel>Office Name</FieldLabel>
                                                        <FieldContent>
                                                            <Input 
                                                                placeholder="e.g., New York Office" 
                                                                value={office.name}
                                                                onChange={(e) => updateOffice(office.id, "name", e.target.value)}
                                                            />
                                                        </FieldContent>
                                                    </Field>

                                                    <Field>
                                                        <FieldLabel>Address</FieldLabel>
                                                        <FieldContent>
                                                            <Input 
                                                                placeholder="Street address" 
                                                                value={office.address}
                                                                onChange={(e) => updateOffice(office.id, "address", e.target.value)}
                                                            />
                                                        </FieldContent>
                                                    </Field>

                                                    <Field>
                                                        <FieldLabel>City</FieldLabel>
                                                        <FieldContent>
                                                            <Input 
                                                                placeholder="City" 
                                                                value={office.city}
                                                                onChange={(e) => updateOffice(office.id, "city", e.target.value)}
                                                            />
                                                        </FieldContent>
                                                    </Field>

                                                    <Field>
                                                        <FieldLabel>Phone</FieldLabel>
                                                        <FieldContent>
                                                            <Input 
                                                                type="tel"
                                                                placeholder="+1 (555) 000-0000" 
                                                                value={office.phone}
                                                                onChange={(e) => updateOffice(office.id, "phone", e.target.value)}
                                                            />
                                                        </FieldContent>
                                                    </Field>

                                                    <Field>
                                                        <FieldLabel>Email</FieldLabel>
                                                        <FieldContent>
                                                            <Input 
                                                                type="email"
                                                                placeholder="office@example.com" 
                                                                value={office.email}
                                                                onChange={(e) => updateOffice(office.id, "email", e.target.value)}
                                                            />
                                                        </FieldContent>
                                                    </Field>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>

                                    <Button 
                                        type="button" 
                                        variant="outline"
                                        onClick={addOffice}
                                        className="gap-2 w-full"
                                    >
                                        <PlusIcon className="w-4 h-4" />
                                        Add Office
                                    </Button>

                                    <div className="pt-2 flex justify-end">
                                        <Button type="button">Save Offices</Button>
                                    </div>
                                </form>
                            </TabsContent>
                        </div>
                    </div>
                </Tabs>
            </div>
        </div>
    )
}
