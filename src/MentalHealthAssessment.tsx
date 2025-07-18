import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface PredictedResult {
  predicatedLabel: string;
  confidenceScore: string;
}

const featureSchema = z.object({
  Gender: z.number().int().min(0, { message: "Gender must be 0 (Female) or 1 (Male)" }).max(1, { message: "Gender must be 0 (Female) or 1 (Male)" }),
  Age: z.number().int().min(10, { message: "Age must be between 10 and 100" }).max(100, { message: "Age must be between 10 and 100" }),
  "Academic Pressure": z.number().int().min(1, { message: "Academic Pressure must be between 1 (Very Low) and 5 (Very High)" }).max(5, { message: "Academic Pressure must be between 1 (Very Low) and 5 (Very High)" }),
  "Study Satisfaction": z.number().int().min(1, { message: "Study Satisfaction must be between 1 (Very Dissatisfied) and 5 (Very Satisfied)" }).max(5, { message: "Study Satisfaction must be between 1 (Very Dissatisfied) and 5 (Very Satisfied)" }),
  "Sleep Duration": z.number().int().min(0, { message: "Sleep Duration must be a valid option (0 to 3)" }).max(3, { message: "Sleep Duration must be a valid option (0 to 3)" }),
  "Dietary Habits": z.number().int().min(0, { message: "Dietary Habits must be 0 (Healthy), 1 (Moderate), or 2 (Unhealthy)" }).max(2, { message: "Dietary Habits must be 0 (Healthy), 1 (Moderate), or 2 (Unhealthy)" }),
  "Have you ever had suicidal thoughts ?": z.number().int().min(0, { message: "Value must be 0 (No) or 1 (Yes)" }).max(1, { message: "Value must be 0 (No) or 1 (Yes)" }),
  "Study Hours": z.number().int().min(1, { message: "Study Hours must be between 1 and 12" }).max(12, { message: "Study Hours must be between 1 and 12" }),
  "Financial Stress": z.number().int().min(1, { message: "Financial Stress must be between 1 (Very Low) and 5 (Very High)" }).max(5, { message: "Financial Stress must be between 1 (Very Low) and 5 (Very High)" }),
  "Family History of Mental Illness": z.number().int().min(0, { message: "Value must be 0 (No) or 1 (Yes)" }).max(1, { message: "Value must be 0 (No) or 1 (Yes)" }),
});

const MentalHealthForm = () => {
  const [result, setResult] = useState<PredictedResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof featureSchema>>({
    resolver: zodResolver(featureSchema),
    mode: "onChange", 
    defaultValues: {
      Gender: 0,
      Age: 18,
      "Academic Pressure": 3,
      "Study Satisfaction": 3,
      "Sleep Duration": 1,
      "Dietary Habits": 1,
      "Have you ever had suicidal thoughts ?": 0,
      "Study Hours": 3,
      "Financial Stress": 3,
      "Family History of Mental Illness": 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof featureSchema>) => {
    console.log(values);
    setIsLoading(true);
    
    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ values: values }),
      });

      const apiResult = await response.json();
      
      if (apiResult.error) {
        console.error("Prediction Error:", apiResult.error);
        setResult({ predicatedLabel: "Error", confidenceScore: "N/A" });
        return;
      }
      
      setResult({
        predicatedLabel: apiResult.is_depressed,
        confidenceScore: apiResult.confidence_score + "%",
      });
    } catch (error) {
      console.error("Server Error:", error);
      setResult({ predicatedLabel: "Server Error", confidenceScore: "N/A" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md border-none shadow-2xl">
        <CardHeader>
          <CardTitle>Mental Health Assessment</CardTitle>
          <CardDescription>
            Fill out the form to assess your mental health indicators.
            {result && (
              <div className="mt-4 p-4 bg-gray-100 rounded-md">
                <Label className="block font-semibold">Prediction: {result.predicatedLabel}</Label>
                <Label className="block">Confidence: {result.confidenceScore}</Label>
              </div>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <div className="space-y-4">
              {Object.keys(featureSchema.shape).map((key) => (
                <FormField
                  key={key}
                  control={form.control}
                  name={key as keyof z.infer<typeof featureSchema>}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{key}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '') {
                              field.onChange('');
                            } else {
                              const numValue = Number(value);
                              if (!isNaN(numValue)) {
                                field.onChange(numValue);
                              }
                            }
                          }}
                          onBlur={field.onBlur}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <CardFooter className="flex justify-end p-0 pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-black text-white"
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Submit Assessment"}
                </Button>
              </CardFooter>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentalHealthForm;