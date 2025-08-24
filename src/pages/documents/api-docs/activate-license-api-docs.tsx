import CodeBlock from "@/components/code-block";
import { useClipboard } from "@/hooks/use-clipboard";
import { Button, Tabs, TabsProps } from "antd";
import { FaRegCopy } from "react-icons/fa";
import { Link } from "react-router-dom";

const ActivateLicenseApiDocs = () => {
  const { isCopied, copyToClipboard } = useClipboard();

  const responseItems: TabsProps["items"] = [
    {
      key: "204",
      label: "204 Success",
      children: (
        <div>
          <span className="italic text-zinc-400">204 No Content</span>
          <p className="mt-1">
            <strong>Meaning: </strong>
            License key successfully activated for this game.
          </p>
        </div>
      ),
    },
    {
      key: "404",
      label: "404 Not Found",
      children: (
        <div>
          <p className="mb-1">
            <strong>Response body</strong>
          </p>
          <CodeBlock
            language="json"
            code={`{
  "type": "NotFoundException",
  "title": "An error occurred",
  "status": 404,
  "detail": "Key not found"
}
`}
          />
          <p className="mt-1">
            <strong>Meaning: </strong>
            The provided license key is invalid.
          </p>
        </div>
      ),
    },
    {
      key: "400",
      label: "400 Bad Request",
      children: (
        <div>
          <p className="mb-1">
            <strong>Response body</strong>
          </p>
          <CodeBlock
            language="json"
            code={`{
  "type": "BadRequestException",
  "title": "An error occurred",
  "status": 400,
  "detail": "Key already used"
}
`}
          />
          <p className="mt-1">
            <strong>Meaning: </strong>
            License key already activated on another machine.
          </p>
        </div>
      ),
    },
    {
      key: "500",
      label: "500 Internal Server Error",
      children: (
        <div>
          <p className="mb-1">
            <strong>Response body</strong>
          </p>
          <CodeBlock
            language="json"
            code={`{
  "type": "NulIReferenceException",
  "title": "An error occurred",
  "status": 500,
  "detail": "object reference not set to an instance of an object."
}
`}
          />
          <p className="mt-1">
            <strong>Meaning: </strong>
            Unexpected server-side error.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className=" grid grid-cols-12">
      <div className="col-span-8">
        <h2 className="mb-3 text-3xl font-bold">Activate License Key</h2>
        <p className="mb-3 text-zinc-400">
          {new Date("2025-08-23").toDateString()}
        </p>
        <p>
          Activates a license key for a specific game on the current machine.
        </p>

        <h3 className="uppercase text-zinc-400 mb-2 mt-5 border-b border-zinc-700">
          Base URL
        </h3>
        <CodeBlock
          language="bash"
          code={`https://indiegamezonese101.azurewebsites.net/api`}
        />
        <h3 className="uppercase text-zinc-400 mb-2 mt-7 border-b border-zinc-700">
          Endpoint
        </h3>
        <div className="flex gap-2 items-center p-3 bg-zinc-950 font-mono">
          <span className="bg-amber-500 px-2 py-0.5 text-xs text-white rounded">
            PUT
          </span>
          <span className="flex-1">{`/games/{gameId}/activation-keys/{licenseKey}/activation`}</span>
          <Button
            icon={<FaRegCopy />}
            type="text"
            size="small"
            onClick={() =>
              copyToClipboard(
                `https://indiegamezonese101.azurewebsites.net/api/games/{gameId}/activation-keys/{licenseKey}/activation`
              )
            }
          >
            {isCopied ? "Copied!" : "Copy"}
          </Button>
        </div>
        <h3 className="uppercase text-zinc-400 mb-2 mt-7 border-b border-zinc-700">
          Path Parameters
        </h3>
        <table className="params-table">
          <tr>
            <th>Parameter</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
          <tr>
            <td className="font-mono">
              gameId
              <br />
              <span className="text-rose-500">required</span>
            </td>
            <td className="text-zinc-400">string</td>
            <td>
              The unique identifier of the game (e.g.,{" "}
              <span className="text-blue-400">
                8072c445-1abe-4831-93cd-30d2a3681d3f
              </span>
              ).
            </td>
          </tr>
          <tr>
            <td className="font-mono">
              licenseKey
              <br />
              <span className="text-rose-500">required</span>
            </td>
            <td className="text-zinc-400">string</td>
            <td>The license key entered by the user.</td>
          </tr>
        </table>
        <h3 className="uppercase text-zinc-400 mb-2 mt-7 border-b border-zinc-700">
          Headers
        </h3>
        <table className="params-table">
          <tr>
            <th>Header</th>
            <th>Value</th>
          </tr>
          <tr>
            <td className="font-mono">Content-Type</td>
            <td className="font-mono">application/json</td>
          </tr>
        </table>
        <h3 className="uppercase text-zinc-400 mb-2 mt-7 border-b border-zinc-700">
          Request Body
        </h3>
        <p className="text-zinc-400 italic">No request body required.</p>
        <h3 className="uppercase text-zinc-400 mb-2 mt-7 border-b border-zinc-700">
          Responses Samples
        </h3>
        <Tabs defaultActiveKey="204" type="card" items={responseItems} />
        <h2 className="mt-10 mb-5 text-3xl font-bold" id="part-6">
          Next Steps
        </h2>
        <ul className="list-disc ps-5">
          <Link
            to={`/docs/api/integration-guide`}
            className="text-blue-400 hover:underline"
          >
            <li>Learn how to integrate</li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default ActivateLicenseApiDocs;
