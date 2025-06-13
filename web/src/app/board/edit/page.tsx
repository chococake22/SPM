'use client';

import { useUserInfo } from '@/hook/UserContext';
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  FormEvent
} from 'react';
import { UploadBoardRequest } from '@/types/board/type';
import boardService from '@/services/board.service';
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
  const [data, setData] = useState<UploadBoardRequest>({
    title: '',
    content: '',
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

  useEffect(() => {
    console.log('???');
  }, [handleInputChange]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (confirm('등록하시겠습니까?')) {
      try {
        const response = await boardService.uploadBoard(data);
        if (response.success) {
          alert('등록되었습니다.');
        }
      } catch (error) {
        console.error(error);
      }
    }
  };



  const handleBack = () => {
    router.back()
  }

  return (
    <div className="flex w-full max-w-lg h-screen">
      <div className="w-full h-full">
        <div>sdssdfsdsdfsdfds</div>
        <form
          className="flex flex-col gap-5 justify-center w-full h-full"
          onSubmit={handleSubmit}
          method="POST"
        >
          <div>
            <label htmlFor="title" className="block mb-1 font-semibold">
              제목
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={data.title}
              onChange={handleInputChange}
              className="border rounded w-full p-2"
              placeholder="제목을 입력해주세요"
            />
          </div>
          <div>
            <label htmlFor="content" className="block mb-1 font-semibold">
              내용
            </label>
            <textarea
              id="content"
              name="content"
              value={data.content}
              onChange={handleInputChange}
              className="border rounded w-full h-[200px] p-2 resize-none"
              placeholder="내용을 입력해주세요"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              등록하기
            </button>
            <button
              type="button"
              onClick={handleBack}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              뒤로
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddItemPage;
