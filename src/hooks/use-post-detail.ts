import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export function usePostDetail() {
  const [postDetailOpen, setPostDetailOpen] = useState(false);
  const selectedPost = useRef<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const openPostDetail = (postId: string) => {
    selectedPost.current = postId;
    setPostDetailOpen(true);

    const params = new URLSearchParams(location.search);
    params.set("postId", postId);

    navigate({
      pathname: location.pathname,
      search: params.toString(),
      hash: location.hash,
    });
  };

  const closePostDetail = () => {
    selectedPost.current = null;
    setPostDetailOpen(false);

    const params = new URLSearchParams(location.search);
    params.delete("postId");

    navigate({
      pathname: location.pathname,
      search: params.toString(),
      hash: location.hash,
    });
  };

  useEffect(() => {
    const postId = searchParams.get("postId");
    if (postId) {
      selectedPost.current = postId;
      setPostDetailOpen(true);
    } else {
      setPostDetailOpen(false);
    }
  }, [searchParams]);

  return {
    postDetailOpen,
    selectedPostId: selectedPost.current,
    openPostDetail,
    closePostDetail,
  };
}
