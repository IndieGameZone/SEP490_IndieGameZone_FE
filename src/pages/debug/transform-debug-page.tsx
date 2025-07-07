import TransformOriginDebugger from "@/pages/debug/transform-origin-debugger";
import CatTailUp from "@/assets/indiecat/cat_tail_up.svg";

const TransformDebugPage = () => {
  return (
    <TransformOriginDebugger elementWidth={75.685974} elementHeight={62.442017}>
        <img src={CatTailUp} alt="" />
    </TransformOriginDebugger>
  );
};

export default TransformDebugPage;
