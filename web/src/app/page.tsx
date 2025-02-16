
import ItemBox from '../components/Item/ItemBox';

const Home = () => {

  const data = [
    {
      imageInfo: 'apple',
      userId: 'test1',
      profileImg: 'userimg1',
      heartCnt: '12',
      commentCnt: '3',
      itemName: '사과 10개',
      description: '겁나 달달한 사과임asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdsdfasdfasdfasdfasdfasdasdfasdasdf',
      
    },
    {
      imageInfo: 'tree',
      userId: 'test2',
      profileImg: 'userimg2',
      heartCnt: '5',
      commentCnt: '2',
      itemName: '나무 1세트',
      description: '아주 튼튼한 나무임',
    },
    {
      imageInfo: 'banana',
      userId: 'test3',
      profileImg: 'userimg3',
      heartCnt: '7',
      commentCnt: '1',
      itemName: '바나나 한송이',
      description: '달달하고 맛남',
    },
  ];

  return (
    <div className="mt-5 mb-10">
      {data.map((entry, index) => (
        <ItemBox key={index} entry={entry} />
      ))}
    </div>
  );
}

export default Home;