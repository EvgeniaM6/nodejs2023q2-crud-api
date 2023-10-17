import http from 'http';

export function getRequestBody(request: http.IncomingMessage): Promise<string> {
  return new Promise((res: (value: string) => void, rej: (reason: unknown) => void): void => {
    const bodyParts: Uint8Array[] = [];

    request.on('error', (error: unknown) => rej(error));

    request.on('data', (chunk: Buffer) => bodyParts.push(chunk));

    request.on('end', () => {
      const body: string = Buffer.concat(bodyParts).toString();
      res(body);
    });
  });
}
