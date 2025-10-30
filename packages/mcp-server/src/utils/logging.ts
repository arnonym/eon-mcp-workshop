export function withLogging<TInput extends object, TOutput extends object>(
  toolName: string,
  handler: (
    input: TInput,
  ) => Promise<{ content: any; structuredContent: TOutput }>,
) {
  return async (input: TInput) => {
    const start = Date.now();
    console.log(`Tool ${toolName} started with input:`, input);

    try {
      const result = await handler(input);
      const duration = Date.now() - start;

      console.log(
        `Tool ${toolName} succeeded in ${duration}ms with output:`,
        result,
      );

      return result;
    } catch (err: any) {
      const duration = Date.now() - start;
      console.error(
        `Tool ${toolName} failed in ${duration}ms with error:`,
        err,
      );
      throw err;
    }
  };
}
