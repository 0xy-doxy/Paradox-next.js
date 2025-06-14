export class StreamingTextResponse extends Response {
    constructor(stream: ReadableStream<Uint8Array>) {
      super(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      });
    }
  }
  
  export function OpenAIStream(response: AsyncIterable<any>) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const part of response) {
          if (part?.choices?.[0]?.text) {
            controller.enqueue(encoder.encode(part.choices[0].text));
          }
        }
        controller.close();
      },
    });
  
    return stream;
  }
  