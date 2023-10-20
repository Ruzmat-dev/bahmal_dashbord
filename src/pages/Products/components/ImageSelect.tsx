import { Button, Image } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconTrash } from "@tabler/icons-react";
import { changeFiles } from "../../../app/features/filesSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import IcBaselineAddPhotoAlternate from "./IcBaselineAddPhotoAlternate";
import styles from "./styles.module.css";

function ImageSelect() {
  const { files } = useAppSelector((state) => state.filesSlice)
  const dispatch = useAppDispatch()

  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <div key={index} className={styles.itemContainer}>
        <div className={styles.imagecontainer}>
          <Image
            style={{ height: "100%", width: "100%", objectFit: "cover" }}
            src={imageUrl}
            onLoad={() => URL.revokeObjectURL(imageUrl)}
          />
          <div className={styles.removebutton}>
            <Button
              variant="default"
              px={5}
              onClick={() => {
                const rem = files.filter((i) => i !== file)
                dispatch(changeFiles(rem)) 
              }}
            >
              {" "}
              <IconTrash fontSize={24} />{" "}
            </Button>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div>
      <div className={styles.container}>
        {previews}

        {previews.length < 5 ? <div className={styles.itemContainerD}>
          <Dropzone
            accept={IMAGE_MIME_TYPE}
            onDrop={(e) => {
              const asas = files.concat(e);
              dispatch(changeFiles(asas)) 
            }}
          >
            <Button variant="default" h={100} w={100}>
              {" "}
              <IcBaselineAddPhotoAlternate fontSize={32} color="#bdbdbd" />{" "}
            </Button>
          </Dropzone>
        </div> : ''}
      </div>
    </div>
  );
}

export default ImageSelect;
