import fs from "fs";

const deleteLocalFile = (filePath) => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

export default deleteLocalFile;