export default ({ env }: { env: (key: string, defaultValue?: string) => string }) => ({
    upload: {
      config: {
        provider: 'aws-s3',
        providerOptions: {
          accessKeyId: env('AWS_ACCESS_KEY_ID'),
          secretAccessKey: env('AWS_SECRET_ACCESS_KEY'),
          region: env('AWS_REGION'),
          params: {
            Bucket: env('AWS_BUCKET_NAME'),
          },
        },
        actionOptions: {
          upload: {
            maxFileSize: 0, // Set to 0 to remove the file size limit, or specify a custom size in bytes
          },
        },
      },
    },
  });