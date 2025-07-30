// import { useGlobalMessage } from "@/components/message-provider";
// import { updateGameFile } from "@/lib/api/game-api"; // You might need this API
// import { formatBytes } from "@/lib/file";
// import useGameStore from "@/store/use-game-store";
// import usePlatformStore from "@/store/use-platform-store";
// import { GameFile } from "@/types/game";
// import { Alert, Button, Form, FormProps, Input, Modal, Select } from "antd";
// import { useMemo, useState } from "react";
// import { FaRedo, FaUpload } from "react-icons/fa";

// type FieldType = {
//   displayName: string;
//   version: string;
//   platformId: string;
// };

// interface UpdateGameFileModalProps {
//   file: GameFile | null;
//   open: boolean;
//   onClose: () => void;
// }

// const UpdateGameFileModal = ({
//   file,
//   open,
//   onClose,
// }: UpdateGameFileModalProps) => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [formDataCache, setFormDataCache] = useState<FieldType | null>(null);
//   const { platforms } = usePlatformStore();
//   const { rerender, gameFiles } = useGameStore();
//   const messageApi = useGlobalMessage();

//   const platformsOptions = useMemo(() => {
//     return platforms.map((x) => ({ value: x.id, label: x.name }));
//   }, [platforms]);

//   const displayNameValidator = async (_: any, value: string) => {
//     const version = form.getFieldValue("version");
//     const platformId = form.getFieldValue("platformId");

//     const isDuplicate = gameFiles.some(
//       (x) =>
//         x.id !== file?.id &&
//         x.displayName === value &&
//         x.version === version &&
//         x.platform.id === platformId
//     );

//     if (isDuplicate) {
//       return Promise.reject(
//         new Error(
//           "A file with the same display name, version, and platform already exists! Please change one of them"
//         )
//       );
//     }

//     return Promise.resolve();
//   };

//   const handleSubmitLogic = async (values: FieldType) => {
//     if (!file) return;
//     setLoading(true);
//     setErrorMessage("");

//     try {
//       await updateGameFile(file.id, {
//         displayName: values.displayName,
//         version: values.version,
//         platformId: values.platformId,
//       });

//       messageApi.success("File info updated successfully!");
//       rerender();
//       onClose();
//     } catch (err) {
//       messageApi.error("Update failed! Please try again.");
//       setErrorMessage("Update failed! Please try again.");
//       setFormDataCache(values);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
//     handleSubmitLogic(values);
//   };

//   const handleRetry = () => {
//     if (formDataCache) {
//       handleSubmitLogic(formDataCache);
//     }
//   };

//   const initialValues = file
//     ? {
//         displayName: file.displayName,
//         version: file.version,
//         platformId: file.platform.id,
//       }
//     : {};

//   return (
//     <Modal
//       title="Update File Info"
//       open={open}
//       onCancel={onClose}
//       maskClosable={false}
//       footer={[
//         <Button key="cancel" onClick={onClose}>
//           Cancel
//         </Button>,
//         errorMessage && formDataCache ? (
//           <Button
//             key="retry"
//             onClick={handleRetry}
//             disabled={loading}
//             loading={loading}
//             icon={<FaRedo />}
//             type="primary"
//           >
//             Retry Update
//           </Button>
//         ) : (
//           <Button
//             key="submit"
//             type="primary"
//             htmlType="submit"
//             onClick={() => form.submit()}
//             icon={<FaUpload />}
//             loading={loading}
//           >
//             Save Changes
//           </Button>
//         ),
//       ]}
//     >
//       <Form
//         form={form}
//         layout="vertical"
//         initialValues={initialValues}
//         onFinish={onFinish}
//       >
//         <Form.Item label="Current File">
//           <div>
//             <strong>{file?.displayName}</strong>{" "}
//             <span style={{ color: "#888" }}>
//               ({file ? formatBytes(file.size) : "Unknown size"})
//             </span>
//           </div>
//         </Form.Item>

//         <Form.Item<FieldType>
//           label="Display Name"
//           name="displayName"
//           rules={[
//             { required: true, message: "Please enter a display name" },
//             { validator: displayNameValidator },
//           ]}
//         >
//           <Input placeholder="Enter display name" disabled={loading} />
//         </Form.Item>

//         <Form.Item<FieldType>
//           label="Version"
//           name="version"
//           rules={[{ required: true, message: "Please enter a version" }]}
//         >
//           <Input placeholder="Enter version" disabled={loading} />
//         </Form.Item>

//         <Form.Item<FieldType>
//           label="Platform"
//           name="platformId"
//           rules={[{ required: true, message: "Please select a platform" }]}
//         >
//           <Select
//             placeholder="Select platform"
//             disabled={loading}
//             options={platformsOptions}
//           />
//         </Form.Item>
//       </Form>

//       {errorMessage && (
//         <Alert
//           message={errorMessage}
//           type="error"
//           showIcon
//           style={{ marginTop: 16 }}
//         />
//       )}
//     </Modal>
//   );
// };

// export default UpdateGameFileModal;
