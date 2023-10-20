import { Button, Modal, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { AxiosError } from "axios"
import { useEffect, useRef, useState } from "react"
import toast, { Toaster } from 'react-hot-toast'
import { axiosPrivate } from "../../api/axiosPrivate"
import { getGalleries } from "../../api/data"
import MaterialSymbolsAddRounded from "../icons/MaterialSymbolsAddRounded"
import MaterialSymbolsDownload from "../icons/MaterialSymbolsDownload"
import AchievementsTable from "./Table"
import classes from "./galleries.module.css"

const Galleries = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [previewURL, setPreviewImage] = useState<string>('https://content.hostgator.com/img/weebly_image_sample.png');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false)

  const fileRef = useRef<HTMLInputElement | null>(null)

  const fetchDataGalleries = async () => {
    const res = await getGalleries()
    console.log(res)
  }


  useEffect(() => {
    fetchDataGalleries()
  }, [])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreviewImage(result)
      }
      setSelectedFile(file)
      reader.readAsDataURL(file)
    }
  };

  const postGalleries = async () => {
    setLoading(true);
  try {
    const formData = new FormData();
    formData.append('image', selectedFile!); 
    await axiosPrivate.post('/galleries/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    toast.success('Movafiqiyatli Qoshildi!');
    setLoading(false);
    fetchDataGalleries()
    close()
    } catch (error) {
      const axiosError = error as AxiosError;
      const myError = axiosError.request?.status ?? 0;
      const errorNumber = Math.floor(myError / 100);

      if (errorNumber === 4) {
        toast.error('Xato malumot kiritildi!');
      } else if (errorNumber === 5) {
        toast.error('Uzir hatoliq yuz berdi!');
      } else {
        toast.error('Internet aloqasi yo`q!');
      }
      setLoading(false)
      close()
    }
  }

  return (
    <>
      <Modal.Root opened={opened} onClose={close}>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Yangi surat qoshish</Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body className={classes.wrapperDonlowd}>
            <div className={classes.imgWrapper}>
              <div className={classes.imgWrapperItem} onClick={() => fileRef.current?.click()}>
                <span>
                  <MaterialSymbolsDownload fontSize={56} color='#6EB648' />
                </span>
              </div>
              <div className={classes.wrapperImages}>
                <input
                  hidden
                  ref={fileRef}
                  accept='image/*'
                  onChange={handleFileChange}
                  type="file"
                  id="picture"
                />

                <img
                  src={previewURL}
                  alt="Preview"
                />
              </div>
            </div>
            <Button loading={loading} disabled={loading} className={classes.send} bg="#6EB648"  onClick={postGalleries}> Yuborish </Button>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>

      <div className={classes.achievements}>
        <div className={classes.headerForm}>
          <Text c="#6EB648" size='xl' fw={'initial'}> Galleriya </Text>

          <div onClick={open}>
            <Button className={classes.addNewCategory} color='#6EB648' size="md">
              <MaterialSymbolsAddRounded fontWeight={700} fontSize={22} />
              <Text fw={'normal'} fs="48">Qoshish</Text>
            </Button>
          </div>
        </div>
        <AchievementsTable />
      </div>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
    </>
  )
}

export default Galleries