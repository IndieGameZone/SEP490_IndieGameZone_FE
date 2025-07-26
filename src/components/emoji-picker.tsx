import EmojiPickerLib from "emoji-picker-react";

interface EmojiPickerProps {
  onSelect: (emoji: any) => void;
  onClose: () => void;
}

const EmojiPicker = ({ onSelect, onClose }: EmojiPickerProps) => {
  const handleEmojiClick = (emojiData: any) => {
    onSelect(emojiData.emoji);
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div className="absolute z-50 bottom-full right-0 mt-2">
        <EmojiPickerLib
          onEmojiClick={handleEmojiClick}
          lazyLoadEmojis
          height={400}
          width={300}
          skinTonesDisabled
        />
      </div>
    </>
  );
};

export default EmojiPicker;
