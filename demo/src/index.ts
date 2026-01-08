import 'dotenv/config';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

async function main() {
  const { textStream } = await streamText({
    model: google('models/gemini-pro'),
    prompt: 'Invent a new holiday and describe its traditions.',
  });

  for await (const textPart of textStream) {
    process.stdout.write(textPart);
  }
  
  console.log();
}

main().catch(console.error);
