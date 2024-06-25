import { openai } from '@ai-sdk/openai';
import { StreamingTextResponse, streamText, StreamData } from 'ai';
import { NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(req: Request) {
const prompt = "Creating a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started? || If you could have dinner with any historical figure, who would  it be? || What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment";
 try {
    const result = await streamText({
        model: openai('gpt-3.5-turbo-instruct'),
        prompt,
      });
    
      const data = new StreamData();
    
      data.append({ test: 'value' });
    
      const stream = result.toAIStream({
        onFinal(_) {
          data.close();
        },
      });
    
      return new StreamingTextResponse(stream, {}, data);
    
 } catch (error) {
   console.log(error)
   return NextResponse.json({message:"Failed to fetch ai messages"},{ status: 500 });
    
 }
}