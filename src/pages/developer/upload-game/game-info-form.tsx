import TiptapEditor from "@/components/tiptap/tiptap-editor";
import { GAME_REALEASE_STATUS, GAME_VISIBILITY_STATUS } from "@/constants/game";
import { formatDuration } from "@/lib/date-n-time";
import useAgeRestrictionStore from "@/store/use-age-restriction-store";
import useCategoryStore from "@/store/use-category-store";
import useLanguageStore from "@/store/use-language-store";
import useManageGameStore from "@/store/use-manage-game-store";
import useTagStore from "@/store/use-tag-store";
import { GameInfoFieldType } from "@/types/game";
import {
  Checkbox,
  Form,
  FormInstance,
  FormProps,
  Input,
  InputNumber,
  Radio,
  RadioChangeEvent,
  Select,
  Space,
} from "antd";
import { CheckboxChangeEvent, CheckboxGroupProps } from "antd/es/checkbox";
import TextArea from "antd/es/input/TextArea";
import Paragraph from "antd/es/typography/Paragraph";
import { useEffect, useState } from "react";
import { FaKey } from "react-icons/fa";
import { Link } from "react-router-dom";

type FieldType = GameInfoFieldType;

const pricingOptions: CheckboxGroupProps<string>["options"] = [
  { label: "Free", value: "Free" },
  { label: "Paid", value: "Paid" },
];

const releaseStatusOptions = GAME_REALEASE_STATUS;
const visibilityStatusOptions = GAME_VISIBILITY_STATUS;
const GameInfoForm = ({ form }: { form: FormInstance<FieldType> }) => {
  const [allowDonate, setAllowDonate] = useState(true);
  const [isFree, setIsFree] = useState(true);
  const { isLoaded, gameInfo } = useManageGameStore();
  const {
    categories,
    fetchCategories,
    loading: loadingCategories,
  } = useCategoryStore();
  const { tags, fetchTags, loading: loadingTags } = useTagStore();
  const {
    ageRestrictions,
    fetchAgeRestrictions,
    loading: loadingAgeRestrictions,
  } = useAgeRestrictionStore();
  const {
    languages,
    fetchLanguages,
    loading: loadingLanguages,
  } = useLanguageStore();
  const onFinish: FormProps<FieldType>["onFinish"] = () => {};

  useEffect(() => {
    fetchCategories();
    fetchTags();
    fetchAgeRestrictions();
    fetchLanguages();
    if (isLoaded) {
      setIsFree(gameInfo.pricingOption == "Free");
    }
  }, []);

  const handleToggleRequireActivationKey = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      form.setFieldValue("visibility", "Draft");
    }
  };

  const handlePricingOptionChange = (e: RadioChangeEvent) => {
    form.setFieldValue("pricingOption", e.target.value);
    setIsFree(e.target.value == "Free");
    if (e.target.value == "Free") {
      form.setFieldValue("requireActivationKey", false);
    }
  };

  const averageSession = Form.useWatch("averageSession", form);
  const requireActivationKey = Form.useWatch("requireActivationKey", form);
  return (
    <Form
      form={form}
      name="upload-game-form"
      onFinish={onFinish}
      autoComplete="off"
      layout="vertical"
      initialValues={{
        price: 10_000,
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
        rules={[{ required: true, message: "Please select a release status" }]}
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
      <h2 className="text-2xl mb-3">Pricing</h2>
      <Form.Item<FieldType>
        extra={isFree && "The game's files will be freely available"}
        name={"pricingOption"}
        style={{ marginBottom: 10 }}
      >
        <Radio.Group
          options={pricingOptions}
          onChange={handlePricingOptionChange}
        />
      </Form.Item>
      <Form.Item<FieldType>
        name="price"
        label="Minimum price"
        rules={[
          { required: true, message: "Please a price" },
          { min: 10_000, message: "Game price must be at least 10.000₫" },
        ]}
        hidden={isFree}
        extra="Minimum price to pay to get download access to game"
        style={{ marginBottom: 10 }}
      >
        <InputNumber<number>
          min={10000}
          max={10000000}
          step={1000}
          style={{ width: 500 }}
          formatter={(value) =>
            `${value}  ₫`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value?.replace(/₫|\s|,/g, "") as unknown as number}
        />
      </Form.Item>
      <Form.Item<FieldType>
        name="allowDonate"
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
      <Form.Item<FieldType>
        name="requireActivationKey"
        valuePropName="checked"
        hidden={isFree}
        extra="Our platform provide API to validate player purchases. This will protect your game from piracy."
        style={{ marginBottom: 0 }}
      >
        <Checkbox onChange={handleToggleRequireActivationKey}>
          Use IndieGameZone activation key <FaKey className="inline ms-1" />
        </Checkbox>
      </Form.Item>
      <Link to={`/docs/api/overview`} className={isFree ? "hidden" : ""}>
        <p className="mb-2 text-blue-400 underline">Learn more</p>
      </Link>
      <h2 className="text-2xl mb-3">Visibility & Access</h2>
      <Form.Item<FieldType>
        name={"visibility"}
        rules={[
          { required: true, message: "Please select a visibility status" },
        ]}
        style={{ width: 500, marginBottom: 20 }}
      >
        <Radio.Group disabled={requireActivationKey}>
          <Space direction="vertical">
            {visibilityStatusOptions.map((opt) => (
              <div key={opt.value} style={{ padding: "4px 0" }}>
                <Radio value={opt.value}>{opt.label}</Radio>
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
    </Form>
  );
};

export default GameInfoForm;
