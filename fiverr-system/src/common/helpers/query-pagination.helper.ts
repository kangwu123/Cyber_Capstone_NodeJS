export const buildQueryPrisma = (query: any) => {
  let { page, pageSize, filters } = query;
  const pageDefault = 1;
  const pageSizeDefault = 10;
  pageSize = Number(pageSize) || pageSizeDefault;
  page = Number(page) || pageDefault;

  pageSize = Math.max(pageSize, pageSizeDefault);
  page = Math.max(page, pageDefault);

  const index = (page - 1) * pageSize;
  return {
    page,
    pageSize,
    index,
    filters,
  };
};
