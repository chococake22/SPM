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
        <form>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div className="flex justify-center mb-3">
              <span className="text-3xl">Change Password</span>
            </div>
            <div className="mb-6">
              <label
                htmlFor="nowPwd"
                className="block mb-2 text-sm font-medium"
              >
                Now Password
              </label>
              <input
                type="password"
                id="nowPwd"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="•••••••••"
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="newPwd"
                className="block mb-2 text-sm font-medium"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPwd"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="•••••••••"
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="newPwdConfirm"
                className="block mb-2 text-sm font-medium"
              >
                New Password Confirm
              </label>
              <input
                type="password"
                id="newPwdConfirm"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="•••••••••"
                required
              />
            </div>
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Change
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </form>
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
