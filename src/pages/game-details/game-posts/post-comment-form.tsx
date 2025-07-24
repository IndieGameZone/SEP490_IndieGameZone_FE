import { useState } from "react";
import { FaSmile } from "react-icons/fa";
import { Button } from "antd";
import { IoMdSend } from "react-icons/io";
import TextArea from "antd/es/input/TextArea";
import EmojiPicker from "@/components/emoji-picker";

const PostCommentForm = () => {
  const [comment, setComment] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const handleEmojiSelect = (emoji: any) => {
    setComment((prev) => prev + emoji.native);
  };

  return (
    <div className="p-3 relative">
      <div className="flex items-start gap-2 mt-2">
        <TextArea
          className="w-full p-2 border rounded resize-none"
          placeholder="Write your comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          size="large"
          autoSize={{ minRows: 1, maxRows: 6 }}
        />

        <div className="relative">
          <Button
            htmlType="button"
            onClick={() => {
              setShowPicker((prev) => !prev);
            }}
            shape="circle"
            icon={<FaSmile />}
            size="large"
          />

          {showPicker && (
            <EmojiPicker
              onSelect={handleEmojiSelect}
              onClose={() => setShowPicker(false)}
            />
          )}
        </div>

        <Button
          htmlType="submit"
          icon={<IoMdSend />}
          shape="circle"
          type="primary"
          size="large"
        />
      </div>
    </div>
  );
};

export default PostCommentForm;
