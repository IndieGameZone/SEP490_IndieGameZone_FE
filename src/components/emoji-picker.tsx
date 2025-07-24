import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

interface EmojiPickerProps {
  onSelect: (emoji: any) => void;
  onClose: () => void;
}

const EmojiPicker = ({ onSelect, onClose }: EmojiPickerProps) => {
  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      <div
        className="absolute z-50 bottom-full right-0 mt-2"
      >
        <Picker data={data} onEmojiSelect={onSelect} />
      </div>
    </>
  );
};

export default EmojiPicker;
