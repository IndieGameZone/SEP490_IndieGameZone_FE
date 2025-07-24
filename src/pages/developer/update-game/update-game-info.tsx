import TiptapEditor from "@/components/tiptap/tiptap-editor";
import { GAME_REALEASE_STATUS, GAME_VISIBILITY_STATUS } from "@/constants/game";
import { updateGame } from "@/lib/api/game-api";
import { formatDuration } from "@/lib/date-n-time";
import { deepEqual } from "@/lib/object";
import useAgeRestrictionStore from "@/store/use-age-restriction-store";
import useAuthStore from "@/store/use-auth-store";
import useCategoryStore from "@/store/use-category-store";
import useGameStore from "@/store/use-game-store";
import useLanguageStore from "@/store/use-language-store";
import useTagStore from "@/store/use-tag-store";
import { GameStatus, GameVisibility } from "@/types/game";
import {
  Button,
  Form,
  FormProps,
  Input,
  InputNumber,
  Radio,
  Select,
  Space,
  Tooltip,
  message,
} from "antd";
import Checkbox, { CheckboxGroupProps } from "antd/es/checkbox";
import TextArea from "antd/es/input/TextArea";
import Paragraph from "antd/es/typography/Paragraph";
import { useEffect, useRef, useState } from "react";
import { FaSave } from "react-icons/fa";

type FieldType = {
  name: string;
  coverImage: string;
  videoLink: string;
  description: string;
  shortDescription: string;
  installInstruction: string;
  allowDonation: boolean;
  releaseStatus: GameStatus;
  visibility: GameVisibility;
  price: number;
  averageSession: number;
  ageRestrictionId: string;
  categoryId: string;
  languageIds: string[];
  tagIds: string[];
  pricingOption: "Free" | "Paid";
};
const releaseStatusOptions = GAME_REALEASE_STATUS;
const visibilityStatusOptions = GAME_VISIBILITY_STATUS;

const pricingOptions: CheckboxGroupProps<string>["options"] = [
  { label: "Free", value: "Free" },
  { label: "Paid", value: "Paid" },
];
const UpdateGameInfo = () => {
  const [form] = Form.useForm<FieldType>();
  const { game, rerender } = useGameStore();
  const [isFree, setIsFree] = useState(true);
  const [allowDonate, setAllowDonate] = useState(true);
  const { profile } = useAuthStore();
  const { categories, loading: loadingCategories } = useCategoryStore();
  const { tags, loading: loadingTags } = useTagStore();
  const [messageApi, contextHolder] = message.useMessage();
  const { ageRestrictions, loading: loadingAgeRestrictions } =
    useAgeRestrictionStore();
  const initalValues = useRef<FieldType>(null);
  const { languages, loading: loadingLanguages } = useLanguageStore();
  const [loading, setLoading] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    if (!profile || !game) return;
    setLoading(true);
    const result = await updateGame(profile.id, game.id, {
      ageRestrictionId: values.ageRestrictionId,
      allowDonation: values.allowDonation,
      averageSession: values.averageSession,
      categoryId: values.categoryId,
      coverImage: form.getFieldValue("coverImage"),
      description: values.description,
      installInstruction: values.installInstruction,
      languageIds: values.languageIds,
      name: values.name,
      price: values.price,
      shortDescription: values.shortDescription,
      status: values.releaseStatus,
      tagIds: values.tagIds,
      videoLink: values.videoLink,
      visibility: values.visibility,
      versionDescription: game.versionDescription
    });
    setLoading(false);
    if (result.error) {
      messageApi.error("Failed to update coverImage");
    } else {
      messageApi.success("Update game successfully!");
      setTimeout(() => {
        rerender();
      }, 1000);
    }
  };
  useEffect(() => {
    if (game) {
      setIsFree(game.price == 0);
      setAllowDonate(game.allowDonation);
      form.setFieldsValue({
        ageRestrictionId: game.ageRestriction.id,
        allowDonation: game.allowDonation,
        averageSession: game.averageSession,
        categoryId: game.category.id,
        coverImage: game.coverImage,
        description: game.description,
        installInstruction: game.installInstruction,
        languageIds: game.gameLanguages.map((x) => x.language.id),
        name: game.name,
        price: game.price,
        pricingOption: game.price == 0 ? "Free" : "Paid",
        releaseStatus: game.status,
        shortDescription: game.shortDescription,
        tagIds: game.gameTags.map((x) => x.tag.id),
        videoLink: game.videoLink,
        visibility: game.visibility,
      });
      initalValues.current = form.getFieldsValue();
    }
  }, []);

  const handleValuesChange = (_: any, allValues: FieldType) => {
    const changed = !deepEqual(initalValues.current, allValues);
    setHasChanged(changed);
  };

  const averageSession = Form.useWatch("averageSession", form);

  return (
    <div className="p-5 bg-zinc-900">
      {contextHolder}
      <h2 className="text-2xl mb-3">Game Information</h2>
      <Form
        form={form}
        name="upload-game-form"
        onFinish={onFinish}
        autoComplete="off"
        onValuesChange={handleValuesChange}
        layout="vertical"
        initialValues={{
          price: 1000,
          pricingOption: "Free",
          allowDonate: true,
        }}
      >
        <Form.Item<FieldType>
          name="name"
          label={<span className="font-bold">Game Name</span>}
          rules={[
            { required: true, message: "Please enter the game name" },
            {
              min: 2,
              message: "Game name must be at least 2 characters",
            },
          ]}
          style={{ width: 500, marginBottom: 20 }}
        >
          <Input placeholder="Name/Title" />
        </Form.Item>
        <Form.Item<FieldType>
          name="shortDescription"
          label={<span className="font-bold">Short description</span>}
          style={{ width: 500, marginBottom: 20 }}
          extra="Shown to avoid duplicating your game's name"
        >
          <TextArea placeholder="(Optional)" />
        </Form.Item>
        <Form.Item<FieldType>
          name="averageSession"
          label={<span className="font-bold">Average session</span>}
          rules={[
            {
              required: true,
              message: "Please enter the average session",
            },
          ]}
          style={{ width: 500, marginBottom: 20 }}
          extra="Estimated average play session length in minutes"
          tooltip={
            averageSession >= 60
              ? {
                  title: formatDuration(averageSession),
                }
              : undefined
          }
        >
          <InputNumber<number>
            min={1}
            max={1440}
            placeholder="60 (minutes)"
            style={{ width: 500 }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => (value ? parseInt(value.replace(/\,/g, "")) : 0)}
            suffix="minute(s)"
          />
        </Form.Item>
        <Form.Item<FieldType>
          label={<span className="font-bold">Category</span>}
          name={"categoryId"}
          extra="Select the category that best describes your game."
          rules={[{ required: true, message: "Please select a category" }]}
          style={{ width: 500, marginBottom: 20 }}
        >
          <Select
            showSearch
            optionFilterProp="label"
            placeholder="Click to view options or type to filter"
            options={categories.map((x) => ({
              value: x.id,
              label: x.name,
            }))}
            loading={loadingCategories}
          />
        </Form.Item>
        <Form.Item<FieldType>
          label={<span className="font-bold">Tags</span>}
          name="tagIds"
          extra="Any other keywords someone might search to find your game. Max of 10."
          style={{ width: 500, marginBottom: 20 }}
        >
          <Select
            showSearch
            mode="multiple"
            allowClear
            maxCount={10}
            optionFilterProp="label"
            placeholder="Click to view options or type to filter"
            options={tags.map((x) => ({
              value: x.id,
              label: x.name,
            }))}
            loading={loadingTags}
          />
        </Form.Item>
        <Form.Item<FieldType>
          label={<span className="font-bold">Languages</span>}
          name="languageIds"
          extra="List of supported languages"
          style={{ width: 500, marginBottom: 20 }}
        >
          <Select
            showSearch
            mode="multiple"
            allowClear
            maxCount={15}
            optionFilterProp="label"
            placeholder="Click to view options or type to filter"
            options={languages.map((x) => ({
              value: x.id,
              label: x.name,
            }))}
            loading={loadingLanguages}
          />
        </Form.Item>
        <Form.Item<FieldType>
          label={<span className="font-bold">Content rating</span>}
          name="ageRestrictionId"
          extra="Select the appropriate age rating for your game"
          style={{ width: 500, marginBottom: 20 }}
          rules={[{ required: true, message: "Please select content rating" }]}
        >
          <Select
            showSearch
            optionFilterProp="label"
            placeholder="Select an option"
            options={ageRestrictions
              .sort((a, b) => a.code.localeCompare(b.code))
              .map((x) => ({
                value: x.id,
                label: x.code,
                desc: x.description,
              }))}
            optionRender={(option) => (
              <div>
                <div className="font-semibold">{option.data.label}</div>
                <p className="text-wrap text-sm text-zinc-500">
                  {option.data.desc}
                </p>
              </div>
            )}
            loading={loadingAgeRestrictions}
          />
        </Form.Item>
        <Form.Item<FieldType>
          label={<span className="font-bold">Release Status</span>}
          name={"releaseStatus"}
          rules={[
            { required: true, message: "Please select a release status" },
          ]}
          style={{ width: 500, marginBottom: 20 }}
        >
          <Select
            showSearch
            optionFilterProp="label"
            placeholder="Click to view options"
            options={releaseStatusOptions}
            optionRender={(option) => (
              <div>
                <div className="font-semibold">{option.data.label}</div>
                <p className="text-wrap text-sm text-zinc-500">
                  {option.data.description}
                </p>
              </div>
            )}
          />
        </Form.Item>

        <Form.Item<FieldType>
          name="description"
          label={<span className="font-bold">Description</span>}
        >
          <TiptapEditor />
        </Form.Item>
        {/* PRICING */}

        <Form.Item<FieldType>
          extra={isFree && "The game's files will be freely available"}
          name={"pricingOption"}
          style={{ marginBottom: 10 }}
          label={<h2 className="text-2xl mb-3">Pricing</h2>}
          tooltip="You cannot change the price. However, you can set sales to your game to reduce the price!"
        >
          <Radio.Group
            options={pricingOptions}
            onChange={(e) => {
              form.setFieldValue("pricingOption", e.target.value);
              setIsFree(e.target.value == "Free");
            }}
            disabled
          />
        </Form.Item>
        <Form.Item<FieldType>
          name="price"
          label="Minimum price"
          rules={[{ required: true, message: "Please a price" }]}
          hidden={isFree}
          extra="Minimum price to pay to get download access to game"
        >
          <InputNumber<number>
            min={1000}
            max={10000000}
            step={1000}
            style={{ width: 500 }}
            formatter={(value) =>
              `${value}  ₫`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) =>
              value?.replace(/₫|\s|,/g, "") as unknown as number
            }
            disabled
          />
        </Form.Item>
        <Form.Item<FieldType>
          name="allowDonation"
          valuePropName="checked"
          label={null}
          extra={
            allowDonate
              ? "Someone downloading your project will be asked for a donation before getting access."
              : "No donations can be made"
          }
          hidden={!isFree}
        >
          <Checkbox
            onChange={(e) => {
              setAllowDonate(e.target.checked);
            }}
          >
            Allow donation
          </Checkbox>
        </Form.Item>
        <h2 className="text-2xl mb-3">Visibility & Access</h2>
        <Form.Item<FieldType>
          name={"visibility"}
          rules={[
            { required: true, message: "Please select a visibility status" },
          ]}
          style={{ width: 500, marginBottom: 20 }}
        >
          <Radio.Group>
            <Space direction="vertical">
              {visibilityStatusOptions.map((opt) => (
                <div key={opt.value} style={{ padding: "4px 0" }}>
                  <Radio value={opt.value} disabled={opt.value == "Draft"}>
                    {opt.label}
                  </Radio>
                  <Paragraph
                    type="secondary"
                    style={{ margin: 0, paddingLeft: 24 }}
                  >
                    {opt.description}
                  </Paragraph>
                </div>
              ))}
            </Space>
          </Radio.Group>
        </Form.Item>
        <Form.Item label={null}>
          <Tooltip title={hasChanged ? null : "You didn't change anything!"}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<FaSave />}
              loading={loading}
              disabled={!hasChanged}
            >
              Save changes
            </Button>
          </Tooltip>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdateGameInfo;
