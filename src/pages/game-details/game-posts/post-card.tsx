import { Avatar, Image, Tag } from "antd";
import { CiClock1 } from "react-icons/ci";
import { FaRegComment, FaRegHeart } from "react-icons/fa";
import { IoShareSocialOutline } from "react-icons/io5";

const PostCard = () => {
  return (
    <div>
      <div className="bg-zinc-800  w-full p-5 rounded-2xl">
        <div className="flex justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <Avatar src="https://cdn.lazi.vn/storage/uploads/users/avatar/1693142947_lazi_435254.jpg" />
            <span className="font-semibold text-lg ">mày tính múc tao à</span>
          </div>
          <div className="flex items-center gap-2 ">
            <CiClock1 />
            <span className="text-xs text-gray-400">2 days ago</span>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex flex-col gap-3">
            {" "}
            <span className="font-bold text-xl">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquid sed id veniam rerum possimus voluptas,
              modi qui dolor aspernatur.
            </span>
            <p className=" text-gray-400">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quas assumenda voluptatem fuga veritatis
              recusandae debitis, totam facere omnis ipsam enim, a doloribus soluta similique pariatur. Minus sit
              repudiandae id. Minima! A, voluptatum sequi iste facilis quisquam aliquam minima sed, aut reiciendis nulla
              omnis vero non molestiae at nam consequatur totam consequuntur quaerat deserunt distinctio. Ipsam
              provident expedita esse facilis nostrum? Modi debitis adipisci nostrum fugit dolor enim quia perspiciatis
              deleniti, voluptas laboriosam cum, mollitia libero repellat veritatis ullam. Doloremque asperiores atque
              eius impedit alias vero possimus quasi soluta, consectetur eveniet?
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
              <Image
                className="w-full h-[300px] object-cover rounded-lg mt-5"
                src="https://steamcdn-a.akamaihd.net/steam/apps/921800/header.jpg"
                alt="Post Image"
              />
              <Image
                className="w-full h-[300px] object-cover rounded-lg mt-5"
                src="https://steamcdn-a.akamaihd.net/steam/apps/921800/header.jpg"
                alt="Post Image"
              />
              <Image
                className="w-full h-[300px] object-cover rounded-lg mt-5"
                src="https://steamcdn-a.akamaihd.net/steam/apps/921800/header.jpg"
                alt="Post Image"
              />
            </div>
            <div>
              <Tag color="cyan" style={{ borderRadius: "9999px", padding: "2px 12px", fontSize: "13px" }}>
                #Announcement
              </Tag>
              <Tag color="cyan" style={{ borderRadius: "9999px", padding: "2px 12px", fontSize: "13px" }}>
                #Bug
              </Tag>
              <Tag color="cyan" style={{ borderRadius: "9999px", padding: "2px 12px", fontSize: "13px" }}>
                #Solution
              </Tag>
            </div>
          </div>
          <div>
            <div className="flex  items-center gap-4 mt-8">
              <div className="flex items-center gap-2 text-gray-400 ">
                <FaRegHeart  size={23} />
                <span>1000</span>
              </div>

              <div className="flex items-center gap-2 text-gray-400 ">
                <FaRegComment size={20} />
                <span>1000</span>
              </div>
              <div className="text-gray-400">
                <IoShareSocialOutline size={23} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
