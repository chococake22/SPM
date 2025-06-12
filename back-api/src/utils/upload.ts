// src/middleware/upload.ts
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // fieldname 에 따라 저장 경로 분기
    let uploadDir: string;
    if (file.fieldname === 'profile') {
      uploadDir = path.join(__dirname, '../../../storage/profileImg');
    } else if (file.fieldname === 'itemImg') {
      uploadDir = path.join(__dirname, '../../../storage/itemImg');
    } else {
      // 기본 폴더
      uploadDir = path.join(__dirname, '../../../storage/other');
    }

    // 디렉토리가 없으면 생성
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}_${file.fieldname}${ext}`);
  },
});

const upload = multer({ storage });

export default upload;
