interface itemDescriptionProps {
  itemName: string;
  description: string;
}

const itemDescription: React.FC<itemDescriptionProps> = ({
  itemName,
  description,
}) => {
  return (
    <div className="w-full h-[15%] border-2 border-green-700">
      <span className="ml-2">{itemName}</span>
      <p className="ml-2">{description}</p>
    </div>
  );
};

export default itemDescription;
