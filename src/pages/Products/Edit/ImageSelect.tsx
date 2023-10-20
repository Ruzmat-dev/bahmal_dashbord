import { Button, Image } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { axiosPrivate } from "../../../api/axiosPrivate";
import { axiosPublic } from "../../../api/axiosPublic";
import IcBaselineAddPhotoAlternate from "../components/IcBaselineAddPhotoAlternate";
import styles from "./styles.module.css";

type ProductImages = {
  id: number;
  image: string;
  product: number;
};

function ImageSelect({ id }: { id: number }) {
  const [imageId, setImageId] = useState<number>(0)
  const fileRef = useRef<HTMLInputElement | null>(null)
  const fileRef1 = useRef<HTMLInputElement | null>(null)
  const [images, setImages] = useState<ProductImages[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const res = await axiosPublic("en").get<ProductImages[]>(
        `/product_images/?product=${id}`
      );
      setImages(res.data)
    } catch (error) {
      console.log(error)
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);




  const handleRemoveSubmit = async(id: number) => {
    try {
      await axiosPrivate.delete(`/product_images/${id}/`)
      fetchData()
    } catch (error) {
      console.log(error)
    }
  }




  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const updatedItems = [...images];
      const itemIndex = updatedItems.findIndex((item) => item.id === imageId);
      if (itemIndex !== -1) {
        updatedItems[itemIndex].image = URL.createObjectURL(e.target.files[0]);
        setImages(updatedItems);
      }

      try {
        const formData = new FormData()
        formData.append('image', e.target.files[0])
        formData.append('product', String(id))
        axiosPrivate.patch(`/product_images/${imageId}/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
      } catch (error) {
        console.log(error)
      }
    }
  }




  const handleAdd = async(e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      try {
        const formData = new FormData()
        formData.append('image', e.target.files[0])
        formData.append('product', String(id))
        await axiosPrivate.post(`/product_images/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })

        fetchData()
      } catch (error) {
        console.log(error)
      }
    }
    
  }
  return (
    <div>
      <div className={styles.container}>
        {images.map((item, index) => (
          <div key={index} className={styles.itemContainer}>
            <div className={styles.imagecontainer}>
              <Image
                style={{ height: "100%", width: "100%", objectFit: "cover" }}
                src={item.image}
              />
              <div className={styles.removebutton}>
                <Button onClick={() => {
                  fileRef.current?.click()
                  setImageId(item.id)
                }} variant="default" px={5}>
                  <IconPencil fontSize={24} />{" "}
                </Button>

                <Button onClick={() => handleRemoveSubmit(item.id)} variant="default" px={5} ml={5}>
                  <IconTrash fontSize={24} />{" "}
                </Button>
              </div>
            </div>
          </div>
        ))}

        {images.length !== 5 ? <div style={{ border: "none" }} className={styles.itemContainer}>
          <Button onClick={() => fileRef1.current?.click()} variant="default" h={100} w={100}>
              <IcBaselineAddPhotoAlternate fontSize={32} color="#bdbdbd" />{" "}
            </Button>
        </div> : null}
      </div>

      <input hidden type="file" onChange={handleChange} ref={fileRef} accept="image/*"/>
      <input hidden type="file" onChange={handleAdd} ref={fileRef1} accept="image/*"/>
    </div>
  );
}

export default ImageSelect;
