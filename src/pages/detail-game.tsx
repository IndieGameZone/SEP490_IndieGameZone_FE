import useAgeRestrictionStore from "@/store/use-age-restriction-store";
import useAuthStore from "@/store/use-auth-store";
import useCategoryStore from "@/store/use-category-store";
import useLanguageStore from "@/store/use-language-store";
import useManageGameStore from "@/store/use-manage-game-store";
import useTagStore from "@/store/use-tag-store";
import usePlatformStore from "@/store/use-platform-store";
import { AgeRestriction } from "@/types/age-restriction";
import { Category } from "@/types/category";
import { Language } from "@/types/language";
import { Tag } from "@/types/tag";
import { Avatar, Button, Card, Divider, Space, Typography } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CiUser } from "react-icons/ci";
import {
  FaApple,
  FaArrowLeft,
  FaDownload,
  FaFileArchive,
  FaLinux,
  FaShoppingCart,
  FaWindows,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import TiptapView from "@/components/tiptap/tiptap-view";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import ReactPlayer from "react-player/youtube";
import { formatDate } from "@/lib/date";
import ScrollToTop from "@/components/scroll-to-top";
import { formatCurrencyVND } from "@/lib/currency";
import { GAME_REALEASE_STATUS } from "@/constants/game";

const { Title, Text, Paragraph } = Typography;

// Component for game platform icon
const PlatformIcon = ({ platformId, defaultPlatforms }: { platformId: string; defaultPlatforms: any }) => {
  const iconProps = { size: 16, className: "text-orange-400" };
  
  if (platformId === defaultPlatforms.windowsPlatformId) return <FaWindows {...iconProps} />;
  if (platformId === defaultPlatforms.macOsPlatformId) return <FaApple {...iconProps} />;
  if (platformId === defaultPlatforms.linuxPlatformId) return <FaLinux {...iconProps} />;
  return <FaFileArchive {...iconProps} />;
};

// Component for game file item
const GameFileItem = ({ file, defaultPlatforms, showDownload = false }: any) => (
  <div className="flex gap-3 items-center p-3 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors">
    {showDownload && (
      <Button type="primary" size="small" icon={<FaDownload />}>
        Download
      </Button>
    )}
    <PlatformIcon platformId={file.platformId} defaultPlatforms={defaultPlatforms} />
    <div className="flex-1 min-w-0">
      <div className="font-semibold text-white truncate">{file.displayName}</div>
      <Text type="secondary" className="text-xs">
        {(file.fileSize / 1024 / 1024).toFixed(1)} MB
      </Text>
    </div>
  </div>
);

// Component for game metadata
const GameMetadata = ({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) => (
  <div className="flex items-center gap-2 text-sm">
    {icon}
    <Text type="secondary" className="uppercase text-xs font-medium">{label}:</Text>
    {children}
  </div>
);

const DetailGamePages = () => {
  const { isSaved, gameMediaAssets, gameInfo, gameFiles } = useManageGameStore();
  const { tags: allTags } = useTagStore();
  const { languages: allLanguages } = useLanguageStore();
  const { categories: allCategories } = useCategoryStore();
  const { ageRestrictions: allAgeRestrictions } = useAgeRestrictionStore();
  const { getDefaultPlatforms } = usePlatformStore();
  const { profile } = useAuthStore();
  const navigate = useNavigate();

  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [gameImages, setGameImages] = useState<any[]>([]);
  const [coverImageUrl, setCoverImageUrl] = useState<string>("");

  // Memoized derived state
  const derivedGameData = useMemo(() => {
    if (!isSaved) return null;

    const tags = allTags.filter(tag => gameInfo.tagIds.includes(tag.id));
    const languages = allLanguages.filter(lang => gameInfo.languageIds.includes(lang.id));
    const category = allCategories.find(cat => cat.id === gameInfo.categoryId);
    const ageRestriction = allAgeRestrictions.find(age => age.id === gameInfo.ageRestrictionId);
    const releaseStatus = GAME_REALEASE_STATUS.find(status => status.value === gameInfo.releaseStatus);

    return { tags, languages, category, ageRestriction, releaseStatus };
  }, [isSaved, gameInfo, allTags, allLanguages, allCategories, allAgeRestrictions]);

  // Memoized lightbox slides
  const lightboxSlides = useMemo(() => {
    if (!coverImageUrl && gameImages.length === 0) return [];
    return [
      ...(coverImageUrl ? [{ src: coverImageUrl }] : []),
      ...gameImages
    ];
  }, [coverImageUrl, gameImages]);

  // Setup media assets
  useEffect(() => {
    if (!isSaved) {
      navigate("/dev/upload-game");
      return;
    }

    // Process game images
    const images: any[] = [];
    gameMediaAssets.gameImages?.forEach((img) => {
      if (img.originFileObj) {
        const url = URL.createObjectURL(img.originFileObj);
        images.push({ src: url });
      }
    });
    setGameImages(images);

    // Process cover image
    const coverImageFile = gameMediaAssets.coverImage?.[0]?.originFileObj;
    if (coverImageFile) {
      const url = URL.createObjectURL(coverImageFile);
      setCoverImageUrl(url);
    }

    // Cleanup function for object URLs
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.src));
      if (coverImageUrl) URL.revokeObjectURL(coverImageUrl);
    };
  }, [isSaved, gameMediaAssets, navigate]);

  const handleGoBack = useCallback(() => {
    navigate("/dev/upload-game");
  }, [navigate]);

  const handleSubmit = useCallback(() => {
    navigate("/dev/upload-game/upload");
  }, [navigate]);

  const handleImageClick = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  // Early return if not saved
  if (!isSaved || !derivedGameData) {
    return null;
  }

  const { tags, languages, category, ageRestriction, releaseStatus } = derivedGameData;
  const defaultPlatforms = getDefaultPlatforms();
  const isPaidGame = gameInfo.pricingOption === "Paid";

  return (
    <div className="min-h-screen bg-zinc-950">
      <ScrollToTop />
      
      {/* Header */}
      <div className="p-6 border-b border-zinc-800">
        <Text type="secondary" className="text-sm">Preview</Text>
        <Title level={2} className="!mb-0 !text-white">Game Details Page</Title>
      </div>

      {/* Main Game Info Section */}
      <div className="p-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cover Image */}
            <div className="lg:col-span-1">
              {coverImageUrl ? (
                <img
                  src={coverImageUrl}
                  alt="Game cover"
                  className="w-full aspect-[4/3] object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => handleImageClick(0)}
                />
              ) : (
                <div className="w-full aspect-[4/3] bg-zinc-800 rounded-lg flex items-center justify-center">
                  <Text type="secondary">No cover image</Text>
                </div>
              )}
            </div>

            {/* Game Details */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <Title level={1} className="!text-3xl !text-white !mb-2">
                  {gameInfo.name}
                </Title>
                <Paragraph className="text-zinc-400 text-lg">
                  {gameInfo.shortDescription}
                </Paragraph>
                <Text className="text-orange-400 font-semibold text-lg">
                  {category?.name}
                </Text>
              </div>

              {/* Developer Info */}
              <div className="flex items-center gap-3 py-3 border-y border-zinc-700">
                <Avatar 
                  src={profile?.avatar} 
                  icon={!profile?.avatar && <CiUser />}
                  size="large"
                />
                <div>
                  <Text className="font-semibold text-white block">
                    {profile?.userName}
                  </Text>
                  <Text type="secondary" className="text-xs">Developer</Text>
                </div>
              </div>

              {/* Game Metadata */}
              <Space direction="vertical" size="small" className="w-full">
                {tags.length > 0 && (
                  <GameMetadata icon={null} label="Tags">
                    <Space wrap>
                      {tags.map((tag, index) => (
                        <span
                          key={`tag-${tag.id}`}
                          className="bg-orange-900/50 text-orange-300 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </Space>
                  </GameMetadata>
                )}

                {languages.length > 0 && (
                  <GameMetadata icon={null} label="Languages">
                    <Text className="text-orange-300">
                      {languages.map(lang => lang.name).join(", ")}
                    </Text>
                  </GameMetadata>
                )}

                <GameMetadata icon={<FaClock />} label="Average Session">
                  <Text className="text-white">{gameInfo.averageSession} minutes</Text>
                </GameMetadata>
              </Space>
            </div>
          </div>
        </Card>
      </div>

      {/* Lightbox */}
      <Lightbox
        index={lightboxIndex}
        slides={lightboxSlides}
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
      />

      {/* Game Images Gallery */}
      {gameImages.length > 0 && (
        <div className="px-6 pb-6">
          <div className="flex gap-3 overflow-x-auto p-4 bg-zinc-900 rounded-lg border border-zinc-800">
            {gameImages.map((image, index) => (
              <img
                key={`image-${index}`}
                src={image.src}
                alt={`Game screenshot ${index + 1}`}
                className="w-40 aspect-video object-cover rounded cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
                onClick={() => handleImageClick(index + (coverImageUrl ? 1 : 0))}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Content */}
          <div className="xl:col-span-8">
            <Card className="bg-zinc-900 border-zinc-800">
              {/* Video Section */}
              {gameMediaAssets.videoLink && (
                <div className="mb-8">
                  <Title level={3} className="!text-xl !text-white mb-4">
                    Gameplay/Trailer
                  </Title>
                  <div className="rounded-lg overflow-hidden">
                    <ReactPlayer
                      url={gameMediaAssets.videoLink}
                      width="100%"
                      height="400px"
                      controls
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mb-8">
                <Title level={3} className="!text-xl !text-white mb-4">
                  Description
                </Title>
                <div className="prose prose-invert max-w-none">
                  <TiptapView value={gameInfo.description} />
                </div>
              </div>

              <Divider className="border-zinc-700" />

              {/* Game Info Table */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Text type="secondary" className="w-32">Release Status:</Text>
                    <Text className="text-orange-300 font-semibold">
                      {releaseStatus?.label}
                    </Text>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaCalendarAlt className="text-zinc-500" />
                    <Text type="secondary" className="w-32">Released on:</Text>
                    <Text className="text-white font-semibold">
                      {formatDate(new Date())}
                    </Text>
                  </div>
                </div>

                {/* Age Restriction */}
                {ageRestriction && (
                  <div className="flex border border-zinc-700 rounded-lg overflow-hidden max-w-xs">
                    <div className="bg-orange-900 py-4 px-6 text-center">
                      <Text className="text-2xl font-bold text-orange-200">
                        {ageRestriction.code}
                      </Text>
                    </div>
                    <div className="bg-zinc-800 p-4 flex-1">
                      <Text className="text-xs font-medium text-zinc-300">
                        {ageRestriction.description}
                      </Text>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Sidebar - Download Section */}
          <div className="xl:col-span-4">
            <Card className="bg-zinc-900 border-zinc-800 sticky top-6">
              <Title level={3} className="!text-xl !text-white mb-4">
                Download Game
              </Title>

              {/* Download/Purchase Button */}
              <div className="mb-6">
                <Space direction="vertical" size="small" className="w-full">
                  {!isPaidGame ? (
                    <>
                      <Button 
                        type="primary" 
                        size="large" 
                        icon={<FaDownload />}
                        className="w-full"
                      >
                        Download Now
                      </Button>
                      <Text type="secondary" className="text-center block">
                        Free to play
                      </Text>
                    </>
                  ) : (
                    <>
                      <Button 
                        type="primary" 
                        size="large" 
                        icon={<FaShoppingCart />}
                        className="w-full"
                      >
                        Buy Now
                      </Button>
                      <Text className="text-xl font-bold text-center block">
                        {formatCurrencyVND(gameInfo.price)}
                      </Text>
                    </>
                  )}
                </Space>
              </div>

              {/* File List for Paid Games */}
              {isPaidGame && gameFiles.files.length > 0 && (
                <div>
                  <Text className="block mb-3 text-zinc-300">
                    You will get access to the following files:
                  </Text>
                  <Space direction="vertical" size="small" className="w-full">
                    {gameFiles.files.map((file, index) => (
                      <GameFileItem
                        key={`sidebar-file-${index}`}
                        file={file}
                        defaultPlatforms={defaultPlatforms}
                      />
                    ))}
                  </Space>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Download Page Preview */}
      <div className="px-6 pb-6">
        <div className="mb-4">
          <Text type="secondary" className="text-sm">Preview</Text>
          <Title level={2} className="!mb-0 !text-white">Download Game Page</Title>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <Space direction="vertical" size="middle" className="w-full">
            {gameFiles.files.map((file, index) => (
              <GameFileItem
                key={`download-file-${index}`}
                file={file}
                defaultPlatforms={defaultPlatforms}
                showDownload={true}
              />
            ))}

            <Divider className="border-zinc-700" />

            <div>
              <Title level={4} className="!text-white mb-3">
                Download and install instructions from {profile?.userName}:
              </Title>
              <div className="bg-zinc-800 p-4 rounded-lg">
                <TiptapView value={gameFiles.installInstruction} />
              </div>
            </div>
          </Space>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 p-6 border-t border-zinc-800">
        <Button 
          size="large" 
          icon={<FaArrowLeft />} 
          onClick={handleGoBack}
          className="min-w-32"
        >
          Go Back
        </Button>
        <Button 
          type="primary" 
          size="large" 
          icon={<IoSend />} 
          onClick={handleSubmit}
          className="min-w-32"
        >
          Submit Game
        </Button>
      </div>
    </div>
  );
};

export default DetailGamePages;