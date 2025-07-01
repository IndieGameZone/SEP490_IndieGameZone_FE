import useManageGameStore from "@/store/use-manage-game-store";
import { useEffect, useState } from "react";
import { Button, Progress, UploadFile, message } from "antd";
import { useNavigate } from "react-router-dom";
import { addGame, addGameFiles, deleteGame } from "@/lib/api/game-api";
import useAuthStore from "@/store/use-auth-store";
import cancleIcon from "@/assets/cancel.png";
import checkedIcon from "@/assets/checked.png";
import { axiosClient } from "@/lib/api/config/axios-client";
import uploadingAnimation from "@/assets/lotties/uploading.json";
import scanningAnimation from "@/assets/lotties/scanning.json";
import HarmfulFileWarning from "./harmful-file-warning";
import LottiePlayer from "@/components/lottie-player";

const TASKS = [
  {
    id: 0,
    name: "Uploading cover image",
  },
  {
    id: 1,
    name: "Uploading game's images",
  },
  {
    id: 2,
    name: "Uploading game's information",
  },
  {
    id: 3,
    name: "Uploading game's files",
  },
  {
    id: 4,
    name: "Attaching game's files",
  },
  {
    id: 5,
    name: "DONE",
  },
];
const UploadProcessPage = () => {
  const [currentTask, setCurrentTask] = useState(0);
  const [currentItem, setCurrentItem] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [currentTaskMessage, setCurrentTaskMessage] = useState(
    TASKS[currentTask].name
  );
  const [currentTaskMessage2, setcurrentTaskMessage2] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(50);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [coverImageUrl, setCoverImageUrl] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [gameId, setGameId] = useState("");
  const [gamePlatforms, setGamePlatforms] = useState<any[]>([]);
  const [isHarmful, setIsHarmful] = useState(false);
  const [deleteAttempts, setDeleteAttempts] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const { isSaved, gameFiles, gameMediaAssets, gameInfo } =
    useManageGameStore();
  const { profile } = useAuthStore();
  useEffect(() => {
    if (!isSaved) {
      navigate("/dev/upload-game");
      return;
    }
  }, []);

  useEffect(() => {}, []);

  useEffect(() => {
    if (isSaved && !isUploading && !isFinished && !errorMessage) {
      if (currentTask == 0) {
        handleUploadCoverImage();
      } else if (currentTask == 1) {
        handleUploadImages();
      } else if (currentTask == 2) {
        handleUploadGameInfo();
      } else if (currentTask == 3) {
        handleUploadFiles();
      } else if (currentTask == 4) {
        handleAddGameFiles();
      }
    }
  }, [isUploading, errorMessage]);

  useEffect(() => {
    setCurrentTaskMessage(TASKS[currentTask].name);
  }, [currentTask]);

  useEffect(() => {
    if (isHarmful) {
      console.log("ATTEMPT TO DELETE GAME #" + deleteAttempts);
      handleDeleteGame();
    }
  }, [isHarmful, deleteAttempts]);

  const handleDeleteGame = async () => {
    if (gameId && profile) {
      const result = await deleteGame(profile.id, gameId);
      if (result.error) {
        setDeleteAttempts((prev) => prev + 1);
      }
    }
  };

  const handleApiError = (error: any) => {
    try {
      const errorMessage =
        error.response?.data ||
        error?.message ||
        "An unexpected error occurred.";
      const data = null;
      return { error: errorMessage, data };
    } catch (err) {
      throw new Error("An unexpected error occurred.");
    }
  };

  const uploadFile = async (file: UploadFile) => {
    try {
      if (!file.originFileObj) throw new Error();
      const formData = new FormData();
      formData.append("file", file.originFileObj);
      const { data } = await axiosClient.post(`/api/files`, formData, {
        onUploadProgress: (event: any) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          if (currentTask == 3 && percent == 100) {
            setcurrentTaskMessage2(
              "Scanning for harmful files\n(may take a few second)"
            );
            setIsScanning(true);
          } else if (isScanning) {
            setIsHarmful(false);
          }
          setUploadProgress(percent);
        },
      });
      return { error: null, data: data, success: true };
    } catch (error) {
      return handleApiError(error);
    }
  };

  const handleUploadFiles = async () => {
    // console.log("HANDLE UPLOAD FILE");
    if (isUploading) return;
    setIsUploading(true);
    setTotalItems(gameFiles.files.length);
    setUploadProgress(0);
    const filesToUpload = gameFiles.files;
    for (let i = currentItem; i < filesToUpload.length; i++) {
      const file = filesToUpload[i].file[0];
      setcurrentTaskMessage2(`Uploading ${file.name}.`);

      if (file.originFileObj) {
        // console.log("Uploading ", file.name);
        const uploadResult = await uploadFile(file);
        console.log(uploadResult)
        if (uploadResult.error) {
          if (
            uploadResult.error.detail ==
            "File scan failed. Please ensure the file is safe and appropriate."
          ) {
            setErrorMessage(`${file.name}`);
            setIsHarmful(true);
          } else {
            setErrorMessage(`Failed to upload ${file.name} Please try again.`);
          }
          setIsUploading(false);
          return;
        } else {
          // console.log("Add game file");
          setGamePlatforms((prev) => [
            ...prev,
            {
              file: uploadResult.data,
              platformId: gameFiles.files[i].platformId,
            },
          ]);
          setCurrentItem((prev) => prev + 1);
        }
      } else {
        handleUnexpectedError();
        return;
      }
    }
    setCurrentTask(4);
    setIsUploading(false);
    setCurrentItem(0);
  };

  const handleAddGameFiles = async () => {
    if (isUploading) return;
    setIsUploading(true);
    setTotalItems(gamePlatforms.length);
    setUploadProgress(0);
    setcurrentTaskMessage2(`Attaching game files.`);
    const addFilesResult = await addGameFiles(gameId, gamePlatforms);
    if (addFilesResult.error) {
      setErrorMessage(`Failed to attach game files Please try again.`);
      setIsUploading(false);
      return;
    }
    setUploadProgress(100);
    setIsUploading(false);
    setCurrentTask(5);
    setIsFinished(true);
    setCurrentItem(0);
  };

  const handleUploadCoverImage = async () => {
    // console.log("HANDLE UPLOAD COVER IMAGE");
    if (isUploading) return;
    setIsUploading(true);
    setTotalItems(1);
    setCurrentItem(0);
    setUploadProgress(0);
    const coverImageFile = gameMediaAssets.coverImage[0];
    setcurrentTaskMessage2(`Uploading cover image.`);
    if (coverImageFile.originFileObj) {
      const uploadResult = await uploadFile(coverImageFile);
      if (uploadResult.error) {
        setErrorMessage(
          `Failed to upload ${coverImageFile.name} Please try again.`
        );
        setIsUploading(false);
        return;
      } else {
        setCoverImageUrl(uploadResult.data);
        setCurrentItem((prev) => prev + 1);
      }
    } else {
      handleUnexpectedError();
    }
    setCurrentTask(1);
    setCurrentItem(0);
    setIsUploading(false);
  };

  const handleUploadImages = async () => {
    // console.log("HANDLE UPLOAD IMAGES");
    if (isUploading) return;
    setIsUploading(true);
    setTotalItems(gameMediaAssets.gameImages.length);
    setUploadProgress(0);
    const filesToUpload = gameMediaAssets.gameImages;
    // console.log("Currenet Item: ", currentItem);
    // console.log("gameImages: ", filesToUpload)
    for (let i = currentItem; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      setcurrentTaskMessage2(`Uploading ${file.name}.`);
      if (file.originFileObj) {
        const uploadResult = await uploadFile(file);
        if (uploadResult.error) {
          setErrorMessage(`Failed to upload ${file.name} Please try again.`);
          setIsUploading(false);
          return;
        } else {
          setCurrentItem((prev) => prev + 1);
          setImageUrls((prev) => [...prev, uploadResult.data]);
        }
      } else {
        handleUnexpectedError();
        return;
      }
    }
    setCurrentTask(2);
    setIsUploading(false);
    setCurrentItem(0);
    // console.log("UPLOAD IMAGE DONE")
  };

  const handleUploadGameInfo = async () => {
    // console.log("HANDLE UPLOAD GAME INFO");
    if (isUploading) return;
    if (!profile) {
      handleUnexpectedError();
      return;
    }
    setIsUploading(true);
    setTotalItems(1);
    setUploadProgress(0);
    setcurrentTaskMessage2(`Uploading game information.`);
    const uploadResult = await addGame(profile.id, {
      ageRestrictionId: gameInfo.ageRestrictionId,
      allowDonation:
        gameInfo.pricingOption == "Free" ? gameInfo.allowDonate : true,
      averageSession: gameInfo.averageSession,
      categoryId: gameInfo.categoryId,
      coverImage: coverImageUrl,
      description: gameInfo.description,
      gameImages: imageUrls,
      installInstruction: gameFiles.installInstruction,
      languageIds: gameInfo.languageIds,
      name: gameInfo.name,
      price: gameInfo.pricingOption == "Free" ? 0 : gameInfo.price,
      shortDescription: gameInfo.shortDescription,
      status: gameInfo.releaseStatus,
      tagIds: gameInfo.tagIds,
      videoLink: gameMediaAssets.videoLink,
      visibility: gameInfo.visibility,
    });
    if (uploadResult.error) {
      setErrorMessage(`Failed to upload game information Please try again.`);
      setIsUploading(false);
      return;
    } else {
      setGameId(uploadResult.data);
    }
    setCurrentTask(3);
    setCurrentItem(0);
    setIsUploading(false);
  };

  const handleRetry = () => {
    // console.log(currentTask);
    setErrorMessage("");
    setIsUploading(false);
  };

  const handleUnexpectedError = () => {
    messageApi.error("Something went wrong Please try again.");
    navigate("/dev/upload-game");
    setIsUploading(false);
  };

  const handleFinish = () => {
    // UNCOMMENT THIS LINE IN FINISH PRODUCT
    // clearState();
    navigate("/dev/manage-games");
  };

  if (!isSaved) return;
  if (isHarmful) {
    return <HarmfulFileWarning errorMessage={errorMessage} />;
  }
  return (
    <div className="flex flex-col justify-center items-center pb-20">
      {contextHolder}
      {currentTask == 3 && isScanning ? (
        <LottiePlayer
          animationData={scanningAnimation}
          loop={true}
          className="size-64"
        />
      ) : isUploading ? (
        <LottiePlayer
          animationData={uploadingAnimation}
          loop={true}
          className="size-64"
        />
      ) : errorMessage ? (
        <div className="size-64 p-16">
          <img src={cancleIcon} alt="" className="w-full" />
        </div>
      ) : isFinished ? (
        <div className="size-64 p-16">
          <img src={checkedIcon} alt="" className="w-full" />
        </div>
      ) : (
        <div className="size-52 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
      )}
      <div className="w-[300px] bg-zinc-800 p-3 rounded -mt-3">
        <h1 className="text-sm">
          {currentTaskMessage} [{currentTask}/{5}]
        </h1>
        <Progress
          percent={Math.round((currentTask / 5) * 100)}
          status={
            isUploading
              ? "active"
              : errorMessage
              ? "exception"
              : isFinished
              ? "success"
              : "normal"
          }
        />
        <h2 className="mt-2 text-sm">
          {currentTaskMessage2} [{currentItem}/{totalItems}]
        </h2>
        <Progress
          percent={uploadProgress}
          status={
            isUploading
              ? "active"
              : errorMessage
              ? "exception"
              : isFinished
              ? "success"
              : "normal"
          }
        />
      </div>
      {errorMessage && (
        <>
          <p className="text-red-500">{errorMessage}</p>
          <div className="text-center">
            <Button onClick={handleRetry} className="mt-1">
              Retry
            </Button>
          </div>
        </>
      )}
      {isFinished && (
        <>
          <p className="text-green-500">Game uploaded successfully</p>
          <div className="text-center">
            <Button onClick={handleFinish} type="primary" className="mt-1">
              Go to Dashboard
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default UploadProcessPage;
