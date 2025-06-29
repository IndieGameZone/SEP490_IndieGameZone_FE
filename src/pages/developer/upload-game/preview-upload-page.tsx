import useAgeRestrictionStore from "@/store/use-age-restriction-store";
import useAuthStore from "@/store/use-auth-store";
import useCategoryStore from "@/store/use-category-store";
import useLanguageStore from "@/store/use-language-store";
import useManageGameStore from "@/store/use-manage-game-store";
import useTagStore from "@/store/use-tag-store";
import { AgeRestriction } from "@/types/age-restriction";
import { Category } from "@/types/category";
import { Language } from "@/types/language";
import { Tag } from "@/types/tag";
import { Avatar, Button } from "antd";
import { useEffect, useState } from "react";
import { CiUser } from "react-icons/ci";
import {
  FaApple,
  FaArrowLeft,
  FaDownload,
  FaFileArchive,
  FaLinux,
  FaShoppingCart,
  FaWindows,
} from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import UploadSteps from "./upload-steps";
import TiptapView from "@/components/tiptap/tiptap-view";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import ReactPlayer from "react-player/youtube";
import { formatDate, formatDuration } from "@/lib/date-n-time";
import ScrollToTop from "@/components/scroll-to-top";
import { formatCurrencyVND } from "@/lib/currency";
import usePlatformStore from "@/store/use-platform-store";
import { GAME_REALEASE_STATUS } from "@/constants/game";

const PreviewUploadPage = () => {
  const { isSaved, gameMediaAssets, gameInfo, gameFiles } =
    useManageGameStore();
  const [coverImageUrl, setcoverImageUrl] = useState<string>("");
  const [index, setIndex] = useState(-1);
  const [tags, setTags] = useState<Tag[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [category, setCategory] = useState<Category>();
  const [ageRestriction, setAgeRestriction] = useState<AgeRestriction>();
  const { tags: allTags } = useTagStore();
  const { languages: allLanguages } = useLanguageStore();
  const { categories: allCategories } = useCategoryStore();
  const { ageRestrictions: allAgeRestrictions } = useAgeRestrictionStore();
  const { getDefaultPlatforms } = usePlatformStore();
  const { profile } = useAuthStore();
  const [gameImages, setGameImages] = useState<any>([]);
  const [slides, setSlides] = useState<any>([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isSaved) {
      navigate("/dev/upload-game");
    } else {
      const tagArr: Tag[] = [];
      allTags.forEach((t) => {
        if (gameInfo.tagIds.find((tt) => tt == t.id)) {
          tagArr.push(t);
        }
      });
      setTags(tagArr);

      const languageArr: Language[] = [];
      allLanguages.forEach((l) => {
        if (gameInfo.languageIds.find((ll) => ll == l.id)) {
          languageArr.push(l);
        }
      });
      setLanguages(languageArr);

      const c = allCategories.find((cc) => cc.id == gameInfo.categoryId);
      if (c) {
        setCategory(c);
      }

      const a = allAgeRestrictions.find(
        (aa) => aa.id == gameInfo.ageRestrictionId
      );
      if (a) {
        setAgeRestriction(a);
      }
      const images: any = [];
      gameMediaAssets.gameImages?.forEach((i) => {
        if (i.originFileObj) {
          const url = URL.createObjectURL(i.originFileObj);
          images.push({ src: url });
        }
      });
      setGameImages(images);

      const coverImageFile = gameMediaAssets.coverImage[0].originFileObj;
      if (coverImageFile) {
        const url = URL.createObjectURL(coverImageFile);
        setcoverImageUrl(url);
      }
    }
  }, [isSaved]);

  const handleGoBack = () => {
    navigate("/dev/upload-game");
  };
  const handleSubmit = () => {
    navigate("/dev/upload-game/upload");
  };

  useEffect(() => {
    setSlides([
      {
        src: coverImageUrl,
      },
      ...gameImages,
    ]);
  }, [gameImages]);

  if (!isSaved) return;
  const defaultPlatforms = getDefaultPlatforms();
  const selectedReleaseStatus = GAME_REALEASE_STATUS.find(
    (x) => x.value == gameInfo.releaseStatus
  )?.label;
  return (
    <div>
      <ScrollToTop />
      <div className="p-3">
        <p className="text-zinc-500">Preview</p>
        <h1 className="text-2xl">Game Details Page</h1>
      </div>

      <div className="bg-zinc-900 p-3 rounded grid grid-cols-3 gap-5 border border-zinc-800">
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt="game cover image"
            className="aspect-4/3 object-cover rounded w-full highlight-hover cursor-pointer"
            onClick={() => setIndex(0)}
          />
        ) : (
          <div></div>
        )}
        <div className="col-span-2 flex flex-col gap-2">
          <div>
            <h2 className="text-3xl font-bold">{gameInfo.name}</h2>
            <p className="text-zinc-500">{gameInfo.shortDescription}</p>
            <span className="font-semibold text-orange-200">
              {category?.name}
            </span>
          </div>

          <div className="py-2 my-2 flex gap-3 items-center border-y border-y-zinc-600">
            {profile?.avatar ? (
              <Avatar src={profile.avatar} />
            ) : (
              <Avatar icon={<CiUser />} />
            )}
            <p className="font-semibold">{profile?.userName}</p>
          </div>
          <div className="flex gap-2 text-sm items-end">
            <span className="uppercase text-zinc-400 text-xs">Tags:</span>
            {tags.map((tag, index: number) => (
              <span
                className="bg-orange-900 text-orange-200 px-3 rounded"
                key={`game-tag-${index}`}
              >
                {tag.name}
              </span>
            ))}
          </div>
          <div className="flex gap-2 text-sm items-end">
            <span className="uppercase text-zinc-400 text-xs">Languages:</span>
            {languages.map((language, index: number) => (
              <span className="text-orange-200" key={`game-language-${index}`}>
                {language.name} {index != languages.length - 1 && ", "}
              </span>
            ))}
          </div>
          <div className="flex gap-2 text-sm items-end">
            <span className="uppercase text-zinc-400 text-xs">
              Average time:
            </span>
            <span>{formatDuration(gameInfo.averageSession)}</span>
          </div>
        </div>
      </div>
      <Lightbox
        index={index}
        slides={slides}
        open={index >= 0}
        close={() => setIndex(-1)}
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
      />
      <div className="flex overflow-auto gap-3 p-3 bg-zinc-900">
        {gameImages.map((image: any, index: number) => (
          <img
            key={`game-image-${index}`}
            src={image.src}
            className="aspect-16/9 w-40 rounded highlight-hover cursor-pointer"
            onClick={() => setIndex(index + 1)}
          />
        ))}
      </div>
      <div className="grid grid-cols-12">
        <div className="col-span-8 bg-zinc-900 p-5 border border-zinc-800">
          <h3 className="text-xl font-bold my-2">Gameplay/Trailer</h3>
          <ReactPlayer
            className="react-player"
            url={gameMediaAssets.videoLink}
            width="100%"
            controls
          />
          <h3 className="text-xl font-bold my-2">Description</h3>
          <TiptapView value={gameInfo.description} />
          <hr className="mt-10 mb-5 border-zinc-700" />
          <div className="flex justify-between">
            <div>
              <table>
                <tbody>
                  <tr>
                    <td className="pe-5">Release status</td>
                    <td className="font-semibold text-orange-200">
                      {selectedReleaseStatus}
                    </td>
                  </tr>
                  <tr>
                    <td className="pe-5">Released on</td>
                    <td className="font-semibold">{formatDate(new Date())}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="border border-zinc-700 rounded flex w-60 overflow-hidden">
              <div className="bg-orange-900 py-3 px-5 text-2xl font-bold text-center text-orange-200 border-e border-zinc-700">
                {ageRestriction?.code}
              </div>
              <p className="text-xs p-3 bg-zinc-800 font-semibold text-zinc-300">
                {ageRestriction?.description}
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-4 bg-zinc-900 border border-zinc-800">
          <h1 className="px-5 pt-5 font-semibold text-xl">Download Game</h1>
          <div className="px-5 pt-2 pb-5 border-b border-zinc-800 ">
            <div className="flex gap-3 items-center">
              {gameInfo.pricingOption == "Free" ? (
                <>
                  <Button size="large" type="primary" icon={<FaDownload />}>
                    Download Now
                  </Button>
                  <p className="mt-1 text-gray-500 text-sm">For Free</p>
                </>
              ) : (
                <>
                  <Button size="large" type="primary" icon={<FaShoppingCart />}>
                    Buy Now
                  </Button>
                  <p className="mt-1 text-xl">
                    {formatCurrencyVND(gameInfo.price)}
                  </p>
                </>
              )}
            </div>
            {gameInfo.pricingOption == "Paid" && (
              <>
                <p className="my-2">
                  You will get access to the following files:
                </p>
                <div className="flex flex-col gap-2">
                  {gameFiles.files.map((file, index) => {
                    return (
                      <div
                        key={`game-file-${index}`}
                        className="flex gap-2 items-center p-2 bg-zinc-800 rounded"
                      >
                        {file.platformId ==
                        defaultPlatforms.windowsPlatformId ? (
                          <FaWindows />
                        ) : file.platformId ==
                          defaultPlatforms.macOsPlatformId ? (
                          <FaApple />
                        ) : file.platformId ==
                          defaultPlatforms.linuxPlatformId ? (
                          <FaLinux />
                        ) : (
                          <FaFileArchive />
                        )}
                        <span className="font-semibold max-w-50 text-ellipsis overflow-clip">
                          {file.displayName}
                        </span>
                        <span className="text-sm text-zinc-400">
                          ({(file.fileSize / 1024 / 1024).toFixed(1)} MB)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          <div className="p-5">
            <UploadSteps current={3} />
          </div>
        </div>
      </div>
      <div className="p-3">
        <p className="text-zinc-500">Preview</p>
        <h1 className="text-2xl">Download Game Page</h1>
      </div>
      <div className="p-3 bg-zinc-900 border border-zinc-700">
        <div className="flex flex-col gap-2">
          {gameFiles.files.map((file, index) => {
            return (
              <div
                key={`game-file-${index}`}
                className="flex gap-2 items-center p-2"
              >
                <Button type="primary">Download</Button>
                {file.platformId == defaultPlatforms.windowsPlatformId ? (
                  <FaWindows />
                ) : file.platformId == defaultPlatforms.macOsPlatformId ? (
                  <FaApple />
                ) : file.platformId == defaultPlatforms.linuxPlatformId ? (
                  <FaLinux />
                ) : (
                  <FaFileArchive />
                )}
                <span className="font-semibold max-w-50 text-ellipsis overflow-clip">
                  {file.displayName}
                </span>
                <span className="text-sm text-zinc-400">
                  ({(file.fileSize / 1024 / 1024).toFixed(1)} MB)
                </span>
              </div>
            );
          })}
          <hr className="border-zinc-700" />
          <h3>Download and install instructions from {profile?.userName}:</h3>
          <div className="bg-zinc-800 p-3">
            <TiptapView value={gameFiles.installInstruction} />
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center gap-3 p-5">
        <Button icon={<FaArrowLeft />} onClick={handleGoBack}>
          Go Back
        </Button>
        <Button type="primary" icon={<IoSend />} onClick={handleSubmit}>
          Submit Game
        </Button>
      </div>
    </div>
  );
};

export default PreviewUploadPage;
