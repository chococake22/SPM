'use client';

import { useUserInfo } from '@/hook/UserContext';
import {
  FormEvent,
  useState,
  useRef,
  useCallback,
} from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/lib/cropImage';
import { UploadItemRequest } from '@/types/item/type';
import itemService from '@/services/item.service';
import { useRouter } from 'next/navigation';


function AddItemPage() {
  const [text, setText] = useState('');
  const [image, setImage] = useState<Blob | null>(null);
  const { user } = useUserInfo();
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [hasImage, setHasImage] = useState<boolean>(false);
  const router = useRouter();
  const [data, setData] = useState<UploadItemRequest>({
    image: '',
    itemName: '',
    description: '',
  });

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [] // setData는 React에서 보장하는 stable 함수라 빈 배열로 OK
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!image) {
      alert('이미지를 선택해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('userId', user?.userId || ''); // 유저 정보에서 가져오기
    formData.append('username', user?.username || ''); // 유저 정보에서 가져오기
    formData.append('itemName', data.itemName);
    formData.append('description', data.description);
    formData.append('itemImg', image, 'profile.png');

    try {
      if(!confirm("아이템을 등록하시겠습니까?")) {
        return;
      }
      const response = await itemService.uploadItem(formData);
      if(response.success) {
        alert("아이템이 등록되었습니다.")
        router.push("/")
      }
      console.log(response)
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddImage = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImageSrc(result);
        setHasImage(true);
        setIsOpen(true);
      };

      reader.readAsDataURL(file);
      if (inputRef.current) {
        inputRef.current.value = ''; // 이 줄이 중요!
      }
    }
  };

  const onCropComplete = (_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const uploadCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
    setImage(croppedImage as Blob)
    const previewUrl = URL.createObjectURL(croppedImage as Blob);
    setPreview(previewUrl);
    setIsOpen(false);
    setImageFile(null);
    setImageSrc(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  return (
    <div className="flex w-full max-w-lg h-screen px-4">
      <div className='w-full h-full'>
        <form className='flex flex-col gap-5 justify-center w-full h-full' onSubmit={handleSubmit} encType="multipart/form-data" >
          <div
            onClick={handleAddImage}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className="flex w-full h-[50%] overflow-hidden border-[2px] hover:border-blue-500 transition-colors duration-200 cursor-pointer"
          >
            {preview ? (
              <img src={preview} alt="미리보기" className="w-full h-full" />
            ) : (
              <div className="flex w-full justify-center items-center">
                <span>이미지를 삽입해주세요.</span>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              ref={inputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <div>
            <label htmlFor="itemName" className="block mb-1 font-semibold">
              제목
            </label>
            <input
              id="itemName"
              type="text"
              name='itemName'
              value={data.itemName}
              onChange={handleInputChange}
              className="border rounded w-full p-2"
              placeholder="제목을 입력해주세요"
            />
          </div>
          <div>
            <label htmlFor="description" className="block mb-1 font-semibold">
              내용
            </label>
            <textarea
              id="description"
              name='description'
              value={data.description}
              onChange={handleInputChange}
              className="border rounded w-full p-2"
              placeholder="내용을 입력해주세요"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            등록하기
          </button>
        </form>
        {isOpen && (
          <div
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="bg-white rounded-lg shadow-lg w-[60%] p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">
                이미지 크기를 맞춰주세요
              </h2>
              <div className="flex justify-center">
                {imageSrc && (
                  <div className="relative w-[280px] h-[280px] overflow-hidden">
                    <Cropper
                      image={imageSrc}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-between">
                <button
                  onClick={uploadCroppedImage}
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
                >
                  업로드
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddItemPage;
