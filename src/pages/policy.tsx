import { Badge, Collapse, Typography } from "antd";
import { AiOutlineSafety } from "react-icons/ai";
import {
  FaBan,
  FaChevronDown,
  FaChild,
  FaCode,
  FaCopyright,
  FaCreditCard,
  FaDollarSign,
  FaDownload,
  FaEnvelope,
  FaGamepad,
  FaGavel,
  FaHeart,
  FaLock,
  FaShieldAlt,
  FaTrash,
  FaUndo,
  FaUserShield
} from "react-icons/fa";
import { MdBlock, MdPolicy, MdReportProblem, MdSecurity, MdWarning } from "react-icons/md";

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const PolicyPage = () => {
  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-zinc-900 via-black to-zinc-900 py-12 px-6 mb-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <MdPolicy className="text-5xl text-orange-500" />
            <Title level={1} className="!text-white !mb-0">
              Platform Policies
            </Title>
          </div>
          <Paragraph className="text-zinc-300 text-lg">
            Terms of Service, Privacy Policy, Content Guidelines & Developer Policies
          </Paragraph>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-12 space-y-8">
        {/* Terms of Service */}
        <Collapse
          defaultActiveKey={["1"]}
          expandIcon={({ isActive }) => (
            <FaChevronDown className={`text-orange-500 transition-transform ${isActive ? "rotate-180" : ""}`} />
          )}
          className="!bg-zinc-900 !border-zinc-700 rounded-lg overflow-hidden"
        >
          <Panel
            header={
              <div className="flex items-center gap-3 py-1">
                <FaShieldAlt className="text-2xl text-orange-500" />
                <span className="text-xl font-bold text-white">1. Terms of Service</span>
              </div>
            }
            key="1"
            className="!bg-zinc-800 !border-zinc-700"
          >
            <div className="space-y-6 p-4 bg-zinc-800 rounded-lg">
              <div className="flex items-start gap-4 bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                <AiOutlineSafety className="text-xl text-green-500 mt-1 flex-shrink-0" />
                <Text className="text-zinc-300">
                  Users must be at least{" "}
                  <Text strong className="text-orange-400">
                    13 years old
                  </Text>{" "}
                  (or as required by local law).
                </Text>
              </div>

              <div className="flex items-start gap-4 bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                <FaChild className="text-xl text-blue-500 mt-1 flex-shrink-0" />
                <Text className="text-zinc-300">
                  If under 14 years old, users must be{" "}
                  <Text strong className="text-orange-400">
                    closely supervised by parents
                  </Text>
                  .
                </Text>
              </div>

              <div className="flex items-start gap-4 bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                <FaBan className="text-xl text-red-500 mt-1 flex-shrink-0" />
                <Text className="text-zinc-300">
                  The platform must not be used for illegal purposes, cheating, hacking, or distributing malware.
                </Text>
              </div>

              <div className="flex items-start gap-4 bg-zinc-800 p-4 rounded-lg border border-orange-600">
                <MdWarning className="text-xl text-orange-500 mt-1 flex-shrink-0" />
                <Text className="text-zinc-300">
                  <Text strong className="text-orange-400">
                    Platform rights:
                  </Text>{" "}
                  the platform may suspend or terminate accounts that violate these terms.
                </Text>
              </div>

              <div className="flex items-start gap-4 bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                <FaDownload className="text-xl text-blue-500 mt-1 flex-shrink-0" />
                <Text className="text-zinc-300">
                  <Text strong className="text-orange-400">
                    User rights:
                  </Text>{" "}
                  User rights: users may download, purchase, and play games in accordance with the license provided by
                  the developer. And it is strictly forbidden to share paid games with others, otherwise it will violate
                  and bear all responsibilities of the platform and the law.
                </Text>
              </div>
            </div>
          </Panel>
        </Collapse>

        {/* Privacy Policy */}
        <Collapse
          expandIcon={({ isActive }) => (
            <FaChevronDown className={`text-orange-500 transition-transform ${isActive ? "rotate-180" : ""}`} />
          )}
          className="!bg-zinc-900 !border-zinc-700 rounded-lg overflow-hidden"
        >
          <Panel
            header={
              <div className="flex items-center gap-3 py-1">
                <FaUserShield className="text-2xl text-green-500" />
                <span className="text-xl font-bold text-white">2. Privacy Policy</span>
              </div>
            }
            key="1"
            className="!bg-zinc-800 !border-zinc-700"
          >
            <div className="space-y-6 p-4 bg-zinc-800 rounded-lg">
              <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                <div className="flex items-center gap-3 mb-3">
                  <MdSecurity className="text-xl text-blue-500" />
                  <Text strong className="text-orange-400 text-lg">
                    Data collected:
                  </Text>
                </div>
                <Text className="text-zinc-300 block ml-8">Email, payment information, usage analytics.</Text>
              </div>

              <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                <div className="flex items-center gap-3 mb-3">
                  <FaLock className="text-xl text-green-500" />
                  <Text strong className="text-orange-400 text-lg">
                    Use of data:
                  </Text>
                </div>
                <Text className="text-zinc-300 block ml-8">
                  To provide services, improve the platform, and process payments.
                </Text>
              </div>

              <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                <div className="flex items-center gap-3 mb-3">
                  <AiOutlineSafety className="text-xl text-purple-500" />
                  <Text strong className="text-orange-400 text-lg">
                    Data protection:
                  </Text>
                </div>
                <Text className="text-zinc-300 block ml-8">User data will not be sold to third parties.</Text>
              </div>

              <div className="flex items-start gap-4 bg-zinc-800 p-4 rounded-lg border border-blue-700">
                <FaTrash className="text-xl text-blue-500 mt-1 flex-shrink-0" />
                <Text className="text-zinc-300">Users have the right to request deletion of their personal data.</Text>
              </div>
            </div>
          </Panel>
        </Collapse>

        {/* Content Policy */}
        <Collapse
          expandIcon={({ isActive }) => (
            <FaChevronDown className={`text-orange-500 transition-transform ${isActive ? "rotate-180" : ""}`} />
          )}
          className="!bg-zinc-900 !border-zinc-700 rounded-lg overflow-hidden"
        >
          <Panel
            header={
              <div className="flex items-center gap-3 py-1">
                <FaGamepad className="text-2xl text-purple-500" />
                <span className="text-xl font-bold text-white">3. Content Policy</span>
              </div>
            }
            key="1"
            className="!bg-zinc-800 !border-zinc-700"
          >
            <div className="space-y-6 p-4 bg-zinc-800 rounded-lg">
              {/* Allowed Content */}
              <div className="bg-zinc-800 p-4 rounded-lg border border-green-700">
                <Badge
                  color="green"
                  text={
                    <Text strong className="text-green-400 text-lg">
                      Allowed:
                    </Text>
                  }
                  className="mb-3"
                />
                <div className="ml-8">
                  <Text className="text-zinc-300">
                    Indie games that are legal and have full intellectual property rights.
                  </Text>
                </div>
              </div>

              {/* Prohibited Content */}
              <div className="bg-zinc-800 p-4 rounded-lg border border-red-700">
                <Badge
                  color="red"
                  text={
                    <Text strong className="text-red-400 text-lg">
                      Prohibited:
                    </Text>
                  }
                  className="mb-3"
                />
                <div className="ml-8 space-y-4">
                  <div className="flex items-start gap-3">
                    <MdReportProblem className="text-xl text-red-500 mt-1 flex-shrink-0" />
                    <Text className="text-zinc-300">
                      Content that violates the law, promotes discrimination, child exploitation, or malware.
                    </Text>
                  </div>

                  <div className="flex items-start gap-3 bg-zinc-900 p-3 rounded border border-red-800">
                    <FaCopyright className="text-xl text-red-500 mt-1 flex-shrink-0" />
                    <Text className="text-zinc-300">Uploading games created by others without permission.</Text>
                  </div>
                </div>
              </div>

              {/* Consequences */}
              <div className="bg-zinc-800 p-4 rounded-lg border border-red-700">
                <div className="flex items-center gap-3 mb-3">
                  <FaGavel className="text-xl text-red-500" />
                  <Text strong className="text-red-400 text-lg">
                    Any violation will result in:
                  </Text>
                </div>
                <ul className="ml-8 space-y-2 text-zinc-300">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <Text strong className="text-red-400">
                      Account ban
                    </Text>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <Text strong className="text-red-400">
                      Removal of the uploaded game
                    </Text>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <Text className="text-zinc-300">
                      May be subject to{" "}
                      <Text strong className="text-red-400">
                        legal consequences
                      </Text>
                    </Text>
                  </li>
                </ul>
              </div>
            </div>
          </Panel>
        </Collapse>

        {/* Payment & Refund Policy */}
        <Collapse
          expandIcon={({ isActive }) => (
            <FaChevronDown className={`text-orange-500 transition-transform ${isActive ? "rotate-180" : ""}`} />
          )}
          className="!bg-zinc-900 !border-zinc-700 rounded-lg overflow-hidden"
        >
          <Panel
            header={
              <div className="flex items-center gap-3 py-1">
                <FaCreditCard className="text-2xl text-yellow-500" />
                <span className="text-xl font-bold text-white">4. Payment & Refund Policy</span>
              </div>
            }
            key="1"
            className="!bg-zinc-800 !border-zinc-700"
          >
            <div className="space-y-6 p-4 bg-zinc-800 rounded-lg">
              <div className="flex items-start gap-4 bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                <FaDollarSign className="text-xl text-green-500 mt-1 flex-shrink-0" />
                <Text className="text-zinc-300">Developers set the price of their games.</Text>
              </div>

              <div className="bg-zinc-800 p-4 rounded-lg border border-blue-700">
                <div className="flex items-center gap-3 mb-3">
                  <FaCreditCard className="text-xl text-blue-500" />
                  <Text strong className="text-orange-400 text-lg">
                    Service Fee:
                  </Text>
                </div>
                <Text className="text-zinc-300 ml-8">
                  The platform charges a{" "}
                  <Text strong className="text-orange-400">
                    20% service fee
                  </Text>{" "}
                  from the total game price set by the developer.
                </Text>
              </div>

              <div className="bg-zinc-800 p-4 rounded-lg border border-green-700">
                <div className="flex items-center gap-3 mb-3">
                  <FaHeart className="text-xl text-red-500" />
                  <Text strong className="text-orange-400 text-lg">
                    Donations:
                  </Text>
                </div>
                <Text className="text-zinc-300 ml-8">
                  <Text strong className="text-orange-400">
                    100% goes directly to the developer
                  </Text>
                  .
                </Text>
              </div>

              <div className="flex items-start gap-4 bg-zinc-800 p-4 rounded-lg border border-blue-700">
                <FaEnvelope className="text-xl text-blue-500 mt-1 flex-shrink-0" />
                <Text className="text-zinc-300">
                  Currently, there is{" "}
                  <Text strong className="text-white">
                    no refund mechanism
                  </Text>{" "}
                  on the platform. If users have concerns, they may contact the developer directly or the system via
                  email:{" "}
                  <Text strong className="text-orange-400">
                    indiegamezonecompany@gmail.com
                  </Text>
                </Text>
              </div>
            </div>
          </Panel>
        </Collapse>

        {/* Developer Policy */}
        <Collapse
          expandIcon={({ isActive }) => (
            <FaChevronDown className={`text-orange-500 transition-transform ${isActive ? "rotate-180" : ""}`} />
          )}
          className="!bg-zinc-900 !border-zinc-700 rounded-lg overflow-hidden"
        >
          <Panel
            header={
              <div className="flex items-center gap-3 py-1">
                <FaCode className="text-2xl text-red-500" />
                <span className="text-xl font-bold text-white">5. Developer Policy</span>
              </div>
            }
            key="1"
            className="!bg-zinc-800 !border-zinc-700"
          >
            <div className="space-y-6 p-4 bg-zinc-800 rounded-lg">
              <div className="bg-zinc-800 p-4 rounded-lg border border-green-700">
                <div className="flex items-center gap-3 mb-3">
                  <FaCopyright className="text-xl text-green-500" />
                  <Text strong className="text-orange-400 text-lg">
                    Intellectual Property:
                  </Text>
                </div>
                <Text className="text-zinc-300 ml-8">
                  Developers retain{" "}
                  <Text strong className="text-orange-400">
                    full intellectual property rights
                  </Text>{" "}
                  to their games.
                </Text>
              </div>

              <div className="bg-zinc-800 p-4 rounded-lg border border-orange-700">
                <Text strong className="text-orange-400 text-lg block mb-3">
                  Developers must guarantee:
                </Text>
                <div className="ml-8 space-y-4">
                  <div className="flex items-start gap-3">
                    <MdBlock className="text-xl text-red-500 mt-1 flex-shrink-0" />
                    <Text className="text-zinc-300">
                      Developers must ensure that their games do not violate copyrights or intellectual property rights
                      of third parties.
                    </Text>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800 p-4 rounded-lg border border-red-700">
                <div className="flex items-center gap-3 mb-3">
                  <FaGavel className="text-xl text-red-500" />
                  <Text strong className="text-red-400 text-lg">
                    Legal Responsibility:
                  </Text>
                </div>
                <Text className="text-zinc-300 ml-8">
                  In case of violations, developers are{" "}
                  <Text strong className="text-red-400">
                    fully responsible
                  </Text>{" "}
                  for any legal liabilities.
                </Text>
              </div>
            </div>
          </Panel>
        </Collapse>

        {/* Refund Policy for Commercial Registration Cancellations */}
        <Collapse
          expandIcon={({ isActive }) => (
            <FaChevronDown className={`text-orange-500 transition-transform ${isActive ? "rotate-180" : ""}`} />
          )}
          className="!bg-zinc-900 !border-zinc-700 rounded-lg overflow-hidden"
        >
          <Panel
            header={
              <div className="flex items-center gap-3 py-1">
                <FaUndo className="text-2xl text-blue-400" />
                <span className="text-xl font-bold text-white">
                  6. Refund Policy for Commercial Registration Cancellations
                </span>
              </div>
            }
            key="1"
            className="!bg-zinc-800 !border-zinc-700"
          >
            <div className="space-y-6 p-4 bg-zinc-800 rounded-lg">
              <div className="bg-zinc-800 p-4 rounded-lg border border-green-700">
                <div className="flex items-center gap-3 mb-3">
                  <FaUndo className="text-xl text-green-500" />
                  <Text strong className="text-green-400 text-lg">
                    More than 1 day prior to the start date:
                  </Text>
                </div>
                <Text className="text-zinc-300 ml-8">
                  <Text strong className="text-green-400">
                    70% refund
                  </Text>
                </Text>
              </div>

              <div className="bg-zinc-800 p-4 rounded-lg border border-blue-700">
                <div className="flex items-center gap-3 mb-3">
                  <FaUndo className="text-xl text-blue-500" />
                  <Text strong className="text-orange-400 text-lg">
                    From 24 hours to 12 hours before the start date:
                  </Text>
                </div>
                <Text className="text-zinc-300 ml-8">
                  <Text strong className="text-orange-400">
                    50% refund
                  </Text>
                </Text>
              </div>

              <div className="bg-zinc-800 p-4 rounded-lg border border-yellow-700">
                <div className="flex items-center gap-3 mb-3">
                  <FaUndo className="text-xl text-yellow-500" />
                  <Text strong className="text-orange-400 text-lg">
                    From 12 hours to 6 hours before the start date:
                  </Text>
                </div>
                <Text className="text-zinc-300 ml-8">
                  <Text strong className="text-orange-400">
                    30% refund
                  </Text>
                </Text>
              </div>

              <div className="bg-zinc-800 p-4 rounded-lg border border-red-700">
                <div className="flex items-center gap-3 mb-3">
                  <FaUndo className="text-xl text-red-500" />
                  <Text strong className="text-red-400 text-lg">
                    From 6 hours before until the start date (00:00):
                  </Text>
                </div>
                <Text className="text-zinc-300 ml-8">
                  <Text strong className="text-red-400">
                    No refund
                  </Text>
                </Text>
              </div>

              <div className="bg-zinc-800 p-4 rounded-lg border border-red-800">
                <div className="flex items-center gap-3 mb-3">
                  <FaBan className="text-xl text-red-500" />
                  <Text strong className="text-red-400 text-lg">
                    After the start date:
                  </Text>
                </div>
                <Text className="text-zinc-300 ml-8">
                  <Text strong className="text-red-400">
                    Cancellations are not allowed
                  </Text>
                </Text>
              </div>
            </div>
          </Panel>
        </Collapse>

        {/* Footer */}
        <div className="text-center py-8 border-t border-zinc-700 mt-8">
          <Text className="text-zinc-400">Last updated: {new Date().toLocaleDateString()}</Text>
          <br />
          <Text className="text-zinc-400">
            For questions or concerns, contact us at:{" "}
            <Text className="text-orange-400">indiegamezonecompany@gmail.com</Text>
          </Text>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;
