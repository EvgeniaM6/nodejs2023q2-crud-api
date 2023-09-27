import http from 'http';

export function getRequestBody(request: http.IncomingMessage): Promise<string> {
  return new Promise((res, rej) => {
    const bodyParts: Uint8Array[] = [];

    request.on('error', (error) => rej(error));

    request.on('data', (chunk) => bodyParts.push(chunk));

    request.on('end', () => {
      const body: string = Buffer.concat(bodyParts).toString();
      res(body);
    });
  });
}
