interface itemValuesProps {
  heartCnt: string;
  commentCnt: string;
}

const itemValues: React.FC<itemValuesProps> = ({ heartCnt, commentCnt }) => {
  return (
    <div className="w-full h-[10%] border-2 border-blue-400">
      <div className="ml-2">
        <span>하트</span>
        <span className="ml-1">{heartCnt}</span>
        <span className="ml-3">댓글</span>
        <span className="ml-1">{commentCnt}</span>
        <span className="ml-3">공유</span>
      </div>
    </div>
  );
};

export default itemValues;
