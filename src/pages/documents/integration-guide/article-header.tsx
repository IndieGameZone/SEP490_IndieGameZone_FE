const ArticleHeader = () => (
  <>
    <h2 className="mb-3 text-3xl font-bold" id="part-1">
      Integrating License Activation into Your Game — Sample Integration &
      Explanation
    </h2>
    <p className="mb-3 text-zinc-400">
      {new Date("2025-08-24").toDateString()}
    </p>
    <p>
      This article walks through a sample license-activation integration used by
      Unity games, explains what each part does, points out security and UX
      considerations, and shows how to adapt the same idea for other engines and
      platforms. The Unity sample (provided below) demonstrates a practical,
      client-driven activation flow that talks to an activation API:
    </p>
  </>
);
export default ArticleHeader;
