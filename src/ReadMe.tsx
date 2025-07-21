import { fieldGuide } from "../src/Type"
import { Badge } from "./components/ui/badge"
import { Label } from "./components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const ReadMe = () => {
  return (
    <Card className="w-full max-w-3xl border-none shadow-2xl">
      <CardHeader className="text-xl">
        <CardTitle className="text-red-600">Read Me!</CardTitle>
        <CardDescription className="text-green-600 font-bold text-lg">
          Please fill the form according to the format given below
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {fieldGuide.map((field) => (
            <div key={field.title} className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                <Label className="font-semibold text-xl">{field.title}</Label>
                <Label className="text-muted-foreground text-lg">{field.description}</Label>
              </div>

              <div className="flex flex-wrap gap-2">
                {field.values ? (
                  field.values.map((option: { label: string; value: string }) => (
                    <Badge
                      key={option.value}
                      variant="secondary"
                      className="bg-blue-500 text-white dark:bg-blue-600 text-lg"
                    >
                      {option.label} - {option.value}
                    </Badge>
                  ))
                ) : field.range ? (
                  <Badge
                    variant="secondary"
                    className="bg-blue-500 text-white dark:bg-blue-600"
                  >
                    {field.range}
                  </Badge>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default ReadMe
