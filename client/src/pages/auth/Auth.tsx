import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import image from "../../assets/image.png"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"

export default function Auth() {
    const [userState, setUserState] = useState({
        email: "",
        otp: "",
    });


    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-4xl">
                <div className="flex flex-col gap-6">
                    <Card className="overflow-hidden p-0">
                        <CardContent className="grid p-0 md:grid-cols-2 items-center">
                            <form className="p-6 md:p-8">
                                <FieldGroup>
                                    <div className="flex flex-col items-center gap-2 text-center">
                                        <h1 className="text-2xl font-bold">Welcome</h1>
                                        <p className="text-balance text-muted-foreground">
                                            Login to your VideoLabs account
                                        </p>
                                    </div>

                                    <Field>
                                        <FieldLabel htmlFor="email">Email</FieldLabel>
                                        <div className="flex flex-row gap-2">
                                            <div className="w-full">
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    onChange={(e) => setUserState({ ...userState, email: e.target.value })}
                                                    placeholder="m@example.com"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Button type="submit">verify</Button>
                                            </div>
                                        </div>
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="password">One-Time Password</FieldLabel>
                                        <div className="flex flex-row gap-2">
                                            <div>
                                                <InputOTP
                                                    maxLength={6}
                                                    value={userState.otp}
                                                    onChange={(otp) => setUserState({ ...userState, otp })}
                                                >
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={0} />
                                                        <InputOTPSlot index={1} />
                                                        <InputOTPSlot index={2} />
                                                    </InputOTPGroup>
                                                    <InputOTPSeparator />
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={3} />
                                                        <InputOTPSlot index={4} />
                                                        <InputOTPSlot index={5} />
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </div>
                                            <div className="w-full">
                                                <Button type="submit" className="w-full">Resend</Button>
                                            </div>
                                        </div>
                                    </Field>

                                    <Field>
                                        <Button type="submit">Get Authenticated</Button>
                                    </Field>

                                </FieldGroup>
                            </form>
                            <div className="relative hidden bg-muted md:block">
                                <img src={image} alt="Auth" />
                            </div>
                        </CardContent>
                    </Card>
                    <FieldDescription className="px-6 text-center">
                        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                        and <a href="#">Privacy Policy</a>.
                    </FieldDescription>
                </div>
            </div>
        </div >
    )
}