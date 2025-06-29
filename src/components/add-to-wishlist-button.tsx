import useAuthStore from "@/store/use-auth-store";
import useWishlistStore from "@/store/use-wish-list-store";
import { Game } from "@/types/game";
import { Button, Tooltip, message } from "antd";
import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const AddToWishlistButton = ({ game }: { game: Game }) => {
  const { gamedIds, addToWishlist, removeFromWishlist } = useWishlistStore();
  const [isWishlisted, setIsWishlisted] = useState(gamedIds.includes(game.id));
  const { profile } = useAuthStore();
  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    const newVal = gamedIds.includes(game.id);
    if (newVal != isWishlisted) {
      setIsWishlisted(newVal);
    }
  }, [gamedIds]);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!profile?.id) {
      messageApi.open({
        type: "error",
        content: "Please log in to use wishlist feature",
      });
      return;
    }
    try {
      if (!isWishlisted) {
        await addToWishlist(profile.id, game.id);
        messageApi.open({
          type: "success",
          content: `"${game.name}" added to wishlist`,
        });
      } else {
        await removeFromWishlist(profile.id, game.id);
        messageApi.open({
          type: "success",
          content: `"${game.name}" removed from wishlist`,
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: `Failed to update wishlist for "${game.name}"`,
      });
    }
  };

  return (
    <>
      {contextHolder}
      <Tooltip
        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Button
          onClick={handleWishlistToggle}
          icon={
            isWishlisted ? (
              <FaHeart style={{ color: "oklch(64.5% 0.246 16.439)" }} />
            ) : (
              <FaRegHeart />
            )
          }
          shape="circle"
        />
      </Tooltip>
    </>
  );
};

export default AddToWishlistButton;
