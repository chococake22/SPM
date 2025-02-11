
import ItemBox from '../components/ItemBox';

const Home = () => {

  const data = [
    { item: 'apple', userId: 'test1' },
    { item: 'tree', userId: 'test2' },
    { item: 'banana', userId: 'test3' },
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