export const getUploadUrl = (path: string) => {
  return `${process.env.NEXT_PUBLIC_SITE_URL}/uploads/${path}`;
};
