import { writeFileSync } from "fs"
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime"

const client = new BedrockRuntimeClient({ region: "us-east-1" })

const main = async () => {
  console.log("start")

  const input = {
    body: JSON.stringify({
      text_prompts: [
        {
          text: "Beautiful island in the tropics",
        },
      ],
      steps: 50,
    }),
    accept: "application/json",
    contentType: "application/json",
    modelId: "stability.stable-diffusion-xl-v1",
  }
  const command = new InvokeModelCommand(input)
  const response = await client.send(command)

  const body = JSON.parse(response.body.transformToString())
  if (body.result !== "success") {
    throw new Error("Failed to invoke model")
  }

  writeFileSync("./out.png", body.artifacts[0].base64, { encoding: "base64" })
  console.log("end")
}

main()
