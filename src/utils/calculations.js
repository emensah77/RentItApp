export function calcRatingFromPost(post) {
  return (
    post?.reviews?.items?.reduce((acc, val) => acc + val.rating, 0) /
      post?.reviews?.items?.length || 0
  );
}
