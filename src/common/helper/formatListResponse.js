exports.formatListResponse = (data) => {
  return {
    data: data.docs,
    pagination: {
      totalPages: data.totalPages,
      totalResults: data.totalDocs,
      currentPage: data.page,
      size: data.limit,
      hasPrevPage: data.hasPrevPage,
      hasNextPage: data.hasNextPage,
      prevPage: data.prevPage,
      nextPage: data.nextPage,
    },
  };
};
