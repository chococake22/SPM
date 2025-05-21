'use client';

import React, { forwardRef, useImperativeHandle, useState } from 'react';

export interface ModalRef {
  open: () => void;
  close: () => void;
}

const TestModal = forwardRef<ModalRef>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }))

  if(!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl mb-4">모달입니다</h2>
        <button onClick={() => setIsOpen(false)} className="bg-blue-500 text-white px-4 py-2 rounded">
          닫기
        </button>
      </div>
    </div>
  );
});

/**
 * displayName은 디버깅이나 React DevTools에서 컴포넌트 이름을 정확히 보여주기 위해서 필요함
 * forwardRef를 쓰면 함수 이름이 사라지기 때문에 ESLint는 displayName 명시를 요구함
 */
TestModal.displayName = 'TestModal';

export default TestModal;
