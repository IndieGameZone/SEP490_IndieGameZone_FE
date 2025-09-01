import CodeBlock from "@/components/code-block";
import { useClipboard } from "@/hooks/use-clipboard";
import { Button, Tabs, TabsProps } from "antd";
import { FaRegCopy } from "react-icons/fa";
import { Link } from "react-router-dom";

const LicenseStatusEndpointDocs = () => {
  const { isCopied, copyToClipboard } = useClipboard();

  const responseItems: TabsProps["items"] = [
    {
      key: "200",
      label: "200 OK",
      children: (
        <div>
          <p className="mb-1">
            <strong>Response body</strong>
          </p>
          <CodeBlock language="json" code={`"true"`} />
          <p className="mt-1">
            <strong>Meaning: </strong>
            The license key is still active and valid for use.
          </p>
          <CodeBlock language="json" code={`"false"`} />
          <p className="mt-1">
            <strong>Meaning: </strong>
            The license key is no longer active or has been revoked.
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
            The provided license key does not exist.
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
  "type": "Exception",
  "title": "An error occurred",
  "status": 500,
  "detail": "Unexpected server error"
}
`}
          />
          <p className="mt-1">
            <strong>Meaning: </strong>
            Something went wrong on the server side.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-8">
        <h2 className="mb-3 text-3xl font-bold">Check License Status</h2>
        <p className="mb-3 text-zinc-400">
          {new Date("2025-08-30").toDateString()}
        </p>
        <p>
          Checks if a license key is still active or has been revoked for a
          specific game.
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
          <span className="bg-green-500 px-2 py-0.5 text-xs text-white rounded">
            GET
          </span>
          <span className="flex-1">
            {`/games/{gameId}/activation-keys/{activationKey}/status`}
          </span>
          <Button
            icon={<FaRegCopy />}
            type="text"
            size="small"
            onClick={() =>
              copyToClipboard(
                `https://indiegamezonese101.azurewebsites.net/api/games/{gameId}/activation-keys/{activationKey}/status`
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
              activationKey
              <br />
              <span className="text-rose-500">required</span>
            </td>
            <td className="text-zinc-400">string</td>
            <td>The license key to check the status of.</td>
          </tr>
        </table>

        <h3 className="uppercase text-zinc-400 mb-2 mt-7 border-b border-zinc-700">
          Headers
        </h3>
        <p className="text-zinc-400 italic">No special headers required.</p>

        <h3 className="uppercase text-zinc-400 mb-2 mt-7 border-b border-zinc-700">
          Request Body
        </h3>
        <p className="text-zinc-400 italic">No request body required.</p>

        <h3 className="uppercase text-zinc-400 mb-2 mt-7 border-b border-zinc-700">
          Response Samples
        </h3>
        <Tabs defaultActiveKey="200" type="card" items={responseItems} />

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

export default LicenseStatusEndpointDocs;
